output "cluster_name" {
  description = "cluster name"
  value       = aws_ecs_cluster.main.name
}

output "cluster_arn" {
  description = "cluster arn"
  value       = aws_ecs_cluster.main.arn
}

output "service_taskdef_execution_role" {
  description = "task execution role"
  value       = aws_iam_role.main.arn
}

output "vpc_id" {
  description = "vpc id"
  value       = module.vpc.vpc_id
}

output "public_subnet_one_id" {
  description = "public subnet one"
  value       = module.vpc.public_subnets[0]
}

output "public_subnet_two_id" {
  description = "public subnet two"
  value       = module.vpc.public_subnets[1]
}

output "private_subnet_one_id" {
  description = "private subnet one"
  value       = module.vpc.private_subnets[0]
}

output "private_subnet_two_id" {
  description = "private subnet two"
  value       = module.vpc.private_subnets[1]
}

output "default_security_group_id" {
  description = "Default security group for VPC"
  value       = module.vpc.default_security_group_id
}
