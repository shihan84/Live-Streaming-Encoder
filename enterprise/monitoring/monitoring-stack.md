# Enterprise Monitoring & Observability Stack

## 📊 Monitoring Architecture

### Observability Pillars
1. **Metrics**: Quantitative measurements of system behavior
2. **Logs**: Detailed records of system events
3. **Traces**: Request lifecycle tracking across services
4. **Events**: Significant occurrences in the system

### Monitoring Stack Components
```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Metrics   │  │    Logs     │  │   Traces    │          │
│  │             │  │             │  │             │          │
│  │ Prometheus  │  │  ELK Stack  │  │   Jaeger    │          │
│  │   +         │  │  +          │  │   +         │          │
│  │ Grafana     │  │ Fluentd     │  │   OpenTelemetry│       │
│  │ Alertmanager│  │ Filebeat    │  │   Zipkin    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Events    │  │   Health    │  │   Business  │          │
│  │             │  │   Checks    │  │   Metrics   │          │
│  │             │  │             │  │             │          │
│  │   Kafka     │  │   Consul    │  │   Custom    │          │
│  │   Events    │  │   Health    │  │   Metrics   │          │
│  │   Stream    │  │   Checks    │  │   API        │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Metrics Collection

### Application Metrics
```yaml
application_metrics:
  streams:
    - name: active_streams_count
      type: gauge
      description: Number of currently active streams
      labels: [region, quality, protocol]
    - name: stream_start_total
      type: counter
      description: Total number of streams started
      labels: [status, encoder_type]
    - name: stream_duration_seconds
      type: histogram
      description: Duration of streaming sessions
      buckets: [60, 300, 900, 1800, 3600]
  
  encoding:
    - name: encoding_sessions_active
      type: gauge
      description: Number of active encoding sessions
      labels: [encoder_type, resolution, bitrate]
    - name: encoding_errors_total
      type: counter
      description: Total encoding errors
      labels: [error_type, service]
    - name: encoding_bitrate_kbps
      type: gauge
      description: Current encoding bitrate
      labels: [stream_id, quality]
  
  scte35:
    - name: scte35_markers_generated_total
      type: counter
      description: Total SCTE-35 markers generated
      labels: [marker_type, provider]
    - name: scte35_ad_breaks_scheduled
      type: gauge
      description: Number of scheduled ad breaks
      labels: [status, time_window]
    - name: scte35_markers_injected_total
      type: counter
      description: Total SCTE-35 markers injected
      labels: [injection_type, success]
  
  system:
    - name: http_requests_total
      type: counter
      description: Total HTTP requests
      labels: [method, endpoint, status]
    - name: http_request_duration_seconds
      type: histogram
      description: HTTP request duration
      buckets: [0.1, 0.5, 1.0, 2.5, 5.0, 10.0]
    - name: database_connections_active
      type: gauge
      description: Active database connections
      labels: [database, pool]
```

### Infrastructure Metrics
```yaml
infrastructure_metrics:
  containers:
    - name: container_cpu_usage_seconds_total
      type: counter
      description: Container CPU usage
    - name: container_memory_usage_bytes
      type: gauge
      description: Container memory usage
    - name: container_network_receive_bytes_total
      type: counter
      description: Container network receive bytes
    - name: container_network_transmit_bytes_total
      type: counter
      description: Container network transmit bytes
  
  kubernetes:
    - name: kube_pod_status_phase
      type: gauge
      description: Kubernetes pod status
    - name: kube_deployment_status_replicas
      type: gauge
      description: Kubernetes deployment replicas
    - name: kube_node_status_condition
      type: gauge
      description: Kubernetes node status
  
  database:
    - name: postgresql_connections_total
      type: gauge
      description: PostgreSQL total connections
    - name: postgresql_transactions_total
      type: counter
      description: PostgreSQL transactions
    - name: redis_connected_clients
      type: gauge
      description: Redis connected clients
    - name: redis_used_memory_bytes
      type: gauge
      description: Redis used memory
```

### Business Metrics
```yaml
business_metrics:
  streaming:
    - name: streaming_uptime_percentage
      type: gauge
      description: Streaming service uptime
    - name: concurrent_viewers_total
      type: gauge
      description: Total concurrent viewers
      labels: [stream_id, region, quality]
    - name: streaming_revenue_total
      type: counter
      description: Total streaming revenue
      labels: [monetization_type, region]
  
  advertising:
    - name: ad_impressions_total
      type: counter
      description: Total ad impressions
      labels: [ad_type, placement, region]
    - name: ad_revenue_total
      type: counter
      description: Total ad revenue
      labels: [advertiser, campaign]
    - name: ad_fill_rate_percentage
      type: gauge
      description: Ad fill rate percentage
      labels: [placement, demand_partner]
  
  quality:
    - name: video_quality_score
      type: gauge
      description: Video quality score (0-100)
      labels: [stream_id, resolution, bitrate]
    - name: buffer_events_total
      type: counter
      description: Total buffer events
      labels: [buffer_duration, device_type]
    - name: error_rate_percentage
      type: gauge
      description: Streaming error rate
      labels: [error_type, platform]
```

## 📝 Logging Strategy

### Structured Logging Format
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "service": "stream-service",
  "component": "stream-controller",
  "correlation_id": "abc123-def456-ghi789",
  "user_id": "user123",
  "session_id": "session456",
  "request_id": "req789",
  "message": "Stream started successfully",
  "metadata": {
    "stream_id": "stream_001",
    "input_url": "rtmp://input.example.com/live/stream1",
    "output_url": "http://output.example.com/live/stream1.m3u8",
    "bitrate": 2500,
    "resolution": "1920x1080",
    "encoder_type": "ffmpeg",
    "region": "us-east-1",
    "client_ip": "192.168.1.100",
    "user_agent": "Mozilla/5.0..."
  },
  "metrics": {
    "duration_ms": 150,
    "memory_usage_mb": 256,
    "cpu_usage_percent": 45.2
  },
  "tags": ["stream", "start", "success"],
  "version": "1.0.0"
}
```

### Log Levels and Categories
```yaml
log_levels:
  ERROR:
    - System failures
    - Authentication failures
    - Encoding errors
    - Data corruption
    - Security violations
  WARN:
    - Performance degradation
    - Resource exhaustion
    - Configuration issues
    - Deprecated features
  INFO:
    - Stream lifecycle events
    - User actions
    - System state changes
    - Business events
  DEBUG:
    - Detailed execution flow
    - Variable states
    - Network calls
    - Database queries
  TRACE:
    - Method entry/exit
    - Loop iterations
    - Data transformations
    - Internal state changes

log_categories:
  application:
    - business_logic
    - api_requests
    - data_processing
    - external_integrations
  infrastructure:
    - database_operations
    - cache_operations
    - message_queue
    - file_system
  security:
    - authentication
    - authorization
    - audit_events
    - security_violations
  performance:
    - response_times
    - resource_usage
    - throughput
    - error_rates
```

### Log Aggregation and Processing
```yaml
log_pipeline:
  collection:
    agents:
      - filebeat: containers
      - fluentd: applications
      - promtail: system_logs
    formats:
      - json: structured_logs
      - text: unstructured_logs
      - syslog: network_devices
  processing:
    enrichment:
      - geoip: client_location
      - user_agent: device_info
      - threat_intelligence: security_analysis
    parsing:
      - grok: unstructured_logs
      - json: structured_data
      - regex: pattern_matching
    filtering:
      - level: minimum_log_level
      - service: specific_services
      - environment: production_only
  storage:
    elasticsearch:
      retention:
        hot: 7_days
        warm: 30_days
        cold: 90_days
        frozen: 1_year
      indexing:
        shards: 3
        replicas: 1
        refresh_interval: 5s
    s3_archive:
      retention: 7_years
      compression: gzip
      encryption: aes256
```

## 🔍 Distributed Tracing

### Trace Configuration
```yaml
tracing:
  sampler:
    type: probabilistic
    rate: 0.1  # 10% sampling
  exporter:
    type: jaeger
    endpoint: http://jaeger:14268/api/traces
  propagators:
    - tracecontext
    - baggage
    - jaeger
  resource_attributes:
    service.name: streaming-encoder
    service.version: 1.0.0
    deployment.environment: production
    host.name: streaming-encoder-01
```

### Span Attributes
```yaml
span_attributes:
  standard:
    - component
    - error
    - http.method
    - http.status_code
    - http.url
    - net.peer.name
    - net.peer.port
  custom:
    - stream_id
    - session_id
    - user_id
    - correlation_id
    - request_id
    - business_unit
    - cost_center
  metrics:
    - duration_ms
    - memory_usage_mb
    - cpu_usage_percent
    - database_query_count
    - cache_hit_ratio
```

### Trace Context Propagation
```yaml
context_propagation:
  http_headers:
    - traceparent: W3C Trace Context
    - tracestate: Trace State
    - baggage: Baggage
    - x-request-id: Request ID
    - x-correlation-id: Correlation ID
  message_formats:
    - json: structured_messages
    - protobuf: binary_messages
    - text: plain_text
  services:
    - stream-service: http/grpc
    - ad-service: http/kafka
    - encoder-service: http/grpc
    - scte35-service: http/grpc
    - monitor-service: http
```

## 🚨 Alerting System

### Alert Rules
```yaml
alert_rules:
  critical:
    - name: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
      for: 5m
      labels:
        severity: critical
        category: availability
      annotations:
        summary: "High error rate detected"
        description: "Error rate is {{ $value | humanizePercentage }} for {{ $labels.service }}"
        runbook_url: "https://wiki.company.com/runbooks/high_error_rate"
    
    - name: DatabaseDown
      expr: up{job="postgres"} == 0
      for: 1m
      labels:
        severity: critical
        category: infrastructure
      annotations:
        summary: "Database is down"
        description: "PostgreSQL database is not responding"
        runbook_url: "https://wiki.company.com/runbooks/database_down"
    
    - name: EncoderServiceDown
      expr: up{job="encoder-service"} == 0
      for: 2m
      labels:
        severity: critical
        category: streaming
      annotations:
        summary: "Encoder service is down"
        description: "Encoder service is not responding"
        runbook_url: "https://wiki.company.com/runbooks/encoder_down"
  
  warning:
    - name: HighMemoryUsage
      expr: container_memory_usage_bytes{container=~"stream-.*"} / container_spec_memory_limit_bytes{container=~"stream-.*"} > 0.8
      for: 10m
      labels:
        severity: warning
        category: performance
      annotations:
        summary: "High memory usage detected"
        description: "Memory usage is {{ $value | humanizePercentage }} for {{ $labels.container }}"
    
    - name: SlowDatabaseQueries
      expr: histogram_quantile(0.95, postgresql_query_duration_seconds_bucket) > 1
      for: 5m
      labels:
        severity: warning
        category: database
      annotations:
        summary: "Slow database queries detected"
        description: "95th percentile query duration is {{ $value }}s"
    
    - name: LowDiskSpace
      expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
      for: 5m
      labels:
        severity: warning
        category: infrastructure
      annotations:
        summary: "Low disk space"
        description: "Disk space is {{ $value | humanizePercentage }} free"
  
  info:
    - name: HighCPUUsage
      expr: rate(container_cpu_usage_seconds_total{container=~"stream-.*"}[5m]) > 0.8
      for: 10m
      labels:
        severity: info
        category: performance
      annotations:
        summary: "High CPU usage detected"
        description: "CPU usage is {{ $value | humanizePercentage }} for {{ $labels.container }}"
    
    - name: ManyRestarts
      expr: changes(kube_pod_container_status_restarts_total[1h]) > 3
      for: 15m
      labels:
        severity: info
        category: infrastructure
      annotations:
        summary: "Container restarts detected"
        description: "Container {{ $labels.container }} has restarted {{ $value }} times in the last hour"
```

### Alert Routing
```yaml
alert_routing:
  critical:
    channels:
      - pagerduty:
          service_key: "${PAGERDUTY_SERVICE_KEY}"
          severity: critical
      - slack:
          channel: "#alerts-critical"
          webhook_url: "${SLACK_WEBHOOK_URL}"
      - email:
          recipients: ["ops-team@company.com", "oncall@company.com"]
          subject: "CRITICAL: {{ .CommonAnnotations.summary }}"
    escalation:
      - 5m: repeat_alert
      - 15m: escalate_to_manager
      - 30m: escalate_to_director
  
  warning:
    channels:
      - slack:
          channel: "#alerts-warning"
          webhook_url: "${SLACK_WEBHOOK_URL}"
      - email:
          recipients: ["dev-team@company.com"]
          subject: "WARNING: {{ .CommonAnnotations.summary }}"
    escalation:
      - 30m: repeat_alert
      - 2h: escalate_to_team_lead
  
  info:
    channels:
      - slack:
          channel: "#alerts-info"
          webhook_url: "${SLACK_WEBHOOK_URL}"
    escalation:
      - 1h: repeat_alert
```

### Alert Suppression
```yaml
alert_suppression:
  maintenance_windows:
    - name: "Weekly Maintenance"
      schedule: "0 2 * * 0"  # Sunday 2 AM
      duration: "2h"
      affected_services: ["stream-service", "encoder-service"]
    - name: "Database Maintenance"
      schedule: "0 3 * * 1"  # Monday 3 AM
      duration: "1h"
      affected_services: ["postgres", "redis"]
  
  alert_grouping:
    by: ["alertname", "service", "severity"]
    group_wait: 30s
    group_interval: 5m
    repeat_interval: 12h
```

## 📈 Dashboard Templates

### System Overview Dashboard
```yaml
dashboard:
  title: "Streaming Encoder - System Overview"
  description: "High-level system health and performance metrics"
  panels:
    - title: "System Health"
      type: stat
      targets:
        - expr: up{job=~"stream-.*"}
          legendFormat: "{{ job }}"
      colorMode: "value"
      thresholds:
        - color: "red"
          value: 0
        - color: "green"
          value: 1
    
    - title: "Active Streams"
      type: graph
      targets:
        - expr: active_streams_count
          legendFormat: "Active Streams"
      yAxes:
        - min: 0
    
    - title: "Error Rate"
      type: graph
      targets:
        - expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])
          legendFormat: "Error Rate"
      yAxes:
        - min: 0
        - max: 1
        - format: "percentunit"
    
    - title: "Resource Usage"
      type: graph
      targets:
        - expr: rate(container_cpu_usage_seconds_total{container=~"stream-.*"}[5m])
          legendFormat: "CPU - {{ container }}"
        - expr: container_memory_usage_bytes{container=~"stream-.*"} / 1024 / 1024 / 1024
          legendFormat: "Memory - {{ container }}"
      yAxes:
        - format: "bytes"
```

### Streaming Performance Dashboard
```yaml
dashboard:
  title: "Streaming Performance"
  description: "Detailed streaming performance metrics"
  panels:
    - title: "Concurrent Viewers"
      type: graph
      targets:
        - expr: concurrent_viewers_total
          legendFormat: "{{ region }} - {{ quality }}"
      yAxes:
        - min: 0
    
    - title: "Video Quality Score"
      type: graph
      targets:
        - expr: video_quality_score
          legendFormat: "{{ stream_id }} - {{ resolution }}"
      yAxes:
        - min: 0
        - max: 100
    
    - title: "Buffer Events"
      type: graph
      targets:
        - expr: rate(buffer_events_total[5m])
          legendFormat: "{{ buffer_duration }} - {{ device_type }}"
      yAxes:
        - min: 0
    
    - title: "Streaming Uptime"
      type: stat
      targets:
        - expr: streaming_uptime_percentage
          legendFormat: "Uptime"
      colorMode: "value"
      thresholds:
        - color: "red"
          value: 95
        - color: "yellow"
          value: 98
        - color: "green"
          value: 99.5
```

This comprehensive monitoring and observability stack provides enterprise-grade visibility into the live streaming encoder system, enabling proactive monitoring, troubleshooting, and optimization.