# Enterprise Live Streaming Encoder - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Kubernetes cluster (v1.25+)
- kubectl configured
- Helm 3.x
- Docker registry access
- Domain name for services

### 1. Cluster Setup
```bash
# Create namespace
kubectl create namespace streaming-encoder

# Apply RBAC
kubectl apply -f enterprise/kubernetes/base/rbac/

# Apply network policies
kubectl apply -f enterprise/kubernetes/base/network-policies/

# Apply secrets
kubectl apply -f enterprise/kubernetes/base/secrets/
```

### 2. Database Deployment
```bash
# Deploy PostgreSQL cluster
kubectl apply -f enterprise/kubernetes/base/database/

# Deploy Redis cluster
kubectl apply -f enterprise/kubernetes/base/redis/

# Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n streaming-encoder --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n streaming-encoder --timeout=300s
```

### 3. Message Queue & Storage
```bash
# Deploy Kafka
kubectl apply -f enterprise/kubernetes/base/kafka/

# Deploy MinIO
kubectl apply -f enterprise/kubernetes/base/storage/

# Deploy InfluxDB
kubectl apply -f enterprise/kubernetes/base/monitoring/influxdb/
```

### 4. Monitoring Stack
```bash
# Deploy Prometheus
kubectl apply -f enterprise/kubernetes/base/monitoring/prometheus/

# Deploy Grafana
kubectl apply -f enterprise/kubernetes/base/monitoring/grafana/

# Deploy Jaeger
kubectl apply -f enterprise/kubernetes/base/monitoring/jaeger/

# Deploy ELK stack
kubectl apply -f enterprise/kubernetes/base/monitoring/elk/
```

### 5. Application Services
```bash
# Apply ConfigMaps
kubectl apply -f enterprise/kubernetes/base/configmaps/

# Deploy services
kubectl apply -f enterprise/kubernetes/base/services/

# Deploy Horizontal Pod Autoscalers
kubectl apply -f enterprise/kubernetes/base/deployments/hpa.yaml

# Wait for services to be ready
kubectl wait --for=condition=ready pod -l app=streaming-encoder -n streaming-encoder --timeout=600s
```

### 6. Ingress & Load Balancing
```bash
# Deploy Ingress Controller
kubectl apply -f enterprise/kubernetes/base/ingress/

# Deploy Load Balancers
kubectl apply -f enterprise/kubernetes/base/load-balancers/

# Apply SSL certificates
kubectl apply -f enterprise/kubernetes/base/certificates/
```

## 🎯 Environment Deployment

### Development Environment
```bash
# Deploy to development
kubectl apply -k enterprise/kubernetes/overlays/development

# Port forward for local access
kubectl port-forward -n streaming-encoder svc/stream-service 3000:3000
kubectl port-forward -n streaming-encoder svc/grafana 3001:3000
```

### Staging Environment
```bash
# Deploy to staging
kubectl apply -k enterprise/kubernetes/overlays/staging

# Run smoke tests
npm run test:smoke -- --env=staging

# Verify deployment
kubectl get pods -n streaming-encoder
kubectl get services -n streaming-encoder
```

### Production Environment
```bash
# Deploy to production (canary)
kubectl apply -k enterprise/kubernetes/overlays/production-canary

# Monitor canary deployment
kubectl get pods -n streaming-encoder -l version=canary

# Run integration tests
npm run test:integration -- --env=production

# Complete deployment
kubectl apply -k enterprise/kubernetes/overlays/production
```

## 🔧 Configuration Management

### Environment Variables
```bash
# Development
export NODE_ENV=development
export DATABASE_URL=postgresql://streaming:dev_password@postgres:5432/streaming_db_dev
export REDIS_URL=redis://redis:6379
export KAFKA_BROKERS=kafka:9092

# Production
export NODE_ENV=production
export DATABASE_URL=postgresql://streaming:${DATABASE_PASSWORD}@postgres-primary:5432/streaming_db
export REDIS_URL=redis://:${REDIS_PASSWORD}@redis-primary:6379
export KAFKA_BROKERS=kafka-1:9092,kafka-2:9092,kafka-3:9092
```

### Configuration Files
```yaml
# config/production.yaml
database:
  host: postgres-primary
  port: 5432
  name: streaming_db
  pool:
    min: 10
    max: 100
    idle_timeout: 30000
    connection_timeout: 2000

redis:
  host: redis-primary
  port: 6379
  password: ${REDIS_PASSWORD}
  db: 0
  retry:
    attempts: 3
    delay: 1000

kafka:
  brokers:
    - kafka-1:9092
    - kafka-2:9092
    - kafka-3:9092
  client_id: streaming-encoder
  group_id: streaming-group
  topics:
    streams: streaming-events
    ad_breaks: ad-break-events
    metrics: metrics-events
```

## 📊 Monitoring Setup

### Grafana Dashboards
```bash
# Import dashboards
kubectl apply -f enterprise/monitoring/grafana/dashboards/

# Access Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000
# Open http://localhost:3000
# Username: admin
# Password: ${GRAFANA_PASSWORD}
```

### Prometheus Alerts
```bash
# Apply alert rules
kubectl apply -f enterprise/monitoring/alertmanager/alert-rules/

# Apply Alertmanager configuration
kubectl apply -f enterprise/monitoring/alertmanager/config.yml

# Check alerts
kubectl port-forward -n monitoring svc/alertmanager 9093:9093
# Open http://localhost:9093
```

### Log Aggregation
```bash
# Access Kibana
kubectl port-forward -n monitoring svc/kibana 5601:5601
# Open http://localhost:5601

# Create index patterns
# Pattern: streaming-encoder-*
# Time field: @timestamp
```

## 🔒 Security Configuration

### Authentication Setup
```bash
# Deploy OAuth2 providers
kubectl apply -f enterprise/security/oauth2/

# Configure JWT secrets
kubectl create secret generic jwt-secret \
  --from-literal=secret=${JWT_SECRET} \
  -n streaming-encoder

# Apply RBAC policies
kubectl apply -f enterprise/security/rbac/
```

### Network Security
```bash
# Apply network policies
kubectl apply -f enterprise/kubernetes/base/network-policies/

# Configure TLS certificates
kubectl apply -f enterprise/security/certificates/

# Apply WAF rules
kubectl apply -f enterprise/security/waf/
```

### Audit Logging
```bash
# Enable audit logging
kubectl apply -f enterprise/security/audit-logging/

# Configure audit policies
kubectl apply -f enterprise/security/audit-policies/
```

## 🔄 Scaling Operations

### Manual Scaling
```bash
# Scale a service
kubectl scale deployment stream-service --replicas=5 -n streaming-encoder

# Scale all services
kubectl scale deployment --all --replicas=3 -n streaming-encoder

# Check HPA status
kubectl get hpa -n streaming-encoder
```

### Auto-scaling Configuration
```bash
# Update HPA configuration
kubectl edit hpa stream-service -n streaming-encoder

# Check auto-scaling events
kubectl describe hpa stream-service -n streaming-encoder

# Monitor resource usage
kubectl top pods -n streaming-encoder
```

### Cluster Autoscaling
```bash
# Enable cluster autoscaler
kubectl apply -f enterprise/cluster-autoscaler/

# Check autoscaler status
kubectl logs -n kube-system cluster-autoscaler-xxxx

# Monitor node usage
kubectl top nodes
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Pod Not Starting
```bash
# Check pod status
kubectl get pods -n streaming-encoder

# Describe pod
kubectl describe pod <pod-name> -n streaming-encoder

# Check pod logs
kubectl logs <pod-name> -n streaming-encoder

# Check previous container logs
kubectl logs <pod-name> --previous -n streaming-encoder
```

#### 2. Service Not Accessible
```bash
# Check service endpoints
kubectl get endpoints -n streaming-encoder

# Check service configuration
kubectl describe svc <service-name> -n streaming-encoder

# Check network policies
kubectl get networkpolicy -n streaming-encoder

# Test connectivity
kubectl run -it --rm debug --image=busybox -- wget -O- http://<service-name>.<namespace>.svc.cluster.local
```

#### 3. Database Connection Issues
```bash
# Check database pods
kubectl get pods -l app=postgres -n streaming-encoder

# Check database logs
kubectl logs <postgres-pod> -n streaming-encoder

# Test database connection
kubectl run -it --rm debug --image=postgres:15 \
  -- psql -h postgres -U streaming -d streaming_db -c "SELECT 1"
```

#### 4. High CPU/Memory Usage
```bash
# Check resource usage
kubectl top pods -n streaming-encoder

# Check resource limits
kubectl get pods <pod-name> -o yaml -n streaming-encoder | grep -A 10 resources

# Check HPA metrics
kubectl describe hpa <hpa-name> -n streaming-encoder

# Check node capacity
kubectl describe nodes
```

### Debug Commands
```bash
# Port forward to service
kubectl port-forward -n streaming-encoder svc/stream-service 3000:3000

# Exec into container
kubectl exec -it <pod-name> -n streaming-encoder -- /bin/bash

# Copy files from container
kubectl cp <pod-name>:/path/to/file ./local-file -n streaming-encoder

# Create debug pod
kubectl run -it --rm debug --image=busybox -- sh
```

## 📈 Performance Tuning

### Database Optimization
```sql
-- PostgreSQL configuration
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '1GB';
ALTER SYSTEM SET effective_cache_size = '3GB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Apply changes
SELECT pg_reload_conf();
```

### Redis Optimization
```bash
# Redis configuration
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
timeout 300
tcp-keepalive 60
```

### Application Optimization
```yaml
# Node.js optimization
NODE_OPTIONS="--max-old-space-size=4096 --optimize-for-size"
UV_THREADPOOL_SIZE=128
HTTP_PARSER_MAX_REQUEST_HEADER_SIZE=81920
```

### Kubernetes Optimization
```yaml
# Resource limits and requests
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "2000m"
    memory: "2Gi"

# Pod disruption budget
podDisruptionBudget:
  minAvailable: 2
  selector:
    matchLabels:
      app: streaming-encoder
```

## 🔄 Backup and Recovery

### Database Backup
```bash
# Create backup
kubectl exec -it <postgres-pod> -n streaming-encoder -- \
  pg_dump -U streaming -d streaming_db > backup.sql

# Schedule backup
kubectl create cronjob database-backup \
  --image=postgres:15 \
  --schedule="0 2 * * *" \
  -- ./backup.sh

# Restore backup
kubectl exec -i <postgres-pod> -n streaming-encoder -- \
  psql -U streaming -d streaming_db < backup.sql
```

### Configuration Backup
```bash
# Backup ConfigMaps
kubectl get configmap -n streaming-encoder -o yaml > configmaps-backup.yaml

# Backup Secrets
kubectl get secrets -n streaming-encoder -o yaml > secrets-backup.yaml

# Restore ConfigMaps
kubectl apply -f configmaps-backup.yaml

# Restore Secrets
kubectl apply -f secrets-backup.yaml
```

### Disaster Recovery
```bash
# Backup entire namespace
kubectl get all -n streaming-encoder -o yaml > namespace-backup.yaml

# Restore namespace
kubectl apply -f namespace-backup.yaml

# Cross-region backup
kubectl apply -f enterprise/backup/cross-region-backup.yaml
```

## 📚 Advanced Features

### Blue-Green Deployment
```bash
# Deploy blue version
kubectl apply -f blue-deployment.yaml

# Deploy green version
kubectl apply -f green-deployment.yaml

# Switch traffic
kubectl patch ingress streaming-encoder -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"streaming-encoder-green"}}}}]}}]}'

# Monitor green deployment
kubectl get pods -l version=green

# Complete deployment
kubectl delete deployment streaming-encoder-blue
```

### Canary Deployment
```bash
# Deploy canary version
kubectl apply -f canary-deployment.yaml

# Split traffic (10% to canary)
kubectl patch ingress streaming-encoder -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"streaming-encoder-canary","weight":"10"}},{"service":{"name":"streaming-encoder-main","weight":"90"}}}}]}}]}'

# Monitor canary metrics
kubectl top pods -l version=canary

# Gradually increase traffic
kubectl patch ingress streaming-encoder -p '{"spec":{"rules":[{"http":{"paths":[{"backend":{"service":{"name":"streaming-encoder-canary","weight":"50"}},{"service":{"name":"streaming-encoder-main","weight":"50"}}}}]}}]}'

# Complete deployment
kubectl apply -f main-deployment-updated.yaml
```

### A/B Testing
```bash
# Deploy A/B versions
kubectl apply -f version-a-deployment.yaml
kubectl apply -f version-b-deployment.yaml

# Configure traffic splitting
kubectl apply -f ab-testing-ingress.yaml

# Monitor metrics
kubectl get pods -l version=version-a
kubectl get pods -l version=version-b

# Analyze results
kubectl logs -l version=version-a | grep "conversion_rate"
kubectl logs -l version=version-b | grep "conversion_rate"
```

This deployment guide provides comprehensive instructions for deploying and managing the enterprise live streaming encoder system in production environments.