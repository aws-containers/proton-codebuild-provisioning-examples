variable "proton_service" {
  description = "the name of the proton service"
  type        = string
}

variable "proton_service_instances" {
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

variable "repository_id" {
  description = "the proton pipeline connected git repo"
  type        = string
}

variable "branch_name" {
  description = "the repo branch to deploy"
  type        = string
}
