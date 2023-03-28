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
      "proton:service"  = var.service.name,
      "proton:pipeline" = var.service.name
    }
  }
}

module "cicd_pipeline" {
  source = "./src"

  proton_service           = var.service.name
  proton_service_instances = var.service_instances
  repository_id            = var.service.repository_id
  branch_name              = var.service.branch_name
}
