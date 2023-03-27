variable "name" {
  description = "namespace used for all resources"
  type        = string
}

variable "service_name" {
  description = "name of the associated service"
  type        = string
}

variable "service_source_dir" {
  description = "Source directory for the service"
  type        = string
}

variable "unit_test_command" {
  description = "the command to run for unit tests"
  type        = string
}

variable "dockerfile" {
  description = "the location of the Dockerfile"
  type        = string
}

variable "repository_connection_arn" {
  description = "repository connection arn"
  type        = string
}

variable "repository_id" {
  description = "repository_id"
  type        = string
}

variable "branch_name" {
  description = "the name of the git branch"
  type        = string
}

variable "service_instances" {
  description = "list of service instances to deploy to. typically just one"
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
}
