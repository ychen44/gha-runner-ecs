# 




### Install Pulumi
`npm install -g pulumi`

### Set Up AWS Credentials
Configure AWS CLI
`aws configure `

or set environment variables

```
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
export AWS_SESSION_TOKEN=your-session-token
```
### Create s3 bucket for state 
`aws s3api create-bucket --bucket pulumi-state-bucket-04040527 --region us-east-1`

*** NOTE: AWS bucket name needs to be unique ***

### Create dynamodb for state locking 
```
aws dynamodb create-table \
  --table-name PulumiStateLocking \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### Configure pulumi to use s3 backend 
1. Create a new Pulumi project or navigate to an existing one, then initialize a new stack:
    `pulumi new aws-typescript`

2. Log in to a self-hosted Pulumi Cloud backend:
    `pulumi login s3://pulumi-state-bucket-04040527`

3. If using DynamoDB for state locking, add the `-lock` and `-lock-table` flags:
   `pulumi login s3://pulumi-state-bucket-04040527 -lock -lock-table PulumiStateLocking`

4. Verify Configuration:
   `pulumi stack ls`

### Create a stack 
```
pulumi stack init dev
pulumi stack select dev
```

### Set Configuration for the dev Stack
`pulumi config set aws:region us-west-2`

### Deploy Stack 
Preview the changes
`pulumi preview`

Apply the changes
`pulumi up`
