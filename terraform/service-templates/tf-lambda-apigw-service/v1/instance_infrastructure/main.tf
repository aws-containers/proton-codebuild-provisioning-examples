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
      "proton:environment"      = var.environment.name
      "proton:service"          = var.service.name,
      "proton:service_instance" = var.service_instance.name,
    }
  }
}


module "tf_lambda_apigw_service" {
  source = "./src"

  name           = "${var.service.name}-${var.service_instance.name}"
  lambda_handler = var.service_instance.inputs.lambda_handler
  lambda_runtime = var.service_instance.inputs.lambda_runtime
  memory_size    = var.service_instance.inputs.memory_size
  s3_bucket      = var.service_instance.inputs.s3_bucket
  s3_key         = var.service_instance.inputs.s3_key
  timeout        = var.service_instance.inputs.timeout
  vpc_access     = var.service_instance.inputs.vpc_access

  # get vpc config from environment output
  vpc_security_group_ids = [var.environment.outputs.default_security_group_id]
  vpc_subnet_ids = (var.service_instance.inputs.subnet_type == "private" ?
    [var.environment.outputs.private_subnet_one_id, var.environment.outputs.private_subnet_two_id] :
  [var.environment.outputs.public_subnet_one_id, var.environment.outputs.public_subnet_two_id])
}
