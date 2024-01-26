import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'isolated-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, 'security-group-id', {
      vpc,
    });

    const webServer = new ec2.Instance(this, 'web-server', {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      vpc,
      securityGroup,
      // 👇 set the subnet type to PUBLIC
      vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC},

      // 👇 you can also set the subnetGroupName to the name of the subnet group
      // vpcSubnets: {subnetGroupName: 'public-subnet-1'},

      // 👇 you can also explicitly pick availability zones of the subnet
      // vpcSubnets: {
      //   subnetType: ec2.SubnetType.PUBLIC,
      //   availabilityZones: [cdk.Stack.of(this).availabilityZones[0]],
      // },
    });
  }
}
