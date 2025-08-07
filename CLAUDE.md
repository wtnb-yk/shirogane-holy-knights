# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

だんいんポータル - Fan service for 白銀ノエル

### Architecture

This existing project uses the following technology stack:
- **Backend**: 
  - Local development: Kotlin + Spring Boot 3.2 (WebFlux) + R2DBC (PostgreSQL)
  - Production environment: Same as above + Spring Cloud Function + AWS Lambda
- **Frontend**: Next.js + TypeScript + SWR + TailwindCSS
- **Database**: PostgreSQL 14 (Liquibase migrations)
- **Infrastructure**: AWS (Lambda, API Gateway, RDS, Amplify, CloudFront) + Terraform
- **Build Tools**: Gradle (Kotlin), npm

### System Architecture

```
Frontend (Next.js) → API Gateway → Lambda (Spring Boot) → RDS (PostgreSQL)
                                                      ↓
                              CloudFront (CDN) ← S3 (Static files)
```

## Essential Commands

### Backend Development

```bash
# Start backend (http://localhost:8080)
docker compose up -d --build backend

# Run tests
# TODO: Test implementation
```

### Frontend Development

```bash
# Start frontend (http://localhost:3001)
docker compose up -d --build frontend
```

**See `frontend/README.md` for frontend-related details**

### Local Environment Setup

```bash
# Start PostgreSQL + all services
docker-compose up -d

# Start database only
docker-compose up postgres -d

# Execute migrations
docker-compose up liquibase
```

### Data Import Tools

```bash
# Fetch YouTube data and sync with DB 
cd tools && make sync-{local|dev|prd}

# Import news data  
cd tools && make news-import-{local|dev|prd}

# Connect to database
cd tools && make db-{dev|prd}

# Disconnect from database
cd tools && make db-{dev|prd}-stop

# Database connection status
cd tools && make db-{dev|prd}-status
```

### Infrastructure Operations

```bash
# Terraform operations (Infrastructure build/update)
gh workflow run terraform.yml --field environment=dev --field action=plan
gh workflow run terraform.yml --field environment=dev --field action=apply
gh workflow run terraform.yml --field environment=prd --field action=plan
gh workflow run terraform.yml --field environment=prd --field action=apply

# Backend deployment (Lambda function update)
gh workflow run temp-deploy-bacnend.yml --field environment=dev
gh workflow run temp-deploy-bacnend.yml --field environment=prd

# Check workflow execution status
gh run list --workflow=terraform.yml
gh run list --workflow=deploy-backend.yml

# Check running workflow details
gh run view --workflow=terraform.yml
```

## Important Project Structure

### Backend (Kotlin/Spring Boot)
- `src/main/kotlin/com/shirogane/holy/knights/`
  - `adapter/` - Controllers & Repository implementations
  - `application/` - Use cases & DTOs  
  - `domain/` - Domain models & repository interfaces
  - `infrastructure/` - Configuration & Lambda handlers
- `src/main/resources/db/changelog/` - Liquibase migrations

### Frontend (Next.js)
**See `frontend/README.md` for detailed structure**

### Infrastructure  
- `infrastructure/terraform/environments/` - Environment-specific configs
- `infrastructure/terraform/modules/` - Reusable Terraform modules

## Development Notes

### Database Connection
- Local: `localhost:5432/shirogane` (postgres/postgres)
- Dev: Connect to RDS via Bastion (`make db-dev`)
- Prd: Connect to RDS via Bastion (`make db-prd`)

### Spring Profiles
- `default` - For local development (direct DB connection)
- `lambda` - For AWS Lambda execution environment

### CORS Configuration
- Dev environment: `dev.noe-room.com` + Amplify preview URLs
- Prd environment: `www.noe-room.com`

### Performance Considerations
- Configured with 1024MB/60 seconds to mitigate Lambda Cold Start
- Throughput optimized using R2DBC (asynchronous DB connection)
- Static file delivery via CloudFront CDN

### Frontend Development Guidelines
- **Always refer to `frontend/README.md` for frontend-related work**
- **For UI/design tasks, check the design guidelines in `frontend/docs/ui-design.md`**

