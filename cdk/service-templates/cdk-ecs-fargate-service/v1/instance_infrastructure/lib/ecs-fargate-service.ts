import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { EcsAlbStack } from "./load-balancer";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import input from "../proton-inputs.json";

export class EcsFargateServiceStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const environmentOutputs: { [index: string]: any } = input.environment;
    const instanceInputs: { [index: string]: any } = input.service_instance;
    const stackName = props.stackName ?? input.environment.name;
    const taskSize = setTaskSize();

    const importedVpc = ec2.Vpc.fromLookup(this, "VPCImport", {
      vpcId: environmentOutputs.outputs.VPCId,
    });

    const importedCluster = ecs.Cluster.fromClusterAttributes(
      this,
      "ClusterImport",
      {
        clusterName: environmentOutputs.outputs.ECSClusterName,
        vpc: importedVpc,
        securityGroups: JSON.parse(
          environmentOutputs.outputs.ECSClusterSecGrps
        ),
      }
    );

    function setTaskSize() {
      if (instanceInputs.inputs.task_size === "x-small") {
        return {
          cpu: 256,
          memory: 512,
        };
      } else if (instanceInputs.inputs.task_size === "small") {
        return {
          cpu: 512,
          memory: 1024,
        };
      } else if (instanceInputs.inputs.task_size === "medium") {
        return {
          cpu: 1024,
          memory: 2048,
        };
      } else if (instanceInputs.inputs.task_size === "large") {
        return {
          cpu: 2048,
          memory: 4096,
        };
      } else if (instanceInputs.inputs.task_size === "x-large") {
        return {
          cpu: 4096,
          memory: 8192,
        };
      } else {
        return {
          cpu: 256,
          memory: 512,
        };
      }
    }

    // Eventually enable EC2 as compute option
    const taskDef = new ecs.FargateTaskDefinition(this, "TaskDef", {
      cpu: taskSize.cpu,
      memoryLimitMiB: taskSize.memory,
    });

    const portMappingName = `${stackName}-${instanceInputs.name}`;
    const envVarMap: { [index: string]: string } = {};

    if (instanceInputs.inputs?.env_vars !== undefined) {
      for (const envArray of instanceInputs.inputs.env_vars) {
        const kv = envArray.split("=");
        envVarMap[kv[0]] = kv[1];
      }
    }

    const containerDef = taskDef.addContainer("main", {
      image: ecs.ContainerImage.fromRegistry(instanceInputs.inputs.image),
      portMappings: [
        { containerPort: instanceInputs.inputs.port, name: portMappingName },
      ],
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: `ecs-${instanceInputs.name}`,
      }),
      environment: envVarMap,
    });

    const serviceConnectInputs: ecs.ServiceConnectProps = {
      namespace: environmentOutputs.outputs.ECSClusterSDNamespace,
      services: [
        {
          portMappingName: portMappingName,
          port: instanceInputs.inputs.port,
          discoveryName:
            instanceInputs.inputs.service_discovery_name ??
            `${input.service.name}-${instanceInputs.name}`,
        },
      ],
    };

    const ecsService = new ecs.FargateService(this, "EcsFargateSvc", {
      taskDefinition: taskDef,
      enableExecuteCommand: true,
      vpcSubnets: importedVpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      }),
      cluster: importedCluster,
      circuitBreaker: {
        rollback: false,
      },
      desiredCount: instanceInputs.inputs.desired_count,
      serviceConnectConfiguration: serviceConnectInputs,
      securityGroups: [
        ec2.SecurityGroup.fromSecurityGroupId(
          this,
          "secGrpShared",
          environmentOutputs.outputs.SharedSecGrp
        ),
      ],
    });

    if (instanceInputs.inputs.load_balanced) {
      const alb = new EcsAlbStack(this, "LB", {
        containerPort: instanceInputs.inputs.port,
        listenerPort: 80,
        public: instanceInputs.inputs.load_balanced_public,
        vpc: importedVpc,
        stackName: stackName,
      });
      ecsService.attachToApplicationTargetGroup(alb.targetGroup);
      ecsService.connections.allowFrom(
        alb.lbSecGrp,
        ec2.Port.tcp(instanceInputs.inputs.port)
      );
    }

    new CfnOutput(this, "ServiceDiscoveryName", {
      value:
        `${instanceInputs.inputs.service_discovery_name}.${environmentOutputs.outputs.ECSClusterSDNamespace}` ??
        `${input.service.name}-${instanceInputs.name}.${environmentOutputs.outputs.ECSClusterSDNamespace}`,
    });
  }
}
