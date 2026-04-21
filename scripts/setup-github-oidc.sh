#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
ROLE_NAME="github-actions-ecr-push"
GITHUB_REPO="${GITHUB_REPO:-jrinehart/the-things-ive-seen}"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
OIDC_PROVIDER_URL="https://token.actions.githubusercontent.com"
OIDC_PROVIDER_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"

echo "AWS Account: ${ACCOUNT_ID}"
echo "Region: ${REGION}"
echo "GitHub repo: ${GITHUB_REPO}"
echo ""

echo "Creating OIDC identity provider..."
aws iam create-open-id-connect-provider \
  --url "$OIDC_PROVIDER_URL" \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
  2>/dev/null || echo "  OIDC provider already exists, skipping."

echo ""
echo "Creating IAM role: ${ROLE_NAME}..."

TRUST_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "${OIDC_PROVIDER_ARN}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:${GITHUB_REPO}:ref:refs/heads/main"
        }
      }
    }
  ]
}
EOF
)

aws iam create-role \
  --role-name "$ROLE_NAME" \
  --assume-role-policy-document "$TRUST_POLICY" \
  2>/dev/null || echo "  Role ${ROLE_NAME} already exists, skipping creation."

echo "Attaching ECR push policy..."

ECR_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ecr:GetAuthorizationToken"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload"
      ],
      "Resource": [
        "arn:aws:ecr:${REGION}:${ACCOUNT_ID}:repository/ttis-api",
        "arn:aws:ecr:${REGION}:${ACCOUNT_ID}:repository/ttis-ui"
      ]
    }
  ]
}
EOF
)

aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name ecr-push-policy \
  --policy-document "$ECR_POLICY"

echo ""
echo "Done. Configure these in your GitHub repository settings:"
echo ""
echo "  Secret:   AWS_ROLE_ARN   = arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
echo "  Secret:   AWS_ACCOUNT_ID = ${ACCOUNT_ID}"
echo "  Variable: AWS_REGION     = ${REGION}"
