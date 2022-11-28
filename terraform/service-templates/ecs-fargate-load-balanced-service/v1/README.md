## Description

This template is compatible with the [vpc-ecs-cluster](../../environment-templates/vpc-ecs-cluster/README.md) template. It creates an ECS service running on a Fargate cluster fronted by a public facing load balancer. The service can be configured to run in a Public subnet with direct internet access or in a Private subnet without direct internet access. The networking configuration of can be selected using the subnet_type parameter. Performanced based (CPU) horizontal auto-scaling is enabled by default.  Other service properties like port number, desired task count, task size (cpu/memory units), and container image can be specified through the service input parameters. 

## Register Template in AWS Proton

To register this template in AWS Proton, you can either use the GUI console, or you can run the `make template` command specifying an S3 bucket used to store the template bundle and the version you'd like to register.

```sh
cd terraform/service-templates/ecs-fargate-load-balanced-service
make template bucket=my-bucket version=1
```

### Input Parameters

![input](./input.png)


## Security

See [CONTRIBUTING](../../CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the [LICENSE](../../LICENSE) file.
