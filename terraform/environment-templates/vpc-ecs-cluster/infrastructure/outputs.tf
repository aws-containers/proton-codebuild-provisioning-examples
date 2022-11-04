output "cluster_name" {
  value = module.fargate_env.cluster_name
}

output "cluster_arn" {
  value = module.fargate_env.cluster_arn
}

output "service_taskdef_execution_role" {
  value = module.fargate_env.service_taskdef_execution_role
}

output "vpc_id" {
  value = module.fargate_env.vpc_id
}

output "public_subnet_one_id" {
  value = module.fargate_env.public_subnet_one_id
}

output "public_subnet_two_id" {
  value = module.fargate_env.public_subnet_two_id
}

output "private_subnet_one_id" {
  value = module.fargate_env.private_subnet_one_id
}

output "private_subnet_two_id" {
  value = module.fargate_env.private_subnet_two_id
}
