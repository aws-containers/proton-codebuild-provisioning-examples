import * as blueprints from "@aws-quickstart/eks-blueprints";
import { App } from "aws-cdk-lib";

export class AdminTeam extends blueprints.PlatformTeam {
  constructor(accountID: string, teamName?: string) {
    super({
      name: teamName ?? "platformteam",
      userRoleArn: `arn:aws:iam::${accountID}:role/Admin`,
    });
  }
}

export class DevTeam extends blueprints.ApplicationTeam {
  constructor(teamName: string, roleArn?: string) {
    super({
      name: teamName,
      namespace: teamName,
      userRoleArn: roleArn,
    });
  }
}
