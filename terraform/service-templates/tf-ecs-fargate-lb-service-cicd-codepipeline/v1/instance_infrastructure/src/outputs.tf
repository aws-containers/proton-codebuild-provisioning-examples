output "endpoint" {
  description = "the provisioned endpoint"
  value       = "http://${aws_alb.main.dns_name}"
}
