# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**apnaMart** is a book shopping cart application. Mono-repo with a Java Spring Boot backend and a React + TypeScript frontend, backed by PostgreSQL, deployed to AWS ECS Fargate.

## Tech Stack

- **Backend**: Java 21, Spring Boot 3.3.5, Spring Security 6 (JWT), Spring Data JPA, Flyway, MapStruct, Lombok
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Query (server state), Zustand (client state)
- **Database**: PostgreSQL 16
- **Infrastructure**: Docker Compose (local), AWS ECS Fargate + ECR + RDS + ALB

## Development Commands

### Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local   # Start server (requires postgres running)
mvn -B verify                                           # Build + run all tests
mvn test -Dtest=BookServiceTest                         # Run single test class
mvn -B package -DskipTests                              # Build JAR only
```

### Frontend
```bash
cd frontend
npm install          # First time setup
npm run dev          # Vite dev server on :5173 (proxies /api → localhost:8080)
npm run build        # Production build to dist/
npm run lint         # ESLint
npm test             # Vitest (run once)
npm run type-check   # tsc --noEmit
```

### Local Dev (recommended)
```bash
# Terminal 1: database only
docker compose up postgres

# Terminal 2: backend with hot-reload
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=local

# Terminal 3: frontend with Vite HMR
cd frontend && npm run dev
```

### Full Docker Compose
```bash
cp .env.example .env
docker compose up --build    # All three services (postgres, backend, frontend)
# Frontend: http://localhost:3000
# API:      http://localhost:8080/api/v1
# Health:   http://localhost:8080/actuator/health
```

## Architecture

### Backend Module Structure
Each domain follows a consistent vertical slice layout:
```
{module}/
  controller/   — REST controllers, request/response mapping
  domain/       — JPA entities
  dto/          — Request/response DTOs
  mapper/       — MapStruct interfaces (never hand-write these)
  repository/   — Spring Data JPA interfaces
  service/      — Business logic (only layer that calls repositories)
```

Modules: `auth`, `user`, `catalog` (books + categories), `cart`, `order`

Cross-cutting: `common/exception/`, `common/response/ApiResponse`, `common/util/JwtUtil`, `config/`

### Security Flow
`JwtAuthFilter` (`auth/filter/`) intercepts every request, extracts the Bearer token, validates it via `JwtUtil`, and populates `SecurityContextHolder`. `SecurityConfig` defines which routes are public. `UserService` implements `UserDetailsService` — Spring Security calls `loadUserByUsername(email)` to resolve the authenticated user.

### Frontend State Management
- **React Query** (`@tanstack/react-query`): all server state — books, cart, orders, user profile. Use `useQuery`/`useMutation` hooks in `src/hooks/`.
- **Zustand**: client-only state — auth token (persisted to localStorage), cart drawer open/closed. Never put server data in Zustand.

The `api/client.ts` Axios instance auto-attaches the JWT from Zustand on every request and handles global 401 (clears auth + redirects to login).

### Database
- Schema owned by **Flyway** — Hibernate is set to `ddl-auto: validate`
- All primary keys are `UUID v4`
- All monetary values use `NUMERIC(10,2)` — never `FLOAT`
- `orders.shipping_address` is `JSONB` — a snapshot of the address at order time, so it's immutable even if the user later changes their address

### API Base URL
All endpoints are under `/api/v1`. Public: `GET /books/**`, `GET /categories/**`, `POST /auth/**`. Everything else requires a JWT Bearer token.

## Deployment

On push to `main`, GitHub Actions (`.github/workflows/cd.yml`):
1. Authenticates to AWS via OIDC (no static keys — requires `AWS_DEPLOY_ROLE_ARN` secret)
2. Builds multi-stage Docker images and pushes to ECR
3. Updates ECS task definitions and deploys to `apnamart-cluster`

AWS Region: `ap-south-1` (Mumbai)

Required GitHub Secrets: `AWS_ACCOUNT_ID`, `AWS_DEPLOY_ROLE_ARN`

### Before first deployment
```bash
# Configure AWS CLI, then:
bash infrastructure/scripts/create-ecr-repos.sh
# Then create ECS cluster, RDS, ALB, and Secrets Manager entries manually
```

## Key Design Decisions

| Decision | Reason |
|---|---|
| Modular monolith (not microservices) | 100 users/day doesn't justify microservices overhead |
| Flyway owns schema | Version-controlled, repeatable migrations; Hibernate only validates |
| JSONB for order address | Address can change later; order snapshot must be immutable |
| OIDC for CI/CD AWS auth | No long-lived credentials stored in GitHub Secrets |
| Layered JARs in Docker | Only the `application/` layer changes on code edits — faster pushes |
| React Query + Zustand | Clean separation: server state vs UI/auth state |
