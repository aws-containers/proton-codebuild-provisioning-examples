This is a Terraform module that is provisioned by AWS Proton.

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | ~> 5.0 |

## Providers

No providers.

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_fargate_env"></a> [fargate\_env](#module\_fargate\_env) | ./src | n/a |

## Resources

No resources.

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_environment"></a> [environment](#input\_environment) | The Proton Environment | <pre>object({<br>    name   = string<br>    inputs = map(string)<br>  })</pre> | `null` | no |
| <a name="input_region"></a> [region](#input\_region) | aws region | `string` | `"us-east-1"` | no |
| <a name="input_tf_state_bucket"></a> [tf\_state\_bucket](#input\_tf\_state\_bucket) | Terraform state bucket name. This is merely a passthrough so we can conveniently output it back to proton | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_cluster_arn"></a> [cluster\_arn](#output\_cluster\_arn) | cluster arn |
| <a name="output_cluster_name"></a> [cluster\_name](#output\_cluster\_name) | cluster name |
| <a name="output_default_security_group_id"></a> [default\_security\_group\_id](#output\_default\_security\_group\_id) | Default security group for VPC |
| <a name="output_private_subnet_one_id"></a> [private\_subnet\_one\_id](#output\_private\_subnet\_one\_id) | private subnet one |
| <a name="output_private_subnet_two_id"></a> [private\_subnet\_two\_id](#output\_private\_subnet\_two\_id) | private subnet two |
| <a name="output_public_subnet_one_id"></a> [public\_subnet\_one\_id](#output\_public\_subnet\_one\_id) | public subnet one |
| <a name="output_public_subnet_two_id"></a> [public\_subnet\_two\_id](#output\_public\_subnet\_two\_id) | public subnet two |
| <a name="output_service_taskdef_execution_role"></a> [service\_taskdef\_execution\_role](#output\_service\_taskdef\_execution\_role) | task execution role |
| <a name="output_tf_state_bucket"></a> [tf\_state\_bucket](#output\_tf\_state\_bucket) | Terraform state bucket name |
| <a name="output_vpc_id"></a> [vpc\_id](#output\_vpc\_id) | vpc id |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
