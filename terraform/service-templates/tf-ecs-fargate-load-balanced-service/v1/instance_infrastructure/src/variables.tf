variable "name" {
  description = "environment name"
  type        = string
}

variable "vpc_id" {
  description = "The VPC to use"
  type        = string
}

variable "private_subnet_one_id" {
  description = "private subnet 1"
  type        = string
}

variable "private_subnet_two_id" {
  description = "private subnet 2"
  type        = string
}

variable "public_subnet_one_id" {
  description = "public subnet 1"
  type        = string
}

variable "public_subnet_two_id" {
  description = "public subnet 2"
  type        = string
}

variable "task_execution_role" {
  description = "task execution role"
  type        = string
}

variable "cluster_name" {
  description = "name of the ecs cluster"
  type        = string
}

variable "container_port" {
  description = "The port the container listens on"
  type        = number
}

variable "task_size_cpu" {
  description = "map of task size to cpu mappings"
  type        = map(string)
  default = {
    "x-small" = "256"
    "small"   = "512"
    "medium"  = "1024"
    "large"   = "2048"
    "x-large" = "4096"
  }
}

variable "task_size_memory" {
  description = "map of task size to memory mappings"
  type        = map(string)
  default = {
    "x-small" = "512"
    "small"   = "1024"
    "medium"  = "2048"
    "large"   = "4096"
    "x-large" = "8192"
  }
}

variable "task_size" {
  description = "The size of the task"
  type        = string
}

variable "image" {
  description = "The container image to run"
  type        = string
}

variable "desired_count" {
  type        = number
  description = "The desired number of tasks to run behind the service"
}

variable "subnet_type" {
  type        = string
  description = "which subnet to run tasks in"
}

variable "health_check_path" {
  type        = string
  description = "The path to health check"
}

variable "logs_retention_in_days" {
  type        = number
  description = "Specifies the number of days you want to retain log events"
  default     = 30
}

variable "ecs_autoscale_min_instances" {
  description = "The minimum number of containers that should be running"
  type        = number
  default     = 1
}

variable "ecs_autoscale_max_instances" {
  description = "The maximum number of containers that should be running"
  type        = number
  default     = 8
}

variable "ecs_as_cpu_low_threshold_per" {
  description = "If the average CPU utilization over a minute drops to this threshold,the number of containers will be reduced (but not below ecs_autoscale_min_instances)"
  type        = number
  default     = 20
}

variable "ecs_as_cpu_high_threshold_per" {
  description = "If the average CPU utilization over a minute rises to this threshold, the number of containers will be increased (but not above ecs_autoscale_max_instances)"
  type        = number
  default     = 80
}
