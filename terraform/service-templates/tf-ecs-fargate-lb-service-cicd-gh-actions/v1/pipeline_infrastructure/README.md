This is a Terraform module that is provisioned by AWS Proton

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 4.0 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_cicd_pipeline"></a> [cicd\_pipeline](#module\_cicd\_pipeline) | ./src | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_region"></a> [region](#input\_region) | aws region | `string` | `"us-east-1"` | no |
| <a name="input_service"></a> [service](#input\_service) | proton service | <pre>object({<br>    name                      = string<br>    repository_id             = string<br>    repository_connection_arn = string<br>    branch_name               = string<br>  })</pre> | n/a | yes |
| <a name="input_service_instances"></a> [service\_instances](#input\_service\_instances) | the service instances | <pre>list(<br>    object({<br>      name    = string<br>      inputs  = any<br>      outputs = any<br>      environment = object({<br>        account_id = string<br>        name       = string<br>        outputs    = any<br>      })<br>    })<br>  )</pre> | `null` | no |

## Outputs

No outputs.
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
