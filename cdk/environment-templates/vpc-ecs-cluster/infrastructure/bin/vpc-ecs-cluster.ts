import { App } from "aws-cdk-lib";
import { VpcEcsClusterStack } from "../lib/vpc-ecs-cluster-stack";
import input from "../proton-inputs.json";

const protonEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackName = input.environment.name;

const app = new App();

new VpcEcsClusterStack(app, "ProtonEnv", {
  env: protonEnv,
  stackName: stackName,
});

app.synth();
