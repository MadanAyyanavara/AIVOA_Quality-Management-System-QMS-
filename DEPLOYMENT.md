# Production Deployment Guide

Guide for deploying the Pharmaceutical QMS API to production environments.

## Pre-Deployment Checklist

- [ ] Environment variables configured securely
- [ ] Database backup strategy in place
- [ ] SSL/TLS certificates obtained
- [ ] Firewall rules configured
- [ ] Monitoring and alerting set up
- [ ] Logging configured
- [ ] Rate limiting implemented
- [ ] Authentication/authorization configured

## Deployment Options

### Option 1: Docker on Linux Server (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- Ubuntu 20.04 LTS or equivalent
- 2GB RAM minimum, 4GB recommended
- 20GB storage minimum

#### Steps

1. **Clone repository**
```bash
git clone <repo-url>
cd AIVOA_Quality-Management-System-QMS-
```

2. **Create production .env**
```bash
cp .env.example .env.production
```

Edit `.env.production`:
```env
DATABASE_URL=postgresql://qms_user:strong_password_here@postgres:5432/qms_db
GROQ_API_KEY=your_production_key
DEBUG=False
CORS_ORIGINS=["https://yourdomain.com", "https://app.yourdomain.com"]
API_TITLE=Pharmaceutical QMS
API_VERSION=1.0.0
```

3. **Create docker-compose.production.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: qms-postgres-prod
    environment:
      POSTGRES_DB: qms_db
      POSTGRES_USER: qms_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - qms_network
    restart: always
    # Backup script
    command: postgres -c max_connections=100 -c shared_buffers=256MB

  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: qms-api-prod
    environment:
      DATABASE_URL: postgresql://qms_user:${DB_PASSWORD}@postgres:5432/qms_db
      GROQ_API_KEY: ${GROQ_API_KEY}
      DEBUG: False
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    networks:
      - qms_network
    restart: always
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  nginx:
    image: nginx:alpine
    container_name: qms-nginx-prod
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api
    networks:
      - qms_network
    restart: always

volumes:
  postgres_data:
    driver: local

networks:
  qms_network:
    driver: bridge
```

4. **Create nginx.conf**
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=extract_limit:10m rate=5r/s;

    upstream api {
        server api:8000;
    }

    server {
        listen 80;
        server_name _;

        # Redirect HTTP to HTTPS
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;

        location / {
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_buffering off;
        }

        location /api/extract {
            limit_req zone=extract_limit burst=10 nodelay;
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            access_log off;
            proxy_pass http://api;
            proxy_set_header Host $host;
        }
    }
}
```

5. **Deploy**
```bash
export DB_PASSWORD="your_secure_password"
export GROQ_API_KEY="your_groq_key"
docker-compose -f docker-compose.production.yml up -d
```

6. **Verify deployment**
```bash
curl https://yourdomain.com/health
```

### Option 2: Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster (1.21+)
- kubectl configured
- Docker registry access

#### Create deployment manifests

**qms-deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qms-api
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: qms-api
  template:
    metadata:
      labels:
        app: qms-api
    spec:
      containers:
      - name: api
        image: your-registry/qms-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: qms-secrets
              key: database-url
        - name: GROQ_API_KEY
          valueFrom:
            secretKeyRef:
              name: qms-secrets
              key: groq-api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: qms-api-service
spec:
  selector:
    app: qms-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

#### Deploy to Kubernetes
```bash
# Create secrets
kubectl create secret generic qms-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=groq-api-key="your_key"

# Deploy
kubectl apply -f qms-deployment.yaml

# Check status
kubectl get deployments
kubectl get pods
```

## Database Backup Strategy

### Automated Backups (Docker)

Create **backup.sh**:
```bash
#!/bin/bash
set -e

BACKUP_DIR="/backups/qms"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_CONTAINER="qms-postgres-prod"
DB_NAME="qms_db"
DB_USER="qms_user"

mkdir -p "$BACKUP_DIR"

# Backup database
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/qms_${TIMESTAMP}.sql.gz"

# Keep only last 7 days
find $BACKUP_DIR -name "qms_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/qms_${TIMESTAMP}.sql.gz"
```

Add to crontab:
```bash
0 2 * * * /opt/qms/backup.sh  # Daily at 2 AM
```

## Monitoring & Logging

### Prometheus Metrics

Create **prometheus.yml**:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'qms-api'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'
```

### Structured Logging

Add to **app/main.py**:
```python
import logging.config

logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "()": "pythonjsonlogger.jsonlogger.JsonFormatter"
        }
    },
    "handlers": {
        "default": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "json"
        }
    },
    "loggers": {
        "": {
            "handlers": ["default"],
            "level": "INFO"
        }
    }
})
```

## Performance Tuning

### PostgreSQL Configuration

```sql
-- Connect as superuser
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '512MB';
ALTER SYSTEM SET effective_cache_size = '2GB';
ALTER SYSTEM SET maintenance_work_mem = '128MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Reload
SELECT pg_reload_conf();
```

### Index Creation

```sql
-- Add indexes for common queries
CREATE INDEX idx_complaint_product ON complaints(product_name);
CREATE INDEX idx_complaint_batch ON complaints(batch_number);
CREATE INDEX idx_complaint_status ON complaints(status);
CREATE INDEX idx_complaint_created ON complaints(created_at DESC);
CREATE INDEX idx_complaint_severity ON complaints(initial_severity);
```

## SSL/TLS Setup

### Using Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo certbot renew --dry-run
```

## Health Checks & Monitoring

```bash
# Check API health
curl https://yourdomain.com/health

# Monitor logs
docker logs -f qms-api-prod

# Check database connection
docker exec qms-postgres-prod psql -U qms_user -d qms_db -c "SELECT 1;"
```

## Scaling Strategies

### Horizontal Scaling
- Run multiple API instances behind load balancer
- Use connection pooling for database
- Implement caching layer (Redis)

### Vertical Scaling
- Increase CPU/memory allocation
- Optimize database queries
- Upgrade hardware

## Disaster Recovery

### Recovery Procedure

1. **Restore from backup**
```bash
docker exec -i qms-postgres-prod psql -U qms_user -d qms_db < backup.sql
```

2. **Verify data integrity**
```bash
docker exec qms-postgres-prod psql -U qms_user -d qms_db -c "SELECT COUNT(*) FROM complaints;"
```

3. **Restart services**
```bash
docker-compose -f docker-compose.production.yml restart
```

## Security Best Practices

1. **Secrets Management**
   - Use environment variables or secret vaults
   - Never commit .env files
   - Rotate API keys regularly

2. **Database Security**
   - Use strong passwords
   - Restrict network access
   - Enable SSL for connections
   - Regular backups

3. **API Security**
   - Implement authentication (OAuth2, API keys)
   - Rate limiting (already configured)
   - Input validation (Pydantic)
   - HTTPS only

4. **Server Security**
   - Keep systems updated
   - Use firewall rules
   - Monitor logs
   - Regular security audits

## Support

For deployment issues:
- Check Docker logs: `docker logs qms-api-prod`
- Check database connectivity: `docker exec qms-postgres-prod pg_isready`
- Review nginx logs: `docker logs qms-nginx-prod`
- Check system resources: `docker stats`

## Maintenance

### Regular Tasks

- **Weekly**: Check error logs
- **Monthly**: Review performance metrics
- **Quarterly**: Security updates
- **Annually**: Capacity planning
