# High Availability & Load Balancing Configuration

## 🏗️ High Availability Architecture

### HA Principles
- **No Single Point of Failure**: All components have redundancy
- **Automatic Failover**: Seamless transition between components
- **Load Distribution**: Even distribution of traffic
- **Health Monitoring**: Continuous health checks
- **Graceful Degradation**: System remains functional during partial failures

### Multi-Region Deployment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   US-East-1    │    │   EU-West-1    │    │   AP-Southeast-1│
│   (Primary)     │    │  (Secondary)   │    │  (Disaster)     │
│                 │    │                 │    │                 │
│  ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│  │   Load      │ │    │ │   Load      │ │    │ │   Load      │ │
│  │   Balancer  │ │    │ │   Balancer  │ │    │ │   Balancer  │ │
│  └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│        │        │    │        │        │    │        │        │
│  ┌─────┼─────┐  │    │  ┌─────┼─────┐  │    │  ┌─────┼─────┐  │
│  │     │     │  │    │  │     │     │  │    │  │     │     │  │
│  │  ┌───┴───┐ │  │    │  │  ┌───┴───┐ │  │    │  │  ┌───┴───┐ │  │
│  │  │ Apps  │ │  │    │  │  │ Apps  │ │  │    │  │  │ Apps  │ │  │
│  │  └───┬───┘ │  │    │  │  └───┬───┘ │  │    │  │  └───┬───┘ │  │
│  │     │     │  │    │  │     │     │  │    │  │     │     │  │
│  └─────┼─────┘  │    │  └─────┼─────┘  │    │  └─────┼─────┘  │
│        │        │    │        │        │    │        │        │
│  ┌─────┴─────┐  │    │  ┌─────┴─────┐  │    │  ┌─────┴─────┐  │
│  │   Database │  │    │  │   Database │  │    │  │   Database │  │
│  │  Cluster   │  │    │  │  Cluster   │  │    │  │  Cluster   │  │
│  └───────────┘  │    │  └───────────┘  │    │  └───────────┘  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                │
                    ┌─────────────────┐
                    │   Global DNS    │
                    │   (Route53)     │
                    │                 │
                    │  - Health Checks │
                    │  - Failover      │
                    │  - Latency       │
                    │  - Routing       │
                    └─────────────────┘
```

## ⚖️ Load Balancing Configuration

### Application Load Balancer
```yaml
application_load_balancer:
  type: "alb"
  scheme: "internet-facing"
  ip_address_type: "ipv4"
  load_balancer_attributes:
    - key: "deletion_protection.enabled"
      value: "true"
    - key: "access_logs.s3.enabled"
      value: "true"
    - key: "access_logs.s3.bucket"
      value: "streaming-encoder-logs"
    - key: "routing.http2.enabled"
      value: "true"
    - key: "routing.http.drop_invalid_header_fields.enabled"
      value: "true"
  
  listeners:
    - protocol: "HTTP"
      port: 80
      default_actions:
        - type: "redirect"
          redirect_config:
            protocol: "HTTPS"
            port: "443"
            status_code: "HTTP_301"
    - protocol: "HTTPS"
      port: 443
      certificates:
        - certificate_arn: "arn:aws:acm:us-east-1:123456789012:certificate/streaming-encoder"
      default_actions:
        - type: "forward"
          target_group_arn: "arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/streaming-encoder-primary"
  
  target_groups:
    - name: "streaming-encoder-primary"
      protocol: "HTTP"
      port: 3000
      health_check:
        enabled: true
        path: "/health"
        interval: 30
        timeout: 5
        healthy_threshold: 3
        unhealthy_threshold: 3
        matcher:
          http_code: "200"
      target_type: "ip"
      targets:
        - id: "10.0.1.10"
          port: 3000
        - id: "10.0.1.11"
          port: 3000
        - id: "10.0.1.12"
          port: 3000
```

### Internal Load Balancer
```yaml
internal_load_balancer:
  type: "nlb"
  scheme: "internal"
  ip_address_type: "ipv4"
  load_balancer_attributes:
    - key: "deletion_protection.enabled"
      value: "true"
    - key: "cross_zone_load_balancing.enabled"
      value: "true"
  
  listeners:
    - protocol: "TCP"
      port: 5432
      default_actions:
        - type: "forward"
          target_group_arn: "arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/postgres-primary"
    - protocol: "TCP"
      port: 6379
      default_actions:
        - type: "forward"
          target_group_arn: "arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/redis-primary"
    - protocol: "TCP"
      port: 9092
      default_actions:
        - type: "forward"
          target_group_arn: "arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/kafka-brokers"
```

### Kubernetes Ingress Controller
```yaml
ingress_controller:
  type: "nginx"
  replica_count: 3
  resources:
    requests:
      cpu: "100m"
      memory: "128Mi"
    limits:
      cpu: "500m"
      memory: "512Mi"
  
  config:
    use-proxy-protocol: "true"
    proxy-protocol-header-timeout: "30s"
    enable-opentracing: "true"
    jaeger-collector-host: "jaeger-collector"
    jaeger-service-name: "nginx-ingress"
    jaeger-propagation-format: "w3c"
    jaeger-sampler-type: "const"
    jaeger-sampler-param: "1"
  
  ingress_rules:
    - host: "api.streaming-encoder.com"
      paths:
        - path: /streams
          backend:
            service:
              name: stream-service
              port: 3000
        - path: /ad-breaks
          backend:
            service:
              name: ad-service
              port: 3001
        - path: /encoder
          backend:
            service:
              name: encoder-service
              port: 3002
        - path: /scte35
          backend:
            service:
              name: scte35-service
              port: 3003
    
    - host: "admin.streaming-encoder.com"
      paths:
        - path: /
          backend:
            service:
              name: frontend-admin
              port: 80
    
    - host: "dashboard.streaming-encoder.com"
      paths:
        - path: /
          backend:
            service:
              name: frontend-dashboard
              port: 80
```

## 🔁 Failover Configuration

### Database Failover
```yaml
database_failover:
  postgresql:
    primary:
      host: "postgres-primary"
      port: 5432
      role: "primary"
      priority: 100
    replicas:
      - host: "postgres-replica-1"
        port: 5432
        role: "replica"
        priority: 50
      - host: "postgres-replica-2"
        port: 5432
        role: "replica"
        priority: 50
    
    failover:
      detection:
        method: "health_check"
        interval: 5s
        timeout: 3s
        retries: 3
      promotion:
        method: "automatic"
        delay: 30s
      demotion:
        method: "manual"
        verification: true
    
    connection_pooling:
      max_connections: 100
      min_connections: 10
      connection_lifetime: 3600s
      idle_timeout: 600s
```

### Redis Failover
```yaml
redis_failover:
  sentinel:
    masters:
      - name: "mymaster"
        ip: "redis-primary"
        port: 6379
        quorum: 2
    sentinels:
      - host: "redis-sentinel-1"
        port: 26379
      - host: "redis-sentinel-2"
        port: 26379
      - host: "redis-sentinel-3"
        port: 26379
    
    failover:
      timeout: 30000ms
      retry_delay: 1000ms
      max_retries: 3
    
    client:
      connection_timeout: 5000ms
      command_timeout: 5000ms
      socket_timeout: 5000ms
```

### Service Failover
```yaml
service_failover:
  health_checks:
    stream-service:
      path: "/health"
      interval: 10s
      timeout: 5s
      success_threshold: 2
      failure_threshold: 3
    ad-service:
      path: "/health"
      interval: 10s
      timeout: 5s
      success_threshold: 2
      failure_threshold: 3
    encoder-service:
      path: "/health"
      interval: 10s
      timeout: 5s
      success_threshold: 2
      failure_threshold: 3
  
  circuit_breakers:
    stream-service:
      failure_threshold: 5
      recovery_threshold: 3
      timeout: 30s
      half_open_attempts: 3
    ad-service:
      failure_threshold: 3
      recovery_threshold: 2
      timeout: 20s
      half_open_attempts: 2
    encoder-service:
      failure_threshold: 10
      recovery_threshold: 5
      timeout: 60s
      half_open_attempts: 5
```

## 🌐 Global Load Balancing

### DNS Configuration
```yaml
dns_configuration:
  provider: "route53"
  health_checks:
    - type: "HTTP"
      resource_path: "/health"
      port: 443
      request_interval: 30
      failure_threshold: 3
  records:
    - name: "api.streaming-encoder.com"
      type: "A"
      ttl: 60
      routing_policy: "latency"
      health_check: true
      values:
        - region: "us-east-1"
          ip: "192.0.2.1"
          health_check: "api-us-east-1-health"
        - region: "eu-west-1"
          ip: "192.0.2.2"
          health_check: "api-eu-west-1-health"
        - region: "ap-southeast-1"
          ip: "192.0.2.3"
          health_check: "api-ap-southeast-1-health"
    
    - name: "cdn.streaming-encoder.com"
      type: "CNAME"
      ttl: 300
      routing_policy: "geolocation"
      values:
        - region: "North America"
          value: "cdn-na.streaming-encoder.com"
        - region: "Europe"
          value: "cdn-eu.streaming-encoder.com"
        - region: "Asia Pacific"
          value: "cdn-ap.streaming-encoder.com"
```

### CDN Configuration
```yaml
cdn_configuration:
  provider: "cloudflare"
  origins:
    - domain: "api.streaming-encoder.com"
      port: 443
      protocol: "https"
      ssl: "full"
    - domain: "hls.streaming-encoder.com"
      port: 443
      protocol: "https"
      ssl: "full"
  
  caching:
    default_ttl: 3600
    max_ttl: 86400
    min_ttl: 60
    respect_headers: true
    cache_level: "cache_everything"
  
  compression:
    enabled: true
    types: ["text/html", "text/css", "application/javascript", "application/json"]
  
  security:
    ssl: "strict"
    tls_1_3: true
    http2: true
    waf: true
    ddos_protection: true
  
  performance:
    http3: true
    image_optimization: true
    minify: true
    prefetch: true
```

## 📊 Health Monitoring

### Health Check Endpoints
```yaml
health_checks:
  liveness:
    path: "/health/live"
    description: "Basic liveness check"
    checks:
      - database_connection
      - redis_connection
      - kafka_connection
      - memory_usage
      - cpu_usage
  
  readiness:
    path: "/health/ready"
    description: "Readiness check for service availability"
    checks:
      - database_connection
      - redis_connection
      - kafka_connection
      - external_services
      - configuration_loaded
      - dependencies_available
  
  startup:
    path: "/health/startup"
    description: "Startup probe for container initialization"
    checks:
      - service_initialized
      - database_migrated
      - cache_warmed
      - external_connections
  
  detailed:
    path: "/health/detailed"
    description: "Comprehensive health check with metrics"
    checks:
      - database:
          connection: true
          query_performance: true
          replication_status: true
          backup_status: true
      - redis:
          connection: true
          memory_usage: true
          replication_status: true
      - kafka:
          connection: true
          topic_health: true
          consumer_lag: true
      - services:
          stream_service: true
          ad_service: true
          encoder_service: true
          scte35_service: true
      - system:
          memory_usage: true
          cpu_usage: true
          disk_usage: true
          network_health: true
```

### Health Check Response Format
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "response_time": 15,
      "details": {
        "connection": "connected",
        "query_performance": "good",
        "replication_status": "synced",
        "backup_status": "completed"
      }
    },
    "redis": {
      "status": "healthy",
      "response_time": 5,
      "details": {
        "connection": "connected",
        "memory_usage": "45%",
        "replication_status": "synced"
      }
    },
    "kafka": {
      "status": "healthy",
      "response_time": 8,
      "details": {
        "connection": "connected",
        "topic_health": "healthy",
        "consumer_lag": "0ms"
      }
    },
    "services": {
      "stream_service": {
        "status": "healthy",
        "response_time": 25,
        "active_connections": 150
      },
      "ad_service": {
        "status": "healthy",
        "response_time": 18,
        "active_connections": 75
      },
      "encoder_service": {
        "status": "healthy",
        "response_time": 32,
        "active_sessions": 25
      },
      "scte35_service": {
        "status": "healthy",
        "response_time": 12,
        "active_connections": 50
      }
    },
    "system": {
      "status": "healthy",
      "details": {
        "memory_usage": "65%",
        "cpu_usage": "45%",
        "disk_usage": "72%",
        "network_health": "good"
      }
    }
  },
  "metrics": {
    "uptime": 86400,
    "requests_total": 150000,
    "errors_total": 150,
    "active_sessions": 25,
    "database_connections": 45,
    "redis_connections": 20
  }
}
```

## 🔄 Auto-scaling Configuration

### Horizontal Pod Autoscaler
```yaml
horizontal_pod_autoscaler:
  stream_service:
    min_replicas: 3
    max_replicas: 15
    target_cpu_utilization: 70
    target_memory_utilization: 80
    custom_metrics:
      - type: "Pods"
        pods:
          metric:
            name: "http_requests_per_second"
          target:
            type: "AverageValue"
            averageValue: "100"
    behavior:
      scale_down:
        stabilization_window_seconds: 300
        policies:
          - type: "Percent"
            value: 10
            period_seconds: 60
      scale_up:
        stabilization_window_seconds: 60
        policies:
          - type: "Percent"
            value: 50
            period_seconds: 60
          - type: "Pods"
            value: 2
            period_seconds: 60
        select_policy: "Max"
  
  encoder_service:
    min_replicas: 4
    max_replicas: 20
    target_cpu_utilization: 70
    target_memory_utilization: 80
    custom_metrics:
      - type: "External"
        external:
          metric:
            name: "active_encoding_sessions"
          target:
            type: "AverageValue"
            averageValue: "5"
    behavior:
      scale_down:
        stabilization_window_seconds: 600
        policies:
          - type: "Percent"
            value: 10
            period_seconds: 120
      scale_up:
        stabilization_window_seconds: 30
        policies:
          - type: "Percent"
            value: 100
            period_seconds: 30
```

### Cluster Autoscaler
```yaml
cluster_autoscaler:
  scale_down_enabled: true
  scale_down_delay_after_add: "10m"
  scale_down_delay_after_delete: "10m"
  scale_down_delay_after_failure: "3m"
  scale_down_unneeded_time: "10m"
  scale_down_utilization_threshold: 0.5
  max_node_provision_time: "15m"
  skip_nodes_with_local_storage: true
  skip_nodes_with_system_pods: true
  balance_similar_node_groups: true
  expander: "priority"
  
  node_groups:
    - name: "streaming-nodes"
      min_size: 3
      max_size: 20
      instance_type: "m5.xlarge"
      labels:
        nodegroup: "streaming"
        role: "worker"
      taints:
        - key: "dedicated"
          value: "streaming"
          effect: "NoSchedule"
    
    - name: "encoder-nodes"
      min_size: 2
      max_size: 10
      instance_type: "c5.2xlarge"
      labels:
        nodegroup: "encoder"
        role: "worker"
      taints:
        - key: "dedicated"
          value: "encoder"
          effect: "NoSchedule"
    
    - name: "database-nodes"
      min_size: 2
      max_size: 5
      instance_type: "r5.large"
      labels:
        nodegroup: "database"
        role: "worker"
      taints:
        - key: "dedicated"
          value: "database"
          effect: "NoSchedule"
```

This high availability and load balancing configuration ensures the live streaming encoder system remains operational and performant even during component failures or high traffic periods.