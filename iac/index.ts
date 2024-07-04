import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import Network from "./resources/networking";
import {defaultTags} from './constants'
import {vpcConfig, subnets} from './enviroments/dev'







const devNetwork = new Network('dev', vpcConfig.cidrBlock, subnets, defaultTags)

devNetwork.vpcId.apply(id => console.log(`VPC ID: ${id}`))
devNetwork.regionName.apply(id => console.log(`region: ${id}`))