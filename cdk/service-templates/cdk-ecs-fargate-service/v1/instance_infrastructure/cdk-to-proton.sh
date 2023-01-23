#!/bin/bash

jq 'to_entries | map_values(.value) | add | to_entries | map({key:.key, valueString:.value})'