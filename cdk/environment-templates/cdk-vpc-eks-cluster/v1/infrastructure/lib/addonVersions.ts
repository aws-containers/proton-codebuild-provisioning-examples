import { KubernetesVersion } from "aws-cdk-lib/aws-eks";

let clusterVersion: KubernetesVersion;
let coreDnsVersion: string;
let vpcCniVersion: string;

if (props.k8Version === "1.23") {
  clusterVersion = KubernetesVersion.V1_23;
  coreDnsVersion = "1.8.7-eksbuild.2";
  vpcCniVersion = "1.11.4-eksbuild.1";
} else if (props.k8Version === "1.22") {
  clusterVersion = KubernetesVersion.V1_22;
  coreDnsVersion = "1.8.7";
  vpcCniVersion = "1.11.4-eksbuild.1";
} else if (props.k8Version === "1.21") {
  clusterVersion = KubernetesVersion.V1_21;
  coreDnsVersion = "1.8.4";
  vpcCniVersion = "1.11.4-eksbuild.1";
} else {
  clusterVersion = KubernetesVersion.V1_23;
  coreDnsVersion = "1.8.7-eksbuild.2";
  vpcCniVersion = "1.11.4-eksbuild.1";
}
