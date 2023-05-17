import { Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deployment from "aws-cdk-lib/aws-s3-deployment";
import input from "../proton-inputs.json";

export class ContainerImageBuildPipeline extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const serviceOutputs: { [index: string]: any } = input.service;
    const pipelineInputs: { [index: string]: any } = input.pipeline.inputs;
    const splitRepoName: string[] = serviceOutputs.repository_id.split("/");
    const buildPipeline = new codepipeline.Pipeline(this, "BuildPipeline", {});
    const sourceOutput = new codepipeline.Artifact();
    let sourceAction;

    const helperBucket = new s3.Bucket(this, "HelperBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    new s3Deployment.BucketDeployment(this, "HelperBucketDeployment", {
      sources: [s3Deployment.Source.asset("./scripts")],
      destinationBucket: helperBucket,
    });

    const buildSpec = codebuild.BuildSpec.fromObject({
      version: 0.2,
      phases: {
        pre_build: {
          commands: [
            "echo Logging in to Amazon ECR...",
            `aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin ${
              Stack.of(this).account
            }.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com`,
          ],
        },
        build: {
          commands: [
            `${pipelineInputs.unit_test_command}`,
            "export IMAGE_TAG=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION| cut -c 1-7)",
            'echo "Commit Hash == $IMAGE_TAG"',
            "echo Build started on `date`",
            "echo Building the Docker image...",
            "docker build -t $ECR_REPO:$IMAGE_TAG -t $ECR_REPO:latest -f $DOCKERFILE_LOCATION .",
          ],
        },
        post_build: {
          commands: [
            "echo Build completed on `date`",
            "echo Pushing the Docker image...",
            "docker push $ECR_REPO:$IMAGE_TAG",
            "docker push $ECR_REPO:latest",
            `outputs=$(aws proton list-service-pipeline-outputs --service-name ${serviceOutputs.name})`,
            `echo $outputs`,
            "imageTagOutputExists=$(echo $outputs | jq '.[] | map(select(.key == \"ImageTag\")) | length')",
            'if [ $imageTagOutputExists -eq 0 ]; then echo $outputs | jq --arg x $IMAGE_TAG \'.[] += [{"key": "ImageTag", "valueString": $x}] | .[]\' > output.json;else echo $outputs| jq --arg x "$IMAGE_TAG" \'(.outputs[] | select(.key == "ImageTag") | .valueString) |= $x |.[]\' > output.json;fi',
            "cat output.json",
            `arn="$(aws proton get-service --name ${serviceOutputs.name} | jq -r '.service.arn')/pipeline"`,
            "echo $arn",
            `aws s3 cp s3://${helperBucket.bucketName}/ecr_policy_updater.py ./ecr_policy_updater.py`,
            "python ./ecr_policy_updater.py",
            `aws proton notify-resource-deployment-status-change --resource-arn $arn --outputs file://./output.json`,
          ],
        },
      },
    });

    sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: "GitHubSource",
      output: sourceOutput,
      connectionArn: serviceOutputs.repository_connection_arn,
      owner: splitRepoName[0],
      repo: splitRepoName[1],
      branch: serviceOutputs.branch_name,
    });

    const ecrRepo = new ecr.Repository(this, "ECRRepo", {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Grant access to this image in the accounts using it
    const ecrRepositoryPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability",
      ],
      principals: [
        new iam.ArnPrincipal(`arn:aws:iam::${Stack.of(this).account}:root`),
      ],
    });

    ecrRepo.addToResourcePolicy(ecrRepositoryPolicyStatement);

    new CfnOutput(this, "RepositoryURI", {
      value: ecrRepo.repositoryUri,
    });

    const buildProject = new codebuild.PipelineProject(this, "BuildProject", {
      buildSpec: buildSpec,
      environmentVariables: {
        ECR_REPO: {
          value: ecrRepo.repositoryUri,
        },
        DOCKERFILE_LOCATION: {
          value: pipelineInputs.dockerfile,
        },
        REPO_NAME: {
          value: ecrRepo.repositoryName,
        },
        SERVICE_NAME: {
          value: serviceOutputs.name,
        },
        PROTON_ACCT_ID: {
          value: Stack.of(this).account,
        },
      },
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        privileged: true,
      },
    });

    const environments: string[] = Array.from(
      new Set(
        input.service_instances.map(
          (service: any) =>
            `arn:aws:proton:${Stack.of(this).region}:${
              Stack.of(this).account
            }:environment/${service.environment.name}`
        )
      )
    );

    buildProject.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["proton:ListServiceInstances"],
        resources: ["*"],
      })
    );

    buildProject.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ecr:GetRepositoryPolicy",
          "ecr:SetRepositoryPolicy",
          "ecr:PutRegistryPolicy",
        ],
        resources: [ecrRepo.repositoryArn],
      })
    );

    buildProject.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "proton:List*",
          "proton:Get*",
          "proton:NotifyResourceDeploymentStatusChange",
        ],
        resources: [
          ...environments,
          `arn:aws:proton:${Stack.of(this).region}:${
            Stack.of(this).account
          }:service/${serviceOutputs.name}`,
          `arn:aws:proton:${Stack.of(this).region}:${
            Stack.of(this).account
          }:service/${serviceOutputs.name}/service-instance/*`,
          `arn:aws:proton:${Stack.of(this).region}:${
            Stack.of(this).account
          }:service/${serviceOutputs.name}/pipeline`,
        ],
      })
    );

    helperBucket.grantRead(buildProject);
    ecrRepo.grantPullPush(buildProject);

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: "CodeBuild",
      project: buildProject,
      input: sourceOutput,
      outputs: [new codepipeline.Artifact()],
    });

    buildPipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });

    buildPipeline.addStage({
      stageName: "Build",
      actions: [buildAction],
    });

    new CfnOutput(this, "PipelineEndpoint", {
      value: `https://${
        Stack.of(this).region
      }.console.aws.amazon.com/codesuite/codepipeline/pipelines/${
        buildPipeline.pipelineName
      }/view?region=${Stack.of(this).region}`,
    });
  }
}
