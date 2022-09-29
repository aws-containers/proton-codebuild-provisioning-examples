# Pulumi Proton Examples

This directory is home to sample Pulumi templates to gain an understanding of how one can leverage Pulumi with AWS Proton via Codebuild provisioning.

### Requirements

#### Personal Access Token

In order to interact with Pulumi API's, you will need to create a [Personal Access Token](https://www.pulumi.com/docs/intro/pulumi-service/accounts/#access-tokens) and store it in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html).
Codebuild will reference this secret which is defined in the manifest file. More information on this in the manifest section below.

#### Manifest

- Environment variables
  - To avoid duplication, set the pulumi organization and pulumi namespace as environment variables in the manifest.
  - In order for the Pulumi CLI to connect back to Pulumi, you will need to reference the secret from Secrets Manager.
  ```yaml
  env:
  variables:
    PULUMI_ORG: adamjkeller
    PULUMI_NAMESPACE: proton-environment
  secrets_manager:
    PULUMI_ACCESS_TOKEN: "proton/pulumi-access-token:Secret"
  ```
- Gathering the outputs to send to AWS Proton post deployment.
  - If you want Proton to consume outputs from your stack, there is a very small [shell script](./pulumi-to-proton-outputs.sh) that is included in this repo that will convert the outputs into the required JSON for Proton to consume.
  ```yaml
  - pulumi stack output --json | ./pulumi-to-proton-outputs.sh > outputs.json
  ```
- Post deployment

  - Proton needs to be notified when the deployment is complete. If the Codebuild job fails, Proton will surface that information. On success, the following command needs to be ran:

  ```bash
  aws proton notify-resource-deployment-status-change --resource-arn $RESOURCE_ARN --status IN_PROGRESS --outputs file://./outputs.json
  ```

### Examples

In the root of the `./pulumi` directory we have the following examples:

1. An example [manifest](./manifest.yaml) file that covers the requirements to have a successful deployment.
2. The output rendering [script](./pulumi-to-proton-outputs.sh).
3. Example [environment](./environment-templates/) and [service](./service-templates/) templates under their respective directories.
