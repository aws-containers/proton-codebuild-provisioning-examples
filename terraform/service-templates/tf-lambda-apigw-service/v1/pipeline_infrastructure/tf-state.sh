#!/bin/bash
export IN=$(cat proton-inputs.json) && echo ${IN}
export TF_STATE_BUCKET=$(echo $IN | jq '.service_instances[0].environment.outputs.tf_state_bucket' -r)
export PROTON_SVC=$(echo ${IN} | jq '.service.name' -r)
export KEY=${PROTON_SVC}.pipeline.tfstate
