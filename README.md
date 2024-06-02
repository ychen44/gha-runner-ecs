# Self-Hosted GitHub Actions Runner on AWS using Pulumi

This project sets up a self-hosted GitHub Actions runner using Pulumi as the Infrastructure as Code (IaC) tool. The runner is deployed on AWS ECS Fargate to manage and scale the runner efficiently.

## Overview

This repository automates the deployment of a self-hosted GitHub Actions runner on AWS using the following technologies:

- **Pulumi**: Infrastructure as Code tool to define and deploy AWS resources.
- **AWS ECS Fargate**: Managed container service to run the GitHub Actions runner.

## Features

- Automated provisioning and management of self-hosted GitHub Actions runners.
- Utilizes AWS ECS Fargate for serverless container management.
- Scalable and cost-efficient setup with on-demand runners.

## Getting Started

### Prerequisites

- Pulumi CLI installed
- AWS CLI configured with appropriate crede