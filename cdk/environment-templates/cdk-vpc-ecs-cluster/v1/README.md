# VPC ECS Cluster Environment Template Bundle

### What this builds

This template bundle will deploy the following:

- A VPC
- An ECS Cluster with optional configuration inputs (EC2 capacity, Container Insights, ECS Exec logging)
- Works with the [vpc-ecs-cluster](../../../service-templates/vpc-ecs-cluster) environment template.

### Testing

To deploy this locally you will need the `proton-inputs.json` file (example located in this directory).
Modify the proton-inputs.json file to manipulate the build accordingly.

```
{
  "environment": {
    "name": "cdk-env-demo",
    "inputs": {
      "vpc_cidr_block": "10.0.0.0/16",
      "ec2_capacity": false,
      "ec2_instance_type": "t3.medium",
      "allow_ecs_exec": false,
      "enhanced_cluster_monitoring": false,
      "service_discovery_namespace": "proton.cdkdemo.svc"
    }
  }
}

```
