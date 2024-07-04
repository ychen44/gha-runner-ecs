import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";


interface Subnet {
    subnetType: string; 
    cidrBlock: string;
    availabilityZone: string
}

export default class Network<T> {

  public vpcId: pulumi.Output<string>; 
  public regionName: pulumi.Output<string>; // Declare region property
  public subnets: pulumi.Output<aws.ec2.Subnet[]>; 


  constructor( env:string, vpcCidr: string, subnets: Subnet[], defaultTags: {}){
      this.regionName = pulumi.output(aws.getRegion({})).apply(res => res.name);
      this.vpcId = pulumi.output(this.createVpc(env, vpcCidr, defaultTags));
      this.subnets = pulumi.output(this.createSubnets(env, subnets, defaultTags));
      

  }

  private async createVpc(env: string, vpcCidr: string, defaultTags: {}) {
    const vpc = await new aws.ec2.Vpc(env, {
      cidrBlock: vpcCidr,
      tags: {
        Name: `${env}-vpc`,
        ...defaultTags,
        },
      });

      return vpc.id
  }

  private async createSubnets(env:string, subnets: Subnet[], defaultTags: {} ) {

    // const subnetOutputs: aws.ec2.Subnet[] = [];
    const subs = Promise.all(subnets.map(async subnet => {
      const subnetResource = new aws.ec2.Subnet(`${env}-${subnet.subnetType}-subnet-${subnet.availabilityZone}`, {
      vpcId: this.vpcId,
      cidrBlock: subnet.cidrBlock,
      availabilityZone: pulumi.interpolate`${this.regionName}${subnet.availabilityZone}`,
      tags: {
        Name: `${env}-${subnet.subnetType}-${subnet.availabilityZone}`,
        ...defaultTags

      }
    }); 

  }))


  return subs

  }



}



