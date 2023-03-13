# Terraform Proton Examples

This directory is home to sample Terraform templates to gain an understanding of how one can leverage Terraform with AWS Proton via Codebuild provisioning.

Please see the [environment](./environment-templates/README.md) and [service](./service-templates/README.md) templates under their respective directories.

Follow the [README](./environment-templates/tf-vpc-ecs-cluster/v1/README.md) [files](./service-templates/tf-ecs-fargate-lb-service/v1/README.md) in the template directories for instructions on how to register them with AWS Proton.


## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

These samples are configured to use the [pre-commit](https://pre-commit.com/) tool for running various checks before committing changes. Please install the tool and run `pre-commit install` so that the automated checks are run before committing. You can also run `pre-commit run --all-files` to run the checks on-demand.

The following additional tools need to be installed

- [terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- [tflint](https://github.com/terraform-linters/tflint)
- [terraform-docs](https://terraform-docs.io/)
