# apnaMart — Book Shopping Cart

A full-stack book shopping cart application built with Java 21 + Spring Boot (backend), React 18 + TypeScript (frontend), and PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.3.5, Spring Security 6, Spring Data JPA, Flyway |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Query, Zustand |
| Database | PostgreSQL 16 |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions → Amazon ECR → Amazon ECS Fargate |

## Quick Start (Local Development)

### Prerequisites
```bash
brew install --cask temurin@21 docker
brew install maven node@22 git gh awscli
echo 'export PATH="/opt/homebrew/opt/node@22/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
```

### Run with Docker Compose
```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/v1
- Health check: http://localhost:8080/actuator/health

### Run Services Locally (hot-reload)
```bash
# Terminal 1 — start only the database
docker compose up postgres

# Terminal 2 — Spring Boot with local profile
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=local

# Terminal 3 — Vite dev server (proxies /api → localhost:8080)
cd frontend && npm install && npm run dev
```

Frontend dev server: http://localhost:5173

## Development Commands

### Backend
```bash
cd backend
mvn -B verify              # Build + run all tests
mvn spring-boot:run -Dspring-boot.run.profiles=local  # Start server
mvn test                   # Run tests only
mvn test -Dtest=BookServiceTest  # Run single test class
```

### Frontend
```bash
cd frontend
npm install                # Install dependencies
npm run dev                # Start Vite dev server
npm run build              # Production build
npm run lint               # ESLint
npm test                   # Vitest
```

## API Overview

Base URL: `/api/v1`

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, get JWT |
| GET | `/books` | List books (paginated, filterable) |
| GET | `/books/{id}` | Book detail |
| GET/POST | `/cart` | View / add to cart |
| POST | `/orders` | Place order |

Full API documented in [backend/src/main/resources/api-reference.md](backend/src/main/resources/api-reference.md).

## Deployment (AWS ECS Fargate)

See [infrastructure/README.md](infrastructure/README.md) for:
- ECR repository setup
- ECS cluster / service creation
- RDS PostgreSQL provisioning
- GitHub Actions OIDC role configuration
- Secrets Manager setup

On merge to `main`, GitHub Actions automatically:
1. Runs tests (backend + frontend)
2. Builds Docker images and pushes to ECR
3. Updates ECS task definitions and deploys to Fargate

## Project Structure

```
apnaMart/
├── backend/        Java 21 Spring Boot service
├── frontend/       React 18 + TypeScript + Vite
├── infrastructure/ ECS task definitions, deployment scripts
└── .github/        CI/CD workflows
```
