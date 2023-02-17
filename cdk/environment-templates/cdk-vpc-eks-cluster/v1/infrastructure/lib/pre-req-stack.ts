import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import input from "../proton-inputs.json";

export class PreReqs extends Stack {
  private nsMap: any[];
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const envInputs: any = input.environment.inputs;
    this.nsMap = [];

    if (input.environment.inputs.hasOwnProperty("namespaces")) {
      const namespaces: string[] = envInputs.namespaces;
      let ns: string;

      for (ns of namespaces!) {
        // Note that the purpose here is to show how platform teams can create IAM roles for developers
        // as a part of the template bundle. IAM roles and policies should be scoped to least privilege.
        const iamRole = new iam.Role(this, `NSRole${ns}`, {
          assumedBy: new cdk.aws_iam.AccountPrincipal(
            cdk.Stack.of(this).account
          ),
        });
        this.nsMap.push({
          name: ns,
          roleArn: iamRole.roleArn,
        });
      }
    }

    Object.entries(this.nsMap).forEach(([_, value]) => {
      new CfnOutput(this, value.name, {
        value: value.roleArn,
      });
    });
  }
}
