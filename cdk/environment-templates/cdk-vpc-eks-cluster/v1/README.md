# VPC EKS Cluster Environment Template Bundle

### What this builds

This template bundle will deploy the following:

- A VPC or import a VPC based on user input
- An EKS Cluster with optional addons and namespace creation

### Limitations

- Today this feature only supports deploying proton resources in the same account where Proton lives

### Testing

To deploy this locally you will need the `proton-inputs.json` file (example located in this directory).
Modify the proton-inputs.json file to manipulate the build accordingly.

```
{
  "environment": {
    "name": "cdk-eks-env-demo",
    "inputs": {
      "clusterName": "",
      "vpcCidr": "10.0.0.0/16",
      "k8Version": "1.23",
      "opaGateKeeper": true,
      "certManager": true,
      "karpenter": true,
      "lbController": true,
      "metricsServer": true,
      "kubeCost": true
    }
  }
}

```
