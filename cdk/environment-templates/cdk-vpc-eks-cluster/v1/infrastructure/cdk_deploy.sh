#!/usr/bin/env bash

###
# When a namespace is removed, the cdk stack deployment order matters due to CFN outputs that won't allow for deletion of resources
# To solve this, we deploy the cluster-stack stack first, then we can deploy the cluster stack 
###

#VERSION=v4.30.6
#BINARY=yq_linux_amd64
#
#wget https://github.com/mikefarah/yq/releases/download/${VERSION}/${BINARY}.tar.gz -O - |\
#  tar xz && mv ${BINARY} /usr/bin/yq

env_name=$(cat proton-inputs.json | jq -r '.environment.name')
echo "Deploying to ${env_name}"
npm run cdk -- deploy --exclusively "${env_name}-cluster-stack"
npm run cdk -- deploy --exclusively "${env_name}-cluster"
#current_ns_length=$(aws proton get-environment --name $env_name | jq -r '.environment.spec' | yq '.spec.namespaces|length')
#new_ns_length=$(cat proton-inputs.json | jq -r '.environment.inputs.namespaces | length')

#if [[ ${new_ns_length} -lt ${current_ns_length} ]]; then
#  echo -e "Current namespace count: ${current_ns_length}\nProposed namespace count: ${new_ns_length}"
#  echo "Namespaces have been removed, running cdk in a specific order to adhere to dependencies between stacks"
#  npm run cdk -- deploy --exclusively "${env_name}-cluster-stack"
#  npm run cdk -- deploy --exclusively "${env_name}-cluster"
#else
#  npm run cdk -- deploy --all
#fi