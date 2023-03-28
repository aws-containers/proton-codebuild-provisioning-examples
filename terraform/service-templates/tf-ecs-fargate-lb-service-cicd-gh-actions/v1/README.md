## Description

This template is the same as the [tf-ecs-fargate-lb-service](../../tf-ecs-fargate-lb-service/) but adds infrastructure to enable CI/CD.  The template outputs the following resources:

- Private ECR repository
- AWS Identity Provider and IAM Role that GitHub Actions can assume with access to ECR, Proton, and S3
- Generated GitHub Actions workflow file (`.github/workflows.deploy.yml`)
- a GitHub pull request with the generated workflow

The idea with this template is that once you deploy it, your app repo will get a PR with a CI/CD pipeline that, when merged, will:

- build your code into a container image (requies a Dockerfile)
- push your image to ECR
- update your Proton service to deploy the image to the ECS Fargate service instances


This template is compatible with the [tf-vpc-ecs-cluster](../../environment-templates/tf-vpc-ecs-cluster/README.md) template.


## Register Template in AWS Proton

To register this template in AWS Proton, you can either use the GUI console, or you can run the `make template` command specifying an S3 bucket used to store the template bundle and the version you'd like to register.

```sh
cd terraform/service-templates/tf-ecs-fargate-lb-service-cicd-github-actions
make template bucket=my-bucket version=1
```

### Input Parameters

![input](./input.png)


## Security

See [CONTRIBUTING](../../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the [LICENSE](../../LICENSE) file.
