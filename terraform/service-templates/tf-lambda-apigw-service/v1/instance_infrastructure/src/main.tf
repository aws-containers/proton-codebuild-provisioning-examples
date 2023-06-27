resource "aws_apigatewayv2_api" "lambda" {
  name          = var.name
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = [
      "GET",
      "HEAD",
      "OPTIONS",
      "POST",
    ]
  }
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id      = aws_apigatewayv2_api.lambda.id
  name        = "${var.name}-stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/apigw-lambda-service/${aws_apigatewayv2_api.lambda.name}"

  retention_in_days = 30
}

data "archive_file" "lambda_function_file" {
  type        = "zip"
  source_file = "${path.module}/function.js"
  output_path = "${path.module}/lambda_function.zip"
}

resource "aws_lambda_function" "lambda_function" {
  function_name = "${var.name}-function"
  role          = aws_iam_role.lambda_exec.arn
  memory_size   = var.memory_size
  timeout       = var.timeout

  # provide default function code if bucket is not provided
  runtime          = (var.s3_bucket != "") ? var.lambda_runtime : "nodejs18.x"
  filename         = (var.s3_bucket != "") ? null : data.archive_file.lambda_function_file.output_path
  source_code_hash = (var.s3_bucket != "") ? null : data.archive_file.lambda_function_file.output_base64sha256
  handler          = (var.s3_bucket != "") ? var.lambda_handler : "function.handler"
  s3_bucket        = (var.s3_bucket != "") ? var.s3_bucket : null
  s3_key           = (var.s3_bucket != "") ? var.s3_key : null

  dynamic "vpc_config" {
    for_each = var.vpc_access ? [1] : []
    content {
      subnet_ids         = var.vpc_subnet_ids
      security_group_ids = var.vpc_security_group_ids
    }
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.lambda_function.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "hello_world" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

resource "aws_iam_role" "lambda_exec" {
  name_prefix = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_exec_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "vpc" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
