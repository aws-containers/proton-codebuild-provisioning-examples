import { StackProps, Duration, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lb from "aws-cdk-lib/aws-elasticloadbalancingv2";

export interface EcsAlbStackProps extends StackProps {
  stackName: string | undefined;
  vpc: ec2.IVpc;
  listenerPort: number;
  containerPort: number;
  public: boolean;
}

export class EcsAlbStack extends Construct {
  public lbSecGrp: ec2.SecurityGroup;
  public loadBalancer: lb.IApplicationLoadBalancer;
  public targetGroup: lb.ApplicationTargetGroup;
  public lbListener: lb.IApplicationListener;

  constructor(scope: Construct, id: string, props: EcsAlbStackProps) {
    super(scope, id);

    const lbSubnets = props.vpc.selectSubnets({
      subnetType: props.public
        ? ec2.SubnetType.PUBLIC
        : ec2.SubnetType.PRIVATE_WITH_EGRESS,
    });

    this.lbSecGrp = new ec2.SecurityGroup(this, "LbSecGrp", {
      vpc: props.vpc,
      allowAllOutbound: true,
    });

    this.lbSecGrp.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(props.listenerPort)
    );

    this.loadBalancer = new lb.ApplicationLoadBalancer(this, "ECSSvcALB", {
      vpc: props.vpc,
      internetFacing: props.public,
      vpcSubnets: lbSubnets,
      securityGroup: this.lbSecGrp,
    });

    this.targetGroup = new lb.ApplicationTargetGroup(this, "LbTg", {
      vpc: props.vpc,
      deregistrationDelay: Duration.seconds(30),
      port: props.containerPort,
      targetType: lb.TargetType.IP,
      protocol: lb.ApplicationProtocol.HTTP,
    });

    this.lbListener = this.loadBalancer.addListener("LbListener", {
      port: props.listenerPort,
      defaultTargetGroups: [this.targetGroup],
      protocol: lb.ApplicationProtocol.HTTP,
    });

    new CfnOutput(this, "LBDNSName", {
      value: this.loadBalancer.loadBalancerDnsName,
      exportName: `LBDNSName-${props.stackName}`,
    });
  }
}
