# Bootstrap

Prior to running Terraform in Proton, you'll need a place to store Terraform state.  For the examples, you'll use an AWS S3 bucket for this purpose.

You can bring your own S3 bucket, or create one using Terraform by running the following commands.

```sh
cd terraform/bootstrap
terraform init && terraform apply
```

Then take the bucket name and add it in the template [manifest.yaml](../environment-templates/vpc-ecs-cluster/infrastructure/manifest.yaml) files.  You can also specify the Terraform version and AWS region you'd like to use.

```yaml
env:
  variables:
    TF_VERSION: 1.3.4
    AWS_REGION: us-east-1
    TF_STATE_BUCKET: [add S3 bucket name here]
```

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 4.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | ~> 4.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_s3_bucket.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket) | resource |
| [aws_s3_bucket_public_access_block.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block) | resource |
| [aws_s3_bucket_server_side_encryption_configuration.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_server_side_encryption_configuration) | resource |
| [aws_s3_bucket_versioning.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |

## Inputs

No inputs.

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_s3_bucket"></a> [s3\_bucket](#output\_s3\_bucket) | the s3 bucket that was created |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
