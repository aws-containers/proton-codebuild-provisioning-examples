import * as cdk from "aws-cdk-lib";
import ClusterConstruct from "../lib/vpc-eks-cluster-stack";
import { environmentInputs, stackName } from "../lib/constants";

const app = new cdk.App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region };

const appInputs = { env, ...environmentInputs };

const clusterDeployment = new ClusterConstruct(
  app,
  `${stackName}-cluster`,
  appInputs
);

//cdk.Tags.of(clusterDeployment).add("")
