#!/bin/bash
# Ensure script fails if any command fails
set -e

# Configure AWS CLI
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set default.region $AWS_DEFAULT_REGION

# Add deployment commands here
# Example: Deploy a build directory to an S3 bucket
aws s3 cp client/build/ s3://ayrproject/ --recursive

# Additional commands can go here, like invalidating a CloudFront distribution if using
