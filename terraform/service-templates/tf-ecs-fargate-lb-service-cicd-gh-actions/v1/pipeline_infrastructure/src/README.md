This is a standard Terraform module that can be used and tested outside of AWS Proton.

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |
| <a name="provider_local"></a> [local](#provider\_local) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_ecr_repository.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecr_repository) | resource |
| [aws_iam_role.github_actions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [local_file.workflow](https://registry.terraform.io/providers/hashicorp/local/latest/docs/resources/file) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_openid_connect_provider.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_openid_connect_provider) | data source |
| [aws_iam_policy_document.github_actions_assume_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_branch_name"></a> [branch\_name](#input\_branch\_name) | the repo branch to deploy | `string` | n/a | yes |
| <a name="input_proton_service"></a> [proton\_service](#input\_proton\_service) | the name of the proton service | `string` | n/a | yes |
| <a name="input_proton_service_instances"></a> [proton\_service\_instances](#input\_proton\_service\_instances) | the service instances | <pre>list(<br>    object({<br>      name    = string<br>      inputs  = any<br>      outputs = any<br>      environment = object({<br>        account_id = string<br>        name       = string<br>        outputs    = any<br>      })<br>    })<br>  )</pre> | `null` | no |
| <a name="input_repository_id"></a> [repository\_id](#input\_repository\_id) | the proton pipeline connected git repo | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
