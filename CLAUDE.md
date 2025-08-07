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

**See `infrastructure/README.md` for detailed architecture**

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

### Connecting to Database

**See `tools/README.md` for connecting to the database**

### Infrastructure Operations

**See `infrastructure/README.md` for infrastructure-related details**

## Important Project Structure

### Backend (Kotlin/Spring Boot)
**See `backend/README.md` for detailed structure**

### Frontend (Next.js)
**See `frontend/README.md` for detailed structure**

### Infrastructure
**See `infrastructure/README.md` for detailed structure**

## Development Notes

### Database Connection
- Local: `localhost:5432/shirogane` (postgres/postgres)
- Dev/Prd: See `infrastructure/README.md` for RDS connection details

### Environment-specific Configuration
- **Backend**: See `backend/README.md` for Spring profiles and Lambda configuration
- **Frontend**: See `frontend/README.md` for environment variables and deployment settings
- **Infrastructure**: See `infrastructure/README.md` for AWS environment configurations

## Development Guidelines

### Backend Development
- **Always refer to `backend/README.md` for backend-related work**
- **For API endpoints, refer to the API section in `backend/README.md`**
- **For database tasks, check the database schema in `backend/docs/database-schema.md`**

### Frontend Development  
- **Always refer to `frontend/README.md` for frontend-related work**
- **For UI/design tasks, check the design guidelines in `frontend/docs/ui-design.md`**

