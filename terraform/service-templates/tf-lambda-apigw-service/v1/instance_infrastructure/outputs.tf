output "endpoint" {
  description = "The default endpoint for the HTTP API"
  value       = module.tf-lambda-apigw-service.endpoint
}
