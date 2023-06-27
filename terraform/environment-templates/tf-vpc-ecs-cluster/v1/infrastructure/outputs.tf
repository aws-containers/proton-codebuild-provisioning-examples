output "cluster_name" {
  description = "cluster name"
  value       = module.fargate_env.cluster_name
}

output "cluster_arn" {
  description = "cluster arn"
  value       = module.fargate_env.cluster_arn
}

output "service_taskdef_execution_role" {
  description = "task execution role"
  value       = module.fargate_env.service_taskdef_execution_role
}

output "vpc_id" {
  description = "vpc id"
  value       = module.fargate_env.vpc_id
}

output "public_subnet_one_id" {
  description = "public subnet one"
  value       = module.fargate_env.public_subnet_one_id
}

output "public_subnet_two_id" {
  description = "public subnet two"
  value       = module.fargate_env.public_subnet_two_id
}

output "private_subnet_one_id" {
  description = "private subnet one"
  value       = module.fargate_env.private_subnet_one_id
}

output "private_subnet_two_id" {
  description = "private subnet two"
  value       = module.fargate_env.private_subnet_two_id
}

output "default_security_group_id" {
  description = "Default security group for VPC"
  value       = module.fargate_env.default_security_group_id
}

output "tf_state_bucket" {
  description = "Terraform state bucket name"
  value       = var.tf_state_bucket
}
