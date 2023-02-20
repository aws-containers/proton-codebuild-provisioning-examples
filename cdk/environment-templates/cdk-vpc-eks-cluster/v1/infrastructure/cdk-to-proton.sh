#!/bin/bash
#####
# This script converts the cdk outputs into a format that is supported by AWS Proton
#####

jq 'to_entries | map_values(.value) | add | to_entries | map({key:.key, valueString:.value})'