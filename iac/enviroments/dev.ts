import Network from '../resources/networking';
import {defaultTags} from '../constants'
import { getAvailabilityZone } from '@pulumi/aws/getAvailabilityZone';


export const vpcConfig = {
    cidrBlock: '10.0.0.0/16',
};



export const subnets = [
    {
        subnetType: 'public',
        cidrBlock: '10.0.1.0/24',
        availabilityZone: 'a'
    },
    {
        subnetType: 'public',
        cidrBlock: '10.0.2.0/24',
         availabilityZone: 'b'
    },
    {
        subnetType: 'private',
        cidrBlock: '10.0.3.0/24',
        availabilityZone: 'a'
    },
    {
        subnetType: 'private',
        cidrBlock: '10.0.4.0/24',
        availabilityZone: 'b'
    }
];
