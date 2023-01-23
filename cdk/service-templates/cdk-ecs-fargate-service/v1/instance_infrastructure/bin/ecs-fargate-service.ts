import { App } from "aws-cdk-lib";
import { EcsFargateServiceStack } from "../lib/ecs-fargate-service";
import input from "../proton-inputs.json";

const protonEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackName = input.service.name;

const app = new App();

new EcsFargateServiceStack(app, "ProtonSvc", {
  env: protonEnv,
  stackName: stackName,
});

app.synth();
