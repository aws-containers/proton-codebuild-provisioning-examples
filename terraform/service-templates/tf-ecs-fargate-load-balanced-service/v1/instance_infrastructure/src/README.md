This is a standard Terraform module that can be used and tested outside of AWS Proton.

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [aws_alb.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/alb) | resource |
| [aws_alb_listener.http](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/alb_listener) | resource |
| [aws_appautoscaling_policy.app_down](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_policy.app_up](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_policy) | resource |
| [aws_appautoscaling_target.app_scale_target](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/appautoscaling_target) | resource |
| [aws_cloudwatch_log_group.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_log_group) | resource |
| [aws_cloudwatch_metric_alarm.cpu_utilization_high](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_cloudwatch_metric_alarm.cpu_utilization_low](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cloudwatch_metric_alarm) | resource |
| [aws_ecs_service.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service) | resource |
| [aws_ecs_task_definition.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_task_definition) | resource |
| [aws_iam_role.app_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role) | resource |
| [aws_iam_role_policy.app_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy) | resource |
| [aws_lb_target_group.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_target_group) | resource |
| [aws_security_group.sg_lb](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group.sg_task](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group) | resource |
| [aws_security_group_rule.ingress_lb_http](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.sg_lb_egress_rule](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.sg_task_egress_rule](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_security_group_rule.sg_task_ingress_rule](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group_rule) | resource |
| [aws_caller_identity.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/caller_identity) | data source |
| [aws_iam_policy_document.app_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_iam_policy_document.app_role_assume_role_policy](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |
| [aws_region.current](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/region) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_cluster_name"></a> [cluster\_name](#input\_cluster\_name) | name of the ecs cluster | `string` | n/a | yes |
| <a name="input_container_port"></a> [container\_port](#input\_container\_port) | The port the container listens on | `number` | n/a | yes |
| <a name="input_desired_count"></a> [desired\_count](#input\_desired\_count) | The desired number of tasks to run behind the service | `number` | n/a | yes |
| <a name="input_ecs_as_cpu_high_threshold_per"></a> [ecs\_as\_cpu\_high\_threshold\_per](#input\_ecs\_as\_cpu\_high\_threshold\_per) | If the average CPU utilization over a minute rises to this threshold, the number of containers will be increased (but not above ecs\_autoscale\_max\_instances) | `number` | `80` | no |
| <a name="input_ecs_as_cpu_low_threshold_per"></a> [ecs\_as\_cpu\_low\_threshold\_per](#input\_ecs\_as\_cpu\_low\_threshold\_per) | If the average CPU utilization over a minute drops to this threshold,the number of containers will be reduced (but not below ecs\_autoscale\_min\_instances) | `number` | `20` | no |
| <a name="input_ecs_autoscale_max_instances"></a> [ecs\_autoscale\_max\_instances](#input\_ecs\_autoscale\_max\_instances) | The maximum number of containers that should be running | `number` | `8` | no |
| <a name="input_ecs_autoscale_min_instances"></a> [ecs\_autoscale\_min\_instances](#input\_ecs\_autoscale\_min\_instances) | The minimum number of containers that should be running | `number` | `1` | no |
| <a name="input_health_check_path"></a> [health\_check\_path](#input\_health\_check\_path) | The path to health check | `string` | n/a | yes |
| <a name="input_image"></a> [image](#input\_image) | The container image to run | `string` | n/a | yes |
| <a name="input_logs_retention_in_days"></a> [logs\_retention\_in\_days](#input\_logs\_retention\_in\_days) | Specifies the number of days you want to retain log events | `number` | `30` | no |
| <a name="input_name"></a> [name](#input\_name) | environment name | `string` | n/a | yes |
| <a name="input_private_subnet_one_id"></a> [private\_subnet\_one\_id](#input\_private\_subnet\_one\_id) | private subnet 1 | `string` | n/a | yes |
| <a name="input_private_subnet_two_id"></a> [private\_subnet\_two\_id](#input\_private\_subnet\_two\_id) | private subnet 2 | `string` | n/a | yes |
| <a name="input_public_subnet_one_id"></a> [public\_subnet\_one\_id](#input\_public\_subnet\_one\_id) | public subnet 1 | `string` | n/a | yes |
| <a name="input_public_subnet_two_id"></a> [public\_subnet\_two\_id](#input\_public\_subnet\_two\_id) | public subnet 2 | `string` | n/a | yes |
| <a name="input_subnet_type"></a> [subnet\_type](#input\_subnet\_type) | which subnet to run tasks in | `string` | n/a | yes |
| <a name="input_task_execution_role"></a> [task\_execution\_role](#input\_task\_execution\_role) | task execution role | `string` | n/a | yes |
| <a name="input_task_size"></a> [task\_size](#input\_task\_size) | The size of the task | `string` | n/a | yes |
| <a name="input_task_size_cpu"></a> [task\_size\_cpu](#input\_task\_size\_cpu) | map of task size to cpu mappings | `map(string)` | <pre>{<br>  "large": "2048",<br>  "medium": "1024",<br>  "small": "512",<br>  "x-large": "4096",<br>  "x-small": "256"<br>}</pre> | no |
| <a name="input_task_size_memory"></a> [task\_size\_memory](#input\_task\_size\_memory) | map of task size to memory mappings | `map(string)` | <pre>{<br>  "large": "4096",<br>  "medium": "2048",<br>  "small": "1024",<br>  "x-large": "8192",<br>  "x-small": "512"<br>}</pre> | no |
| <a name="input_vpc_id"></a> [vpc\_id](#input\_vpc\_id) | The VPC to use | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_endpoint"></a> [endpoint](#output\_endpoint) | the provisioned endpoint |
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
