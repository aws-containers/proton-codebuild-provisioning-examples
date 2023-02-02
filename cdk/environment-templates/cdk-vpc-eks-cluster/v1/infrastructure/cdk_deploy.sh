#!/usr/bin/env bash

set -e

###
# When a namespace is removed, the cdk stack deployment order matters due to CFN outputs that won't allow for deletion of resources
# To solve this, we deploy the cluster-stack stack first, then we can deploy the cluster stack 
###

VERSION=v4.30.6
BINARY=yq_linux_amd64

wget https://github.com/mikefarah/yq/releases/download/${VERSION}/${BINARY}.tar.gz -O - |\
  tar xz && mv ${BINARY} /usr/bin/yq

env_name=$(cat proton-inputs.json | jq -r '.environment.name')
# For first time run, environment will not exist therefor we create an empty json object
current_env=$(aws proton get-environment --name $env_name || echo '{}')
current_ns_length=$(echo $current_env | jq -r '.environment.spec' | yq '.spec.namespaces|length')
new_ns_length=$(cat proton-inputs.json | jq -r '.environment.inputs.namespaces | length')

echo -e "Current namespace count: ${current_ns_length}\nProposed namespace count: ${new_ns_length}"

if [[ ${new_ns_length} -lt ${current_ns_length} ]]; then
  echo "Deploying in specific order due to dependency issues related to CFN outputs"
  npm run cdk -- deploy --exclusively "${env_name}-cluster-stack" --outputs-file ./output1.json
  npm run cdk -- deploy --exclusively "${env_name}-cluster" --outputs-file ./output2.json
  # Combine outputs into single file for proton to ingest
  jq -s '.[0] * .[1]' output1.json output2.json > proton-outputs.json
else
  echo "Normal CDK deployment"
  npm run cdk -- deploy --all
fi