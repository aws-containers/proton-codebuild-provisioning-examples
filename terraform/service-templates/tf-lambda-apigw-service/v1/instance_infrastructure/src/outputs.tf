output "endpoint" {
  description = "The default endpoint for the HTTP API"
  value       = aws_apigatewayv2_stage.lambda.invoke_url
}
