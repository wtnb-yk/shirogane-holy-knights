# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Principles
- **Logging**: Keep logging to a minimum - only essential information for debugging and monitoring
- **Comments**: Minimize code comments - write self-documenting code with clear naming and structure
- **Clean Code**: Prioritize readable, maintainable code that doesn't require extensive explanation

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

**See `backend/README.md` for backend-related details**

### Frontend Development

**See `frontend/README.md` for frontend-related details**

### Quick Start

```bash
# Start all services (Frontend + Backend + DB)
docker-compose up -d

# Start backend only (http://localhost:8080)
docker compose up -d --build backend

# Start frontend only (http://localhost:3001)
docker compose up -d --build frontend
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
**See `backend/README.md` for detailed structure**

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

### Environment-specific Configuration
- **Backend**: See `backend/README.md` for Spring profiles and Lambda configuration
- **Frontend**: See `frontend/README.md` for environment variables and deployment settings

### Performance Considerations
- Lambda: Configured with 1024MB/60 seconds to mitigate Cold Start
- Backend: R2DBC for asynchronous DB connection
- Frontend: SWR for optimistic UI updates and caching
- Static files: CloudFront CDN for global distribution

## Development Guidelines

### Backend Development
- **Always refer to `backend/README.md` for backend-related work**
- **For API endpoints, refer to the API section in `backend/README.md`**
- **For database tasks, check the database schema in `backend/docs/database-schema.md`**

### Frontend Development  
- **Always refer to `frontend/README.md` for frontend-related work**
- **For UI/design tasks, check the design guidelines in `frontend/docs/ui-design.md`**

