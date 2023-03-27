#!/bin/bash
set -e
export IN=$(cat proton-inputs.json) && echo ${IN}
export PROTON_ENV=$(echo $IN | jq '.environment.name' -r)
export PROTON_SVC=$(echo $IN | jq '.service.name' -r)
export PROTON_SVC_INSTANCE=$(echo $IN | jq '.service_instance.name' -r)
export TF_STATE_BUCKET=$(echo $IN | jq '.environment.outputs.tf_state_bucket' -r)
export KEY=${PROTON_SVC}.${PROTON_SVC_INSTANCE}.tfstate
