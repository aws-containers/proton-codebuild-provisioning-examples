#!/usr/bin/env python3

import boto3
import yaml

client = boto3.client('proton')

envName = 'cdk-eks-demo-test'
namespaceServiceInput = "cart-api"
environment = client.get_environment(name=envName)
specFile = yaml.safe_load(environment['environment']['spec'])
namespaces = specFile['spec']['namespaces']
if namespaceServiceInput in namespaces:
    print("ERROR: This namespace already exists in the cluster")
    exit(2)
namespaces.append(namespaceServiceInput)
specFile['spec']['namespaces'] = namespaces
yamlSpec = yaml.dump(specFile)

deploymentWaitingStatus = ['IN_PROGRESS','DELETE_IN_PROGRESS','DELETE_COMPLETE','CANCELLING']

if environment['environment']['deploymentStatus'] not in deploymentWaitingStatus:
    print(f"Deploying \"{namespaces}\" to environment \"{envName}\"")

    response = client.update_environment(
        deploymentType='CURRENT_VERSION',
        description='Automated update via EKS namespace vending',
        name=envName,
        spec=yamlSpec
    )

print("Waiting for environment to complete deployment of namespace")

waiter = client.get_waiter('environment_deployed')

waiter.wait(
    name=envName,
    WaiterConfig={
        'Delay': 5,
        'MaxAttempts': 60
    }
)

print("Deployment complete!")