import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from 'path';


interface VpcConfig {
    cidrBlock: string;
    enableDnsHostnames: boolean;
    enableDnsSupport: boolean;
    tags: {
        Name: string;
    };
}


const configPath = path.join(__dirname, 'config.yaml');


const config: VpcConfig = yaml.load(fs.readFileSync(configPath, 'utf8')) as VpcConfig;

// Create a new VPC using the configurations from the YAML file
const vpc = new aws.ec2.Vpc("my-vpc", {
    cidrBlock: config.cidrBlock,
    enableDnsHostnames: config.enableDnsHostnames,
    enableDnsSupport: config.enableDnsSupport,
    tags: config.tags,
});

// Export the VPC ID
export const vpcId = vpc.id;
