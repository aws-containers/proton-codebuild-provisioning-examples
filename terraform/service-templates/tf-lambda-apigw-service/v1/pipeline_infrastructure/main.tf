terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {}
}

provider "aws" {
  default_tags {
    tags = {
      "proton:service"  = var.service.name,
      "proton:pipeline" = var.service.name,
    }
  }
}

module "cicd_pipeline" {
  source = "./src"

  # name based on proton input
  name = var.service.name

  # service input
  service_name              = var.service.name
  repository_connection_arn = var.service.repository_connection_arn
  repository_id             = var.service.repository_id
  branch_name               = var.service.branch_name

  # service instances
  service_instances = var.service_instances

  # pipeline input
  code_dir          = var.pipeline.inputs.code_dir
  packaging_command = var.pipeline.inputs.packaging_command
  unit_test_command = var.pipeline.inputs.unit_test_command
}
