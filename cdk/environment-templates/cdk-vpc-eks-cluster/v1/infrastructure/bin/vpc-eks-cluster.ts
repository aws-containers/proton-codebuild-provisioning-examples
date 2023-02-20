import * as cdk from "aws-cdk-lib";
import ClusterConstruct from "../lib/vpc-eks-cluster-stack";
import { environmentInputs, stackName } from "../lib/constants";
import { PreReqs } from "../lib/pre-req-stack";

const app = new cdk.App();
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT!,
  region: process.env.CDK_DEFAULT_REGION || undefined,
};

const appInputs = { env, ...environmentInputs, stackName: stackName };

// Build namespace pre-requisites like IAM role
new PreReqs(app, `PreReqStack${stackName}`, { env });
// Build EKS Stack
new ClusterConstruct(app, appInputs);
