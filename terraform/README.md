# Terraform Proton Examples

This directory is home to sample Terraform templates to gain an understanding of how one can leverage Terraform with AWS Proton via Codebuild provisioning.

## Bootstrap

Prior to running Terraform in Proton, you'll need a place to store Terraform state.  For the examples, you'll use an AWS S3 bucket for this purpose.

You can bring your own S3 bucket, or create one using Terraform by running the `make bootstrap` command.

```sh
cd terraform/bootstrap
make bootstrap
```

Then take the bucket name and add it in the template [manifest.yaml](./environment-templates/vpc-ecs-cluster/infrastructure/manifest.yaml) files.  You can also specify the Terraform version and AWS region you'd like to use.

```yaml
env:
  variables:
    TF_VERSION: 1.3.4
    AWS_REGION: us-east-1
    TF_STATE_BUCKET: [add S3 bucket name here]
```

## Examples

Example [environment](./environment-templates/README.md) and [service](./service-templates/README.md) templates under their respective directories.

Follow the [README](./environment-templates/vpc-ecs-cluster/README.md) [files](./service-templates/ecs-fargate-load-balanced-service/README.md) in the template directories for instructions on how to register them with AWS Proton.
