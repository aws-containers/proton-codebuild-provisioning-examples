# AWS Cloud Development Kit (CDK) Proton Examples

This directory is home to sample AWS CDK templates to gain an understanding of how one can leverage the AWS CDK with AWS Proton via Codebuild provisioning.

### Requirements

Install the AWS CDK CLI

```
npm i aws-cdk
```

#### Bootstrap

Prior to launching CDK Stacks, a [bootstrap](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_bootstrap) needs to occur for your AWS account and region.

#### Manifest

- Gathering the outputs to send to AWS Proton post deployment.

  - If you want Proton to consume outputs from your stack, there is a very small [shell script](./cdk-to-proton.sh) that is included in this repo that will convert the outputs into the required JSON for Proton to consume.

  ```bash
  cat proton-outputs.json | ./cdk-to-proton.sh > outputs.json
  ```

- Post deployment

  - Proton needs to be notified when the deployment is complete. If the Codebuild job fails, Proton will surface that information. On success, the following command needs to be ran:

  ```bash
  aws proton notify-resource-deployment-status-change --resource-arn $RESOURCE_ARN --outputs file://./outputs.json
  ```

### Examples

In the root of the `./cdk` directory we have the following examples:

1. An example [manifest](./manifest.yaml) file that covers the requirements to have a successful deployment.
2. The output rendering [script](./cdk-to-proton.sh).
3. Example [environment](./environment-templates/) and [service](./service-templates/) templates under their respective directories.
