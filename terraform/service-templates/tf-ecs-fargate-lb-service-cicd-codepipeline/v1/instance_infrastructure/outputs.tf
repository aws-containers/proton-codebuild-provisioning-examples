output "endpoint" {
  description = "the provisioned endpoint"
  value       = module.load_balanced_fargate_svc.endpoint
}
