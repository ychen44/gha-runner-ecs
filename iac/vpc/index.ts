import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create a new VPC
const vpc = new aws.ec2.Vpc("my-vpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: "my-vpc",
    },
});

// Export the VPC ID
export const vpcId = vpc.id;