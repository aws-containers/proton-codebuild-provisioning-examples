import { App } from "aws-cdk-lib";
import { ContainerImageBuildPipeline } from "../lib/container-image-pipeline";
import input from "../proton-inputs.json";

const protonEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackName = `${input.service.name}-pipeline`;

const app = new App();

new ContainerImageBuildPipeline(app, "ProtonPipeline", {
  env: protonEnv,
  stackName: stackName,
});

app.synth();
