export enum Regions {
  US_EAST_1 = 'us-east-1',
  US_WEST_1 = 'us-west-1'
}

export enum Environments {
  PRODUCTION = 'production',
  STAGING = 'staging',
  DEV = 'dev',
}


export const defaultTags = {
  appKey:'gha-runner',
  enviroment: 'dev',
  managedBy: 'pulumi'
}