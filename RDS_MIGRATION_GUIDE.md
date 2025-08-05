# RDS Migration Guide

This guide will help you migrate from MongoDB to Amazon RDS PostgreSQL.

## Prerequisites

1. AWS Account with appropriate permissions
2. EKS cluster running
3. kubectl configured to access your EKS cluster

## Step 1: Create Amazon RDS Instance

### Via AWS Console:

1. **Navigate to RDS** in AWS Console
2. **Click "Create database"**
3. **Choose configuration:**
   - Engine type: **PostgreSQL**
   - Template: **Free tier** (for testing)
   - DB instance identifier: `task-app-db`
   - Master username: `admin`
   - Master password: `password123` (use strong password in production)

4. **Configure instance:**
   - DB instance class: `db.t3.micro` (free tier)
   - Storage: 20 GB
   - Storage type: General Purpose SSD (gp2)

5. **Configure connectivity:**
   - VPC: Choose your VPC
   - Subnet group: Create new or use existing
   - Public access: **Yes** (for this example)
   - VPC security group: Create new with rules:
     - Type: PostgreSQL
     - Port: 5432
     - Source: 0.0.0.0/0 (restrict in production)

6. **Click "Create database"**

### Get Connection Details:
- **Endpoint**: `your-db-instance.region.rds.amazonaws.com`
- **Port**: 5432
- **Database name**: `postgres`
- **Username**: `admin`
- **Password**: `password123`

## Step 2: Create IAM Role

### Via AWS Console:

1. **Navigate to IAM** → **Roles** → **Create role**
2. **Select trusted entity:**
   - Trusted entity type: **AWS service**
   - Use case: **EC2** (for EKS nodes)
3. **Attach policies:**
   - Search and attach: `AmazonRDSFullAccess`
4. **Role details:**
   - Role name: `EKS-RDS-Role`
   - Description: `Role for EKS to access RDS`
5. **Click "Create role"**

## Step 3: Update Configuration Files

### 3.1 Update RDS Secret
Edit `k8s_manifests/rds-secret.yaml`:
```yaml
data:
  DB_HOST: <base64-encoded-rds-endpoint>
  DB_PORT: NTQzMg== # 5432
  DB_NAME: cG9zdGdyZXM= # postgres
  DB_USERNAME: YWRtaW4= # admin
  DB_PASSWORD: <base64-encoded-password>
```

### 3.2 Update Service Account
Edit `k8s_manifests/rds-service-account.yaml`:
```yaml
annotations:
  eks.amazonaws.com/role-arn: arn:aws:iam::YOUR_ACCOUNT_ID:role/EKS-RDS-Role
```

Replace `YOUR_ACCOUNT_ID` with your actual AWS account ID.

## Step 4: Deploy to Kubernetes

### 4.1 Apply new manifests:
```bash
kubectl apply -f k8s_manifests/rds-secret.yaml
kubectl apply -f k8s_manifests/rds-service-account.yaml
kubectl apply -f k8s_manifests/backend-deployment.yaml
```

### 4.2 Remove old MongoDB deployment (optional):
```bash
kubectl delete -f k8s_manifests/mongo/
```

## Step 5: Verify Deployment

### 5.1 Check backend logs:
```bash
kubectl logs -f deployment/backend -n workshop
```

### 5.2 Test the application:
```bash
kubectl get svc -n workshop
```

## Step 6: Build and Push New Backend Image

### 6.1 Build the new image:
```bash
cd backend
docker build -t your-registry/3-tier-backend:latest .
```

### 6.2 Push to registry:
```bash
docker push your-registry/3-tier-backend:latest
```

### 6.3 Update deployment image:
```bash
kubectl set image deployment/backend backend=your-registry/3-tier-backend:latest -n workshop
```

## Troubleshooting

### Common Issues:

1. **Connection refused**: Check RDS security group allows traffic from EKS
2. **Authentication failed**: Verify credentials in RDS secret
3. **IAM role not found**: Ensure IAM role exists and is properly configured

### Debug Commands:
```bash
# Check pod status
kubectl get pods -n workshop

# Check pod logs
kubectl logs <pod-name> -n workshop

# Check secrets
kubectl get secrets -n workshop

# Check service account
kubectl get serviceaccount -n workshop
```

## Security Considerations

1. **Use AWS Secrets Manager** instead of Kubernetes secrets for production
2. **Restrict RDS security group** to only allow traffic from EKS cluster
3. **Use IAM database authentication** for enhanced security
4. **Enable encryption at rest** for RDS instance
5. **Use private subnets** for RDS in production

## Cost Optimization

1. **Use RDS Reserved Instances** for predictable workloads
2. **Enable RDS Auto Scaling** for storage
3. **Use RDS Multi-AZ** for high availability
4. **Monitor with CloudWatch** to optimize costs 