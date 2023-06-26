variable "name" {
  description = "the name of the service"
  type        = string
}

variable "lambda_runtime" {
  description = "The Lambda runtime"
  type        = string
  default     = "nodejs18.x"
}

variable "s3_bucket" {
  description = "The S3 bucket location containing the function's deployment package"
  type        = string
  default     = ""
}

variable "s3_key" {
  description = "The S3 key of an object containing the function's deployment package"
  type        = string
  default     = ""
}

variable "lambda_handler" {
  description = "The function entrypoint in your code"
  type        = string
  default     = ""
}

variable "memory_size" {
  description = "Amount of memory in MB your Lambda Function can use at runtime. Defaults to 128."
  type        = number
  default     = 128
}

variable "timeout" {
  description = "The amount of time your Lambda Function has to run in seconds. Defaults to 3."
  type        = number
  default     = 3
}

variable "vpc_access" {
  description = "whether or not vpc access is enabled"
  type        = bool
  default     = false
}

variable "vpc_subnet_ids" {
  description = "A list of subnet IDs associated with the Lambda function"
  type        = list(string)
  default     = []
}

variable "vpc_security_group_ids" {
  description = "A list of security group IDs associated with the Lambda function"
  type        = list(string)
  default     = []
}
