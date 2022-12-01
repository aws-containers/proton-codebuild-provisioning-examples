variable "name" {
  description = "The name of this environment"
  type        = string
}

variable "vpc_cidr" {
  description = "The CIDR range for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnet_one_cidr" {
  description = "The CIDR range for private subnet one"
  type        = string
  default     = "10.0.128.0/18"
}

variable "private_subnet_two_cidr" {
  description = "The CIDR range for private subnet two"
  type        = string
  default     = "10.0.192.0/18"
}

variable "public_subnet_one_cidr" {
  description = "The CIDR range for public subnet one"
  type        = string
  default     = "10.0.0.0/18"
}

variable "public_subnet_two_cidr" {
  description = "The CIDR range for public subnet two"
  type        = string
  default     = "10.0.64.0/18"
}
