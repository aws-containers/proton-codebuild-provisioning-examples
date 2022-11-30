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
| <a name="module_load_balanced_fargate_svc"></a> [load\_balanced\_fargate\_svc](#module\_load\_balanced\_fargate\_svc) | ./src | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_environment"></a> [environment](#input\_environment) | proton environment | <pre>object({<br>    name       = string<br>    account_id = string<br>    outputs    = map(string)<br>  })</pre> | n/a | yes |
| <a name="input_region"></a> [region](#input\_region) | aws region | `string` | `"us-east-1"` | no |
| <a name="input_service"></a> [service](#input\_service) | proton service | <pre>object({<br>    name                      = string<br>    repository_id             = string<br>    repository_connection_arn = string<br>    branch_name               = string<br>  })</pre> | n/a | yes |
| <a name="input_service_instance"></a> [service\_instance](#input\_service\_instance) | proton service instance | <pre>object({<br>    name   = string<br>    inputs = map(string)<br>  })</pre> | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_endpoint"></a> [endpoint](#output\_endpoint) | the provisioned endpoint |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
