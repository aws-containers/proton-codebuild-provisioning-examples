import * as awsx from "@pulumi/awsx";
import input from "./proton-inputs.json";

const envName = input.environment.name;
const envInputs = input.environment.inputs;

// https://www.pulumi.com/docs/guides/crosswalk/aws/vpc/
const vpc = new awsx.ec2.Vpc(envName, {});

// https://www.pulumi.com/docs/guides/crosswalk/aws/ecs/
const ecsCluster = new awsx.ecs.Cluster(envName, {
  vpc: vpc,
  settings: [
    {
      name: "containerInsights",
      value: envInputs.enhanced_cluster_monitoring ? "enabled" : "disabled",
    },
  ],
});

export const vpcId = vpc.id;
export const privateSubnetIds = vpc.privateSubnetIds;
export const publicSubnetIds = vpc.publicSubnetIds;
export const ecsClusterName = ecsCluster.cluster.name;
export const ecsClusterId = ecsCluster.cluster.id;
