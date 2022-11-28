output "endpoint" {
  description = "the provisioned endpoint"
  value       = module.load-balanced-fargate-svc.endpoint
}
