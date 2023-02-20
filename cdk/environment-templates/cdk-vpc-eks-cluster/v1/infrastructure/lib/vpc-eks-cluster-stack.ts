import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import { KubecostAddOn } from "@kubecost/kubecost-eks-blueprints-addon";
import {
  CapacityType,
  KubernetesVersion,
  NodegroupAmiType,
} from "aws-cdk-lib/aws-eks";
import { ApplicationTeam, PlatformTeam } from "@aws-quickstart/eks-blueprints";
import {
  BOTTLEROCKET_SPOT_INSTANCES,
  BOTTLEROCKET_ON_DEMAND_INSTANCES,
} from "./constants";
import preReqOutputs from "../pre-req-outputs.json";

export interface ClusterConstructProps {
  stackName: string;
  argoCd?: boolean;
  opaGateKeeper?: boolean;
  kubeCost?: boolean;
  nginxIngress?: boolean;
  metricsServer?: boolean;
  karpenter?: boolean;
  lbController?: boolean;
  certManager?: boolean;
  k8Version: string;
  clusterName?: string;
  vpcId?: string;
  vpcCidr?: string;
  namespaces?: string[];
  env: { account: string; region: string | undefined };
  platformTeamRole: string;
}

export default class ClusterConstruct {
  constructor(scope: Construct, props: ClusterConstructProps) {
    const stackName = props.stackName;
    const clusterName = props.clusterName ?? stackName;

    let teams: blueprints.Team[] = [
      new PlatformTeam({
        name: "platformteam",
        userRoleArn: props.platformTeamRole,
      }),
    ];

    if (preReqOutputs.hasOwnProperty(`PreReqStack${stackName}`)) {
      Object.entries(preReqOutputs).forEach(([_, value]) => {
        Object.entries(value as { [key: string]: string }).forEach(
          ([nsName, nsRole]) => {
            teams.push(
              new ApplicationTeam({
                name: nsName,
                namespace: nsName,
                userRoleArn: nsRole,
              })
            );
          }
        );
      });
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
      console.log("Karpenter is presently disabled");
      // https://github.com/aws-quickstart/cdk-eks-blueprints/issues/587
      // Will re-enable once above issue is resolved
      //addOns.push(
      //  new blueprints.addons.KarpenterAddOn({
      //    consolidation: { enabled: true },
      //    subnetTags: {
      //      Name: `${stackName}/${stackName}/PrivateSubnet*`,
      //    },
      //    securityGroupTags: {
      //      [`kubernetes.io/cluster/${stackName}`]: "owned",
      //    },
      //  })
      //);
    }
    if (props?.certManager) {
      addOns.push(new blueprints.addons.CertManagerAddOn());
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
      managedNodeGroups: [
        {
          id: "bottleRocketX86Spot",
          amiType: NodegroupAmiType.BOTTLEROCKET_X86_64,
          instanceTypes: BOTTLEROCKET_SPOT_INSTANCES,
          diskSize: 50,
          nodeGroupCapacityType: CapacityType.SPOT,
        },
        {
          id: "bottleRocketX86OnDemand",
          amiType: NodegroupAmiType.BOTTLEROCKET_X86_64,
          instanceTypes: BOTTLEROCKET_ON_DEMAND_INSTANCES,
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
      .account(props.env.account)
      .region(props.env.region)
      .addOns(...addOns)
      .teams(...teams)
      .build(scope, `${stackName}-eks`);
  }
}
