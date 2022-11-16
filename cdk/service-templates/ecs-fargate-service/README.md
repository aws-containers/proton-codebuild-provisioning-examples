# ECS Fargate Service Template Bundle

### What this builds

This template bundle will deploy the following:

- ECS task definition with Fargate as the compute
- ECS service with desired task count and compute requirements defined in the schema
- (Optional) Application Load Balancer that is attached to the ECS service
- Works with the [vpc-ecs-cluster](../../../environment-templates/vpc-ecs-cluster) environment template.

### Testing

To deploy this locally you will need the `proton-inputs.json` file (example located in this directory).
Modify the proton-inputs.json file with the proper values from an existing environment.
It's recommended that you deploy the (vpc-ecs-cluster)[../../../environment-templates/vpc-ecs-cluster] environment and use the values from there to fill in the proton-inputs.json.
For the service map, you can leave or modify values as needed.

```
{
  "environment": {
    "account_id": "<ACCOUNT-ID-HERE>"
    "name": "cdk-env-demo",
    "outputs": {
      "ECSClusterArn": "<CLUSTER-ARN>",
      "ECSClusterSecGrps": "[]",
      "VPCId": "<VPC-ID>",
      "ECSClusterName": "<CLUSTER-NAME>",
      "ECSClusterSDNamespace": "<SD-NAMESPACE>"
    }
  },
  "service": {
    "name": "cdk-svc-demo",
    "repository_connection_arn": "",
    "repository_id": "",
    "branch_name": ""
  },
  "service_instance": {
    "name": "test",
    "inputs": {
      "port": 80,
      "desired_count": 1,
      "task_size": "x-small",
      "image": "public.ecr.aws/nginx/nginx:stable",
      "load_balanced": true,
      "load_balanced_public": true
    }
  }
}
```
