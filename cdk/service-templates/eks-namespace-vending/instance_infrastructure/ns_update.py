#!/usr/bin/env python3

import boto3
import yaml
import typer
from rich import print

app = typer.Typer()
client = boto3.client('proton')
EXPECTED_DEPLOYMENT_STATUS = ['IN_PROGRESS','DELETE_IN_PROGRESS','DELETE_COMPLETE','CANCELLING']

def collect_metadata(environment_name: str):
    environment = client.get_environment(name=environment_name)
    specFile = yaml.safe_load(environment['environment']['spec'])
    namespaces = specFile['spec']['namespaces']
    return environment, specFile, namespaces

def validate_ns_exist(namespace: str, namespaces: list):
    if namespace in namespaces:
        raise Exception(f"{namespace} aleady exists in the environment configuration. Please supply a unique name.")
    else:
        return

def prepare_spec(namespaces, spec):
    spec['spec']['namespaces'] = namespaces
    return yaml.dump(spec)

def update_proton_environment(environment, env_name, spec):
    waiter_delay = 10
    max_attempts = 60
    if environment['environment']['deploymentStatus'] not in EXPECTED_DEPLOYMENT_STATUS:
        response = client.update_environment(
            deploymentType='CURRENT_VERSION',
            description='Automated update via EKS namespace vending',
            name=env_name,
            spec=spec
        )

        print("Waiting for environment to complete deployment of namespace")

        waiter = client.get_waiter('environment_deployed')

        waiter.wait(
            name=env_name,
            WaiterConfig={
                'Delay': waiter_delay,
                'MaxAttempts':max_attempts
            }
        )

        print("Deployment complete!")

def create_proton_outputs_file(nsName):
    kubectlCommand = "aws eks update-kubeconfig --name cluster-name-here --region region-here --role-arn role-arn-here"
    toWrite = f'''[
  {{
    "key": "NamespaceName",
    "valueString": "{nsName}"
  }},
  {{
    "key": "KubectlConfiguration",
    "valueString": "{kubectlCommand}"
  }}
]'''
    # Write to proton-outputs.json file
    with open("proton-outputs.json.test", "w") as outfile:
      outfile.write(toWrite)

@app.command()
def create_namespace(
    namespace_name: str = typer.Argument(..., help="Kubernetes namespace name"), 
    environment_name: str = typer.Argument(..., help="Environment to deploy namespace")):
    """
    Create a namespace on the EKS environment managed via AWS Proton
    """
    environment, spec, ns = collect_metadata(environment_name)
    validate_ns_exist(namespace_name, ns)
    ns.append(namespace_name)
    updated_spec = prepare_spec(ns, spec)
    print(f"Deploying \"{namespace_name}\" namespace to environment \"{environment_name}\"")
    update_proton_environment(environment, environment_name, updated_spec)
    create_proton_outputs_file(ns)

@app.command()
def delete_namespace(namespace_name: str = typer.Argument(..., help="Kubernetes namespace name")):
    print(f"{namespace_name}")

if __name__ == "__main__":
    app()