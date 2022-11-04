output "cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "cluster_arn" {
  value = aws_ecs_cluster.main.arn
}

output "service_taskdef_execution_role" {
  value = aws_iam_role.main.arn
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_one_id" {
  value = module.vpc.public_subnets[0]
}

output "public_subnet_two_id" {
  value = module.vpc.public_subnets[1]
}

output "private_subnet_one_id" {
  value = module.vpc.private_subnets[0]
}

output "private_subnet_two_id" {
  value = module.vpc.private_subnets[1]
}
