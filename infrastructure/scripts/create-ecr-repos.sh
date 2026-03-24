#!/usr/bin/env bash
# Creates the two ECR repositories needed for apnaMart.
# Run once before the first deployment.
# Prerequisites: aws cli configured with admin credentials, correct region set.

set -euo pipefail

REGION="${AWS_REGION:-ap-south-1}"

echo "Creating ECR repositories in region: ${REGION}"

aws ecr create-repository \
  --repository-name apnamart-backend \
  --region "${REGION}" \
  --image-scanning-configuration scanOnPush=true \
  --image-tag-mutability MUTABLE

aws ecr create-repository \
  --repository-name apnamart-frontend \
  --region "${REGION}" \
  --image-scanning-configuration scanOnPush=true \
  --image-tag-mutability MUTABLE

echo "Done. Add the following GitHub Secrets to your repository:"
echo "  AWS_ACCOUNT_ID  = $(aws sts get-caller-identity --query Account --output text)"
echo "  AWS_DEPLOY_ROLE_ARN = (create an IAM role with OIDC trust for GitHub Actions)"
