import input from "../proton-inputs.json";
import { InstanceType } from "aws-cdk-lib/aws-ec2";

export const environmentInputs = input.environment.inputs;
export const stackName = input.environment.name;
export const BOTTLEROCKET_ON_DEMAND_INSTANCES: InstanceType[] = [
  new InstanceType("t3.medium"),
];
export const BOTTLEROCKET_SPOT_INSTANCES: InstanceType[] = [
  new InstanceType("t3.medium"),
  new InstanceType("t3.small"),
  new InstanceType("t3.large"),
];
