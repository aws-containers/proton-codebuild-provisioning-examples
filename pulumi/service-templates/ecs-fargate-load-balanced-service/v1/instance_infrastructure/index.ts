import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import input from "./proton-inputs.json";

// Proton Inputs
const envName = input.environment.name;
const envInputs = input.environment.outputs;
const svcName = input.service.name;
const svcInputs = input.service_instance.inputs;

// https://www.pulumi.com/docs/guides/continuous-delivery/aws-code-services/
const config = new pulumi.Config();
const stack = pulumi.getStack();
const org = config.require("org");
const stackRef = new pulumi.StackReference(
  `${org}/proton-environment/environment-${envName}`
);

// Pulumi Stack References from environment
const vpcId = stackRef.getOutput("vpcId");
const publicSubnetIds = stackRef.getOutput("publicSubnetIds");
const privateSubnetIds = stackRef.getOutput("privateSubnetIds");
const ecsClusterName = stackRef.getOutput("ecsClusterName");

const vpc = awsx.ec2.Vpc.fromExistingIds(svcName, { vpcId });

const ecsCluster = new awsx.ecs.Cluster(svcName, {
  cluster: ecsClusterName,
  vpc: vpc,
});

const lbSecGrp = new aws.ec2.SecurityGroup(`${svcName}-lb-ecs`, {
  description: "Load Balancer security group",
  vpcId: vpc.id,
  ingress: [
    {
      cidrBlocks: ["0.0.0.0/0"],
      fromPort: 80,
      toPort: 80,
      protocol: "tcp",
    },
  ],
  egress: [
    {
      toPort: svcInputs.containerPort,
      fromPort: svcInputs.containerPort,
      protocol: "tcp",
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
});

const loadBalancer = new aws.lb.LoadBalancer(svcName, {
  internal: false,
  subnets: publicSubnetIds,
  securityGroups: [lbSecGrp.id],
  loadBalancerType: "application",
  name: `${svcName}-alb`,
});

const targetGroup = new aws.lb.TargetGroup(`${svcName}Tg`, {
  vpcId: vpc.id,
  targetType: "ip",
  protocol: "HTTP",
  deregistrationDelay: 30,
  port: svcInputs.containerPort,
});

const lbListener = new aws.lb.Listener(svcName, {
  port: 80,
  protocol: "HTTP",
  loadBalancerArn: loadBalancer.arn,
  defaultActions: [
    {
      type: "forward",
      targetGroupArn: targetGroup.arn,
    },
  ],
});

const svcSecGrp = new aws.ec2.SecurityGroup(`${svcName}-ecs-svc`, {
  description: "Load balancer to ECS Service",
  vpcId: vpc.id,
  egress: [
    {
      fromPort: 0,
      toPort: 0,
      protocol: "all",
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  ingress: [
    {
      securityGroups: [lbSecGrp.id],
      fromPort: svcInputs.containerPort,
      toPort: svcInputs.containerPort,
      protocol: "tcp",
    },
  ],
});

const taskExecRole = new aws.iam.Role(svcName, {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "",
        Effect: "Allow",
        Principal: {
          Service: "ecs-tasks.amazonaws.com",
        },
        Action: "sts:AssumeRole",
      },
    ],
  },
  managedPolicyArns: [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  ],
});

const taskDefinition = new aws.ecs.TaskDefinition(svcName, {
  family: svcName,
  cpu: "512",
  memory: "1024",
  networkMode: "awsvpc",
  requiresCompatibilities: ["FARGATE"],
  containerDefinitions: JSON.stringify([
    {
      name: svcName,
      image: svcInputs.container_image_uri,
      cpu: 512,
      memory: 1024,
      essential: true,
      portMappings: [
        {
          containerPort: 80,
          hostPort: 80,
        },
      ],
    },
  ]),
});

const service = new aws.ecs.Service(svcName, {
  taskDefinition: taskDefinition.arn,
  cluster: ecsCluster.id,
  desiredCount: svcInputs.desiredCount,
  launchType: "FARGATE",
  loadBalancers: [
    {
      containerName: svcName,
      containerPort: svcInputs.containerPort,
      targetGroupArn: targetGroup.arn,
    },
  ],
  networkConfiguration: {
    subnets: privateSubnetIds,
    securityGroups: [svcSecGrp.id],
  },
});

// Outputs for Proton
export const httpUrl: pulumi.Output<string> = pulumi.interpolate`http://${loadBalancer.dnsName}/`;
