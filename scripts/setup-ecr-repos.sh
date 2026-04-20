#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
REPOS=("ttis-api" "ttis-ui")

LIFECYCLE_POLICY='{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire untagged images after 1 day",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 1
      },
      "action": { "type": "expire" }
    },
    {
      "rulePriority": 2,
      "description": "Keep only last 5 tagged images",
      "selection": {
        "tagStatus": "tagged",
        "tagPatternList": ["*"],
        "countType": "imageCountMoreThan",
        "countNumber": 5
      },
      "action": { "type": "expire" }
    }
  ]
}'

for repo in "${REPOS[@]}"; do
  echo "Creating ECR repository: ${repo}..."
  aws ecr create-repository \
    --repository-name "$repo" \
    --image-scanning-configuration scanOnPush=true \
    --region "$REGION" \
    2>/dev/null || echo "  Repository ${repo} already exists, skipping creation."

  echo "Applying lifecycle policy to ${repo}..."
  aws ecr put-lifecycle-policy \
    --repository-name "$repo" \
    --lifecycle-policy-text "$LIFECYCLE_POLICY" \
    --region "$REGION"

  echo ""
done

echo "Done. ECR repositories ready:"
for repo in "${REPOS[@]}"; do
  ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
  echo "  ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${repo}"
done
