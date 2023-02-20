#!/usr/bin/env bash

set -e

###
# Deploy IAM roles for namespaces in pre-req stack, then use the outputs for the EKS cluster stack
###

env_name=$(cat proton-inputs.json | jq -r '.environment.name')
echo "{}" | tee  ./pre-req-outputs.json
npm run cdk -- deploy --exclusively "PreReqStack${env_name}" --outputs-file ./pre-req-outputs.json
npm run cdk -- deploy --exclusively "${env_name}-eks" --outputs-file ./proton-outputs.json