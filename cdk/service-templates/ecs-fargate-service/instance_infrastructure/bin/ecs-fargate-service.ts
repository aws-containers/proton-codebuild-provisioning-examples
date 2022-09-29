import { App } from "aws-cdk-lib";
import { EcsFargateServiceStack } from "../lib/ecs-fargate-service";

const protonEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new EcsFargateServiceStack(app, "proton", {
  env: protonEnv,
  stackName: process.env.STACK_NAME,
});

app.synth();
