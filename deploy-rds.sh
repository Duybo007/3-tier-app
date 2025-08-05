#!/bin/bash

# RDS Migration Script
echo "Starting RDS migration..."

# Step 1: Update your RDS endpoint in the secret
echo "Please update the RDS endpoint in k8s_manifests/rds-secret.yaml"
echo "Replace '<BASE64_ENCODED_RDS_ENDPOINT>' with your actual RDS endpoint"
echo "To encode: echo -n 'your-rds-endpoint' | base64"

# Step 2: Update your AWS account ID in service account
echo "Please update your AWS account ID in k8s_manifests/rds-service-account.yaml"
echo "Replace 'YOUR_ACCOUNT_ID' with your actual AWS account ID"

# Step 3: Update password in secret
echo "Please update the password in k8s_manifests/rds-secret.yaml"
echo "Replace '<BASE64_ENCODED_PASSWORD>' with your actual password"
echo "To encode: echo -n 'your-password' | base64"

# Step 4: Apply the new manifests
echo "Applying RDS manifests..."
kubectl apply -f k8s_manifests/rds-secret.yaml
kubectl apply -f k8s_manifests/rds-service-account.yaml

# Step 5: Update backend deployment
echo "Updating backend deployment..."
kubectl apply -f k8s_manifests/backend-deployment.yaml

# Step 6: Remove old MongoDB manifests (optional)
echo "To remove MongoDB deployment, run:"
echo "kubectl delete -f k8s_manifests/mongo/"

echo "Migration complete! Check the logs with:"
echo "kubectl logs -f deployment/backend -n workshop" 