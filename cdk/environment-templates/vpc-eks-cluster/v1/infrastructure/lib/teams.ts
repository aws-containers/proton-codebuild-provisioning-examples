import * as blueprints from "@aws-quickstart/eks-blueprints";
import * as iam from "aws-cdk-lib/aws-iam";

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
