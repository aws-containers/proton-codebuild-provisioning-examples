import { App } from "aws-cdk-lib";
import { VpcEcsClusterStack } from "../lib/vpc-ecs-cluster-stack";

const protonEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new VpcEcsClusterStack(app, "proton-cdk-demo", {
  env: protonEnv,
  stackName: process.env.STACK_NAME,
});

app.synth();
