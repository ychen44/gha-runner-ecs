import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

interface EnvironmentArgs {
    cidrBlock: string;
    availabilityZones: string[];
}

class DefaultEnvironment extends pulumi.ComponentResource {
    public vpc: aws.ec2.Vpc;
    public publicSubnets: aws.ec2.Subnet[];
    public privateSubnets: aws.ec2.Subnet[];
    public internetGateway: aws.ec2.InternetGateway;
    public natGateway: aws.ec2.NatGateway;

    constructor(name: string, args: EnvironmentArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:resource:DefaultEnvironment", name, {}, opts);

        const { cidrBlock, availabilityZones } = args;

        // Create a VPC
        this.vpc = new aws.ec2.Vpc(`${name}-vpc`, {
            cidrBlock,
            enableDnsSupport: true,
            enableDnsHostnames: true,
            tags: { Name: `${name}-vpc` },
        }, { parent: this });

        // Create an Internet Gateway
        this.internetGateway = new aws.ec2.InternetGateway(`${name}-igw`, {
            vpcId: this.vpc.id,
            tags: { Name: `${name}-igw` },
        }, { parent: this });

        // Create a NAT Gateway
        const eip = new aws.ec2.Eip(`${name}-eip`, {
            vpc: true,
        }, { parent: this });

        // Create subnets dynamically
        this.publicSubnets = [];
        this.privateSubnets = [];

        for (let i = 0; i < 2; i++) {
            // Create public subnets
            const publicSubnet = new aws.ec2.Subnet(`${name}-public-subnet-${i + 1}`, {
                vpcId: this.vpc.id,
                cidrBlock: `10.0.${i * 2}.0/24`,
                availabilityZone: availabilityZones[i],
                tags: { Name: `${name}-public-subnet-${i + 1}`, Tier: "public" },
            }, { parent: this });

            this.publicSubnets.push(publicSubnet);

            // Create private subnets
            const privateSubnet = new aws.ec2.Subnet(`${name}-private-subnet-${i + 1}`, {
                vpcId: this.vpc.id,
                cidrBlock: `10.0.${i * 2 + 1}.0/24`,
                availabilityZone: availabilityZones[i],
                tags: { Name: `${name}-private-subnet-${i + 1}`, Tier: "private" },
            }, { parent: this });

            this.privateSubnets.push(privateSubnet);
        }

        // Create a public route table and associate it with the public subnets
        const publicRouteTable = new aws.ec2.RouteTable(`${name}-public-rt`, {
            vpcId: this.vpc.id,
            routes: [{ cidrBlock: "0.0.0.0/0", gatewayId: this.internetGateway.id }],
            tags: { Name: `${name}-public-rt` },
        }, { parent: this });

        this.publicSubnets.forEach((subnet, i) => {
            new aws.ec2.RouteTableAssociation(`${name}-public-rta-${i + 1}`, {
                subnetId: subnet.id,
                routeTableId: publicRouteTable.id,
            }, { parent: this });
        });

        // Create a private route table and associate it with the private subnets
        const privateRouteTable = new aws.ec2.RouteTable(`${name}-private-rt`, {
            vpcId: this.vpc.id,
            tags: { Name: `${name}-private-rt` },
        }, { parent: this });

        this.privateSubnets.forEach((subnet, i) => {
            new aws.ec2.RouteTableAssociation(`${name}-private-rta-${i + 1}`, {
                subnetId: subnet.id,
                routeTableId: privateRouteTable.id,
            }, { parent: this });
        });

        // Create a NAT Gateway in the first public subnet
        this.natGateway = new aws.ec2.NatGateway(`${name}-nat`, {
            allocationId: eip.id,
            subnetId: this.publicSubnets[0].id,
            tags: { Name: `${name}-nat` },
        }, { parent: this });

        // Add route to the NAT Gateway in the private route table
        new aws.ec2.Route(`${name}-private-route`, {
            routeTableId: privateRouteTable.id,
            destinationCidrBlock: "0.0.0.0/0",
            natGatewayId: this.natGateway.id,
        }, { parent: this });

        this.registerOutputs({});
    }
}

// Usage example
const config = new pulumi.Config();
const vpcCidr = config.require("vpcCidr"); // For example: "10.0.0.0/16"
const availabilityZones = ["us-west-2a", "us-west-2b"]; // Modify as needed

const defaultEnv = new DefaultEnvironment("default-env", {
    cidrBlock: vpcCidr,
    availabilityZones: availabilityZones,
});
