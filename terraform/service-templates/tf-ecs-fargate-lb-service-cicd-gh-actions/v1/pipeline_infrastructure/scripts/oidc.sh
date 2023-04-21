#!/bin/bash
set -e

cd ../oidc-identity-provider
terraform init
terraform apply -auto-approve
