terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      "proton:environment"      = var.environment.name,
      "proton:service"          = var.service.name,
      "proton:service_instance" = var.service_instance.name,
    }
  }
}

module "load_balanced_fargate_svc" {
  source = "./src"

  # name based on proton input
  name = "${var.environment.name}-${var.service.name}-${var.service_instance.name}"

  # environment output
  vpc_id                = var.environment.outputs.vpc_id
  public_subnet_one_id  = var.environment.outputs.public_subnet_one_id
  public_subnet_two_id  = var.environment.outputs.public_subnet_two_id
  private_subnet_one_id = var.environment.outputs.private_subnet_one_id
  private_subnet_two_id = var.environment.outputs.private_subnet_two_id
  cluster_name          = var.environment.outputs.cluster_name
  task_execution_role   = var.environment.outputs.service_taskdef_execution_role

  # service input
  container_port    = var.service_instance.inputs.port
  task_size         = var.service_instance.inputs.task_size
  image             = var.service_instance.inputs.image
  desired_count     = var.service_instance.inputs.desired_count
  subnet_type       = var.service_instance.inputs.subnet_type
  health_check_path = var.service_instance.inputs.health_check_path
}
