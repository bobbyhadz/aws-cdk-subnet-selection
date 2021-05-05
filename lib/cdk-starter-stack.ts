import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        // {
        //   name: 'private-subnet-1',
        //   subnetType: ec2.SubnetType.PRIVATE,
        //   cidrMask: 24,
        // },
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'isolated-subnet-1',
          subnetType: ec2.SubnetType.ISOLATED,
          cidrMask: 28,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, 'security-group-id', {
      vpc,
    });

    console.log('availability zones 👉', cdk.Stack.of(this).availabilityZones);

    const webServer = new ec2.Instance(this, 'web-server', {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      vpc,
      securityGroup,
      // 👇 set the subnet type to PUBLIC
      vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC},

      // 👇 you can also set the subnetGroupName to the name of the subnet group
      // vpcSubnets: {subnetGroupName: 'public-subnet-1'},

      // 👇 you can also explicitly pick availability zones for the subnet
      // vpcSubnets: {
      //   subnetType: ec2.SubnetType.PUBLIC,
      //   availabilityZones: [cdk.Stack.of(this).availabilityZones[0]],
      // },
    });
  }
}
