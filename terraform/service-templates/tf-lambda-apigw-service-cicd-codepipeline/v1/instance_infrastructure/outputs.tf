output "endpoint" {
  description = "The default endpoint for the HTTP API"
  value       = module.tf_lambda_apigw_service.endpoint
}

output "lambda_runtime" {
  description = "the lambda runtime passed in. needed for the service pipeline"
  value       = var.service_instance.inputs.lambda_runtime
}
