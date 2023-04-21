# required by proton

# variable "pipeline" {
#   description = "the proton pipeline"
#   type = object({
#     inputs = any
#   })
# }

variable "service" {
  description = "proton service"
  type = object({
    name                      = string
    repository_id             = string
    repository_connection_arn = string
    branch_name               = string
  })
}

variable "service_instances" {
  description = "the service instances"
  type = list(
    object({
      name    = string
      inputs  = any
      outputs = any
      environment = object({
        account_id = string
        name       = string
        outputs    = any
      })
    })
  )
  default = null
}

variable "region" {
  description = "aws region"
  type        = string
  default     = "us-east-1"
}
