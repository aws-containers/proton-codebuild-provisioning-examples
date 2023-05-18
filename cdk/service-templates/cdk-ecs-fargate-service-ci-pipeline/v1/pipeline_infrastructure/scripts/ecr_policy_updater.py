#!/usr/bin/env python3

import boto3
import json
from os import getenv

print("Updating ECR Repository Policy to reflect all environments for this service")

proton = boto3.client("proton")

service_name = getenv("SERVICE_NAME", "service-sync-ci-demo")
proton_acct_id = getenv("PROTON_ACCT_ID", "1234")
service_instances = proton.list_service_instances(serviceName=service_name)
environment_names = list(
    set([x["environmentName"] for x in service_instances["serviceInstances"]])
)
account_ids = [
    proton.get_environment(name=x)["environment"].get(
        "environmentAccountId", proton_acct_id
    )
    for x in environment_names
]

ecr_repo_name = getenv(
    "REPO_NAME", "service-sync-ci-demo-pipeline-ecrrepoc36dc9e6-kuo5hlmpkeyl"
)
ecr = boto3.client("ecr")
policy = ecr.get_repository_policy(repositoryName=ecr_repo_name)
policy_text = json.loads(policy["policyText"])

print(f"Current Policy:\n=====\n{json.dumps(policy_text, indent=2)}\n=====")

policy_list = list()
for acct in account_ids:
    principal = f"arn:aws:iam::{acct}:root"
    policy_list.append(principal)

policy_text["Statement"][0]["Principal"]["AWS"] = policy_list

print(f"New Policy:\n=====\n{json.dumps(policy_text, indent=2)}\n=====")

ecr.set_repository_policy(
    repositoryName=ecr_repo_name, policyText=json.dumps(policy_text)
)
