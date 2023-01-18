# required by proton
variable "environment" {
  description = "The Proton Environment"
  type = object({
    name   = string
    inputs = map(string)
  })
  default = null
}

variable "region" {
  description = "aws region"
  type        = string
  default     = "us-east-1"
}
