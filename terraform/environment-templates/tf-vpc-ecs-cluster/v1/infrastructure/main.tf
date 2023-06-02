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
  region = var.region
  default_tags {
    tags = {
      "proton:environment" = var.environment.name
    }
  }
}

module "fargate_env" {
  source = "./src"

  name                    = var.environment.name
  vpc_cidr                = var.environment.inputs.vpc_cidr
  private_subnet_one_cidr = var.environment.inputs.private_subnet_one_cidr
  private_subnet_two_cidr = var.environment.inputs.private_subnet_two_cidr
  public_subnet_one_cidr  = var.environment.inputs.public_subnet_one_cidr
  public_subnet_two_cidr  = var.environment.inputs.public_subnet_two_cidr
}
