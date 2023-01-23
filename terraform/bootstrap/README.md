# Bootstrap

Prior to running Terraform in Proton, you'll need a place to store Terraform state. For the examples, you'll use an AWS S3 bucket for this purpose.

You can bring your own S3 bucket, or create one using Terraform by running the following commands.

```sh
cd terraform/bootstrap
terraform init && terraform apply
```

When deploying the environment, you have the option to pass in the bucket and region details as inputs on creation. You can also update the [schema.yaml](../environment-templates/tf-vpc-ecs-cluster/infrastructure/schema.yaml) file and change the defaults for the state bucket, state bucket region, and AWS region.

```
aws_region:
  title: AWS Region
  type: string
  description: AWS Region where resources will reside
  default: us-east-1
tf_state_bucket:
  title: Terraform state storage S3 bucket
  type: string
  description: S3 Bucket to store Terraform state
  default: s3-bucket-name-here
tf_state_bucket_region:
  title: State bucket AWS Region
  type: string
  description: AWS Region where state bucket resides
  default: us-east-1
```

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

## Requirements

| Name                                                                     | Version |
| ------------------------------------------------------------------------ | ------- |
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 1.0  |
| <a name="requirement_aws"></a> [aws](#requirement_aws)                   | ~> 4.0  |

## Providers

| Name                                             | Version |
| ------------------------------------------------ | ------- |
| <a name="provider_aws"></a> [aws](#provider_aws) | ~> 4.0  |

## Modules

No modules.

## Resources

| Name                                                                                                                                                                                  | Type        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [aws_s3_bucket.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)                                                                           | resource    |
| [aws_s3_bucket_public_access_block.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_public_access_block)                                   | resource    |
| [aws_s3_bucket_server_side_encryption_configuration.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_server_side_encryption_configuration) | resource    |
| [aws_s3_bucket_versioning.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_versioning)                                                     | resource    |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity)                                                         | data source |

## Inputs

No inputs.

## Outputs

| Name                                                           | Description                    |
| -------------------------------------------------------------- | ------------------------------ |
| <a name="output_s3_bucket"></a> [s3_bucket](#output_s3_bucket) | the s3 bucket that was created |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
