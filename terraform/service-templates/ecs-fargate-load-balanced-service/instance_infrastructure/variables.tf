# required by proton

variable "environment" {
  type = object({
    name       = string
    account_id = string
    outputs = map(string)
  })
}

variable "service" {
  type = object({
    name                      = string
    repository_id             = string
    repository_connection_arn = string
    branch_name               = string
  })
}

variable "service_instance" {
  type = object({
    name   = string
    inputs = map(string)
  })
}

variable "region" {
  description = "aws region"
  type        = string
  default     = "us-east-1"
}
