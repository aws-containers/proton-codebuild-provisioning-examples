import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import { KubecostAddOn } from "@kubecost/kubecost-eks-blueprints-addon";
import {
  CapacityType,
  KubernetesVersion,
  NodegroupAmiType,
} from "aws-cdk-lib/aws-eks";
import { InstanceType } from "aws-cdk-lib/aws-ec2";
import * as logs from "aws-cdk-lib/aws-logs";
import { Role } from "aws-cdk-lib/aws-iam";
import { AdminTeam, DevTeam } from "./teams";

export interface ClusterConstructProps extends cdk.StackProps {
  argoCd?: boolean;
  opaGateKeeper?: boolean;
  kubeCost?: boolean;
  nginxIngress?: boolean;
  metricsServer?: boolean;
  karpenter?: boolean;
  lbController?: boolean;
  fluentBit?: boolean;
  certManager?: boolean;
  k8Version: string;
  clusterName?: string;
  vpcId?: string;
  vpcCidr?: string;
  namespaces?: string[];
}

export default class ClusterConstruct extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ClusterConstructProps) {
    super(scope, id, props);

    const account = props?.env?.account!;
    const region = props?.env?.region!;
    const stackName = props?.clusterName ?? `${id}-stack`;
    const clusterName = props.clusterName ?? stackName;
    const vpcName = stackName;

    let vpc: cdk.aws_ec2.IVpc = new cdk.aws_ec2.Vpc(this, "EKSVPC", {
      vpcName: vpcName,
    });

    //if (props.vpcId) {
    //  Need a custom resource to grab vpc name which is a tag
    //  vpc = cdk.aws_ec2.Vpc.fromLookup(this, "ImportedVPC", {
    //    vpcId: props.vpcId,
    //  });
    //}

    let teams: blueprints.Team[] = [new AdminTeam(cdk.Stack.of(this).account)];

    if (props.namespaces) {
      for (const ns of props.namespaces!) {
        // Creating role ARN for now. Eventually we should support k/v maps in the console
        const iamRole = new Role(this, `NSRole${ns}`, {
          assumedBy: new cdk.aws_iam.AccountPrincipal(
            cdk.Stack.of(this).account
          ),
        });
        teams.push(new DevTeam(ns, iamRole.roleArn));
      }
    }

    let clusterVersion: KubernetesVersion;
    let coreDnsVersion: string;
    let vpcCniVersion: string;

    if (props.k8Version === "1.23") {
      clusterVersion = KubernetesVersion.V1_23;
      coreDnsVersion = "v1.8.7-eksbuild.2";
      vpcCniVersion = "v1.11.4-eksbuild.1";
    } else if (props.k8Version === "1.22") {
      clusterVersion = KubernetesVersion.V1_22;
      coreDnsVersion = "v1.8.7";
      vpcCniVersion = "v1.11.4-eksbuild.1";
    } else if (props.k8Version === "1.21") {
      clusterVersion = KubernetesVersion.V1_21;
      coreDnsVersion = "v1.8.4";
      vpcCniVersion = "v1.11.4-eksbuild.1";
    } else {
      clusterVersion = KubernetesVersion.V1_23;
      coreDnsVersion = "v1.8.7-eksbuild.2";
      vpcCniVersion = "v1.11.4-eksbuild.1";
    }

    // Automatically enable the following addOns
    let addOns: blueprints.ClusterAddOn[] = [
      new blueprints.addons.VpcCniAddOn(vpcCniVersion),
      new blueprints.addons.SecretsStoreAddOn(),
      new blueprints.addons.CoreDnsAddOn(coreDnsVersion),
    ];

    if (props?.karpenter) {
      addOns.push(
        new blueprints.addons.KarpenterAddOn({
          consolidation: { enabled: true },
          subnetTags: {
            Name: `${stackName}/${stackName}/PrivateSubnet*`,
          },
          securityGroupTags: {
            [`kubernetes.io/cluster/${stackName}`]: "owned",
          },
        })
      );
    }
    if (props?.certManager) {
      addOns.push(new blueprints.addons.CertManagerAddOn());
    }
    if (props?.fluentBit) {
      // For this example we will create a cloudwatch logs group and forward logs there
      addOns.push(
        new blueprints.addons.AwsForFluentBitAddOn({
          namespace: "default",
          values: {
            cloudWatch: {
              enabled: true,
              region: cdk.Stack.of(this).region,
              logGroupName: new logs.LogGroup(this, "FluentBitLG", {
                retention: logs.RetentionDays.ONE_WEEK,
              }).logGroupName,
            },
          },
        })
      );
    }
    if (props?.lbController) {
      addOns.push(new blueprints.addons.AwsLoadBalancerControllerAddOn());
    }
    if (props?.metricsServer) {
      addOns.push(new blueprints.addons.MetricsServerAddOn());
    }
    if (props?.opaGateKeeper) {
      addOns.push(new blueprints.addons.OpaGatekeeperAddOn());
    }
    if (props?.kubeCost) {
      addOns.push(new KubecostAddOn());
    }

    const clusterProvider = new blueprints.GenericClusterProvider({
      version: clusterVersion,
      clusterName: clusterName,
      vpc: vpc,
      managedNodeGroups: [
        {
          id: "bottleRocketX86Spot",
          amiType: NodegroupAmiType.BOTTLEROCKET_X86_64,
          instanceTypes: [
            new InstanceType("m5.xlarge"),
            new InstanceType("m5.large"),
            new InstanceType("m4.xlarge"),
            new InstanceType("m4.large"),
          ],
          diskSize: 50,
          nodeGroupCapacityType: CapacityType.SPOT,
        },
        {
          id: "bottleRocketX86OnDemand",
          amiType: NodegroupAmiType.BOTTLEROCKET_X86_64,
          instanceTypes: [new InstanceType("m5.xlarge")],
          diskSize: 50,
          nodeGroupCapacityType: CapacityType.ON_DEMAND,
        },
      ],
      fargateProfiles: {
        MainFargateProfile: {
          fargateProfileName: "fargate",
          selectors: [{ namespace: "fargate" }],
        },
      },
    });

    const blueprint = blueprints.EksBlueprint.builder()
      .clusterProvider(clusterProvider)
      .account(account)
      .region(region)
      .addOns(...addOns)
      .teams(...teams)
      .build(scope, stackName);
  }
}
