This is a standard Terraform module that can be used and tested outside of AWS Proton.

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_vpc"></a> [vpc](#module\_vpc) | terraform-aws-modules/vpc/aws | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_ecs_cluster.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster) | resource |
| [aws_ecs_cluster_capacity_providers.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_cluster_capacity_providers) | resource |
| [aws_iam_role.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy_attachment.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment) | resource |
| [aws_availability_zones.available](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/availability_zones) | data source |
| [aws_iam_policy_document.ecs_task_execution_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_name"></a> [name](#input\_name) | The name of this environment | `string` | n/a | yes |
| <a name="input_private_subnet_one_cidr"></a> [private\_subnet\_one\_cidr](#input\_private\_subnet\_one\_cidr) | The CIDR range for private subnet one | `string` | `"10.0.128.0/18"` | no |
| <a name="input_private_subnet_two_cidr"></a> [private\_subnet\_two\_cidr](#input\_private\_subnet\_two\_cidr) | The CIDR range for private subnet two | `string` | `"10.0.192.0/18"` | no |
| <a name="input_public_subnet_one_cidr"></a> [public\_subnet\_one\_cidr](#input\_public\_subnet\_one\_cidr) | The CIDR range for public subnet one | `string` | `"10.0.0.0/18"` | no |
| <a name="input_public_subnet_two_cidr"></a> [public\_subnet\_two\_cidr](#input\_public\_subnet\_two\_cidr) | The CIDR range for public subnet two | `string` | `"10.0.64.0/18"` | no |
| <a name="input_vpc_cidr"></a> [vpc\_cidr](#input\_vpc\_cidr) | The CIDR range for the VPC | `string` | `"10.0.0.0/16"` | no |

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
| <a name="output_vpc_id"></a> [vpc\_id](#output\_vpc\_id) | vpc id |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
