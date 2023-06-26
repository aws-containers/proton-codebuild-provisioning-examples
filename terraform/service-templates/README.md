## Example Terraform Proton Service Templates

- [ECS Fargate Web Service](./tf-ecs-fargate-lb-service/v1/README.md) - provisions a stack for running HTTP applications, which includes an ALB, an ECS Fargate service, and ancillary services

- [ECS Fargate Web Service with CodePipeline](./tf-ecs-fargate-lb-service-cicd-codepipeline/v1/README.md) - same as [ECS Fargate Web Service](./tf-ecs-fargate-lb-service/v1/README.md) but adds a CI/CD pipeline implemented with AWS CodePipeline

- [ECS Fargate Web Service with GitHub Actions](./tf-ecs-fargate-lb-service-cicd-gh-actions/v1/README.md) - same as [ECS Fargate Web Service](./tf-ecs-fargate-lb-service/v1/README.md) but adds a CI/CD pipeline implemented with GitHub Actions

- [Lambda Web Service](./tf-lambda-apigw-service/v1/README.md) - provisions a web API stack using API Gateway HTTP API and Lambda

- [Lambda Web Service with CodePipeline](./tf-lambda-apigw-service-cicd-codepipeline/v1/README.md) - same as [Lambda Web Service](./tf-lambda-apigw-service/v1/README.md) but adds a CI/CD pipeline implemented with AWS CodePipeline
