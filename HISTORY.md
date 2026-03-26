# Session History — apnaMart Project

**Date:** 2026-03-24
**Session Goal:** Design and scaffold a full-stack book shopping cart application from scratch, push to GitHub, and configure for AWS ECS deployment.

---

## 1. Project Inception

**User request:**
> Create a new project named apnaMart. Java Spring Boot backend, React + Node.js frontend, PostgreSQL database, shopping cart for selling books. Push to GitHub, deploy to AWS ECS, auto-scalable, ~100 customers/day. Use best design principles.

---

## 2. Environment Discovery

Explored the macOS development environment and found:

| Tool | Status |
|---|---|
| Java / Maven | Not installed |
| Node.js / npm | Not installed |
| Docker | Not installed |
| GitHub CLI (`gh`) | Not installed |
| AWS CLI | Not installed |
| Git config | Not configured |

Only existing project in `~/code/` was an unrelated `uigen/` directory.

**Decision:** Generate all project files first; provide install instructions separately.

---

## 3. Architecture Design

### Key Decisions Made

| Decision | Rationale |
|---|---|
| **Modular Monolith** (not microservices) | YAGNI — 100 users/day doesn't justify the operational overhead of microservices |
| **Java 21** | Latest LTS; Project Loom virtual threads, record classes, sealed interfaces |
| **Spring Boot 3.3.5** | Supports Java 21, Spring Security 6 (lambda DSL), Spring Data JPA |
| **Flyway owns DB schema** | `ddl-auto: validate` — Hibernate only validates; migrations are version-controlled |
| **UUID v4 primary keys** | No sequential ID leakage; safe to expose in URLs |
| **NUMERIC(10,2) for money** | Avoids floating-point rounding errors — never use FLOAT for currency |
| **JSONB address snapshot on orders** | Address can change later; order must preserve what was used at purchase time |
| **JWT stateless auth** | Scales horizontally without a session store |
| **React Query + Zustand** | React Query for server state, Zustand for client/UI state — clean separation |
| **Nginx serves frontend** | Handles SPA routing, API proxy, gzip, and asset caching in production |
| **OIDC for CI/CD AWS auth** | No long-lived IAM keys stored in GitHub Secrets |
| **Layered JARs in Docker** | Only the `application/` layer changes on code edits — significantly faster pushes |
| **AWS Region: ap-south-1** | Mumbai — closest to India |

---

## 4. Files Created (118 total)

### Root Level
| File | Purpose |
|---|---|
| `.gitignore` | Excludes target/, node_modules/, .env, .idea/, .DS_Store |
| `.env.example` | Template for local environment variables (DB password, JWT secret, AWS IDs) |
| `docker-compose.yml` | Orchestrates postgres, backend, frontend with healthchecks |
| `docker-compose.override.yml` | Local dev overrides — hot-reload volumes for both services |
| `README.md` | Project overview, quick start, dev commands, API summary |
| `CLAUDE.md` | Guidance for future Claude Code sessions (architecture, commands, key decisions) |

### Backend (`backend/`)

**Configuration**
- `pom.xml` — Spring Boot 3.3.5 parent, Java 21, all dependencies (JJWT 0.12.6, MapStruct 1.6.2, Flyway, Lombok, H2 for tests). Critical: Lombok annotation processor must come before MapStruct in `maven-compiler-plugin`.
- `Dockerfile` — Multi-stage: `builder` (Maven build + layer extraction) → `development` → `production` (layered JARs via `JarLauncher`)
- `src/main/resources/application.yml` — Datasource (HikariCP pool=10), JPA validate, Flyway, JWT config, Actuator
- `src/main/resources/application-local.yml` — Debug SQL logging, devtools restart
- `src/main/resources/application-prod.yml` — Minimal logging for production

**Entry Point**
- `ApnaMartApplication.java`

**Config Layer**
- `config/SecurityConfig.java` — Spring Security 6 lambda DSL, JWT filter chain, public/protected routes, ADMIN role guard
- `config/JwtConfig.java` — `@ConfigurationProperties` binding for `jwt.*` properties
- `config/CorsConfig.java` — CORS for `localhost:*` and `*.apnamart.in`

**Common / Cross-cutting**
- `common/util/JwtUtil.java` — JJWT 0.12.x token generation and validation
- `common/response/ApiResponse.java` — Unified API envelope `{ success, data, error, timestamp }`
- `common/exception/ResourceNotFoundException.java`
- `common/exception/BusinessException.java` — With `HttpStatus` field
- `common/exception/GlobalExceptionHandler.java` — `@RestControllerAdvice` handling validation, not-found, bad-credentials, access-denied, unexpected errors

**Auth Module** (`auth/`)
- `filter/JwtAuthFilter.java` — `OncePerRequestFilter`, extracts Bearer token, populates `SecurityContextHolder`
- `dto/RegisterRequest.java`, `LoginRequest.java`, `AuthResponse.java`
- `service/AuthService.java` — Register (checks duplicate email, BCrypt encode), Login (delegates to `AuthenticationManager`)
- `controller/AuthController.java` — `POST /api/v1/auth/register`, `POST /api/v1/auth/login`

**User Module** (`user/`)
- `domain/User.java` — JPA entity implementing `UserDetails` (email as username, `ROLE_CUSTOMER`/`ROLE_ADMIN`)
- `domain/UserRole.java` — Enum: `CUSTOMER`, `ADMIN`
- `repository/UserRepository.java` — `findByEmail`, `existsByEmail`
- `service/UserService.java` — Implements `UserDetailsService` (Spring Security hook), profile update
- `mapper/UserMapper.java` — MapStruct entity→DTO
- `dto/UserDto.java`, `UpdateProfileRequest.java`
- `controller/UserController.java` — `GET/PUT /api/v1/users/me`

**Catalog Module** (`catalog/`)
- `domain/Book.java` — `price`/`mrp` as `BigDecimal`, `isActive` soft-delete, `stockQuantity` with check constraint
- `domain/Category.java` — `name` + `slug` unique
- `repository/BookRepository.java` — JPQL `findWithFilters` (categoryId, search LIKE, price range, inStock, pageable)
- `repository/CategoryRepository.java`
- `service/BookService.java` — Paginated list, findById (active only), findByIsbn, create, updateStock, soft-delete
- `service/CategoryService.java`
- `mapper/BookMapper.java`, `CategoryMapper.java` — MapStruct
- `dto/BookDto.java`, `CategoryDto.java`, `CreateBookRequest.java`
- `controller/BookController.java` — Public `GET /api/v1/books/**`, Admin `POST/PATCH/DELETE /api/v1/admin/books/**`
- `controller/CategoryController.java` — Public `GET /api/v1/categories/**`

**Cart Module** (`cart/`)
- `domain/Cart.java` — One-to-one with User, one-to-many CartItems (cascade ALL, orphanRemoval)
- `domain/CartItem.java` — Unique constraint on `(cart_id, book_id)`; `unitPrice` is snapshot at time of adding
- `repository/CartRepository.java` — `findByUserId`
- `repository/CartItemRepository.java` — `findByCartIdAndBookId`
- `service/CartService.java` — `getOrCreateCart`, addItem (stock check, upsert), updateItem, removeItem, clearCart
- `mapper/CartMapper.java` — Computes `subtotal` and `total` inline
- `dto/CartDto.java`, `CartItemDto.java`, `AddToCartRequest.java`
- `controller/CartController.java` — `GET/POST /api/v1/cart`, `PUT/DELETE /api/v1/cart/items/{id}`, `DELETE /api/v1/cart`

**Order Module** (`order/`)
- `domain/Order.java` — `shippingAddress` as `@JdbcTypeCode(SqlTypes.JSON)` JSONB map
- `domain/OrderItem.java` — Snapshot fields (`title`, `author`) copied from Book at order time
- `domain/OrderStatus.java` — Enum: `PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED / CANCELLED`
- `repository/OrderRepository.java` — `findByUserId` paginated
- `service/OrderService.java` — `placeOrder` (validates cart not empty, builds order items, clears cart on success), `findByUser`, `findById` (ownership check)
- `mapper/OrderMapper.java`
- `dto/OrderDto.java`, `OrderItemDto.java`, `PlaceOrderRequest.java`
- `controller/OrderController.java` — `POST /api/v1/orders`, `GET /api/v1/orders`, `GET /api/v1/orders/{id}`

**Database Migrations** (`src/main/resources/db/migration/`)
- `V1__init_schema.sql` — All tables (users, categories, books, carts, cart_items, orders, order_items), indexes (FTS GIN on books), `updated_at` trigger function and triggers
- `V2__seed_categories.sql` — 8 categories (Fiction, Non-Fiction, Technology, Self-Help, History, Children, Comics & Manga, Business)
- `V3__seed_books.sql` — 4 sample books (Clean Code, Pragmatic Programmer, Atomic Habits, The Alchemist)

**Tests**
- `ApnaMartApplicationTests.java` — Spring context load test (`@ActiveProfiles("test")`)
- `auth/AuthControllerTest.java` — `@SpringBootTest` + `MockMvc`: register happy path, invalid email → 400, bad credentials → 401
- `catalog/BookServiceTest.java` — Mockito unit tests: findById returns book, not-found throws, inactive book throws
- `src/test/resources/application-test.yml` — H2 in-memory DB, Flyway disabled

### Frontend (`frontend/`)

**Build & Config**
- `package.json` — React 18.3, React Router 6.27, Axios, Zustand 5, React Query 5, React Hook Form + Zod, Tailwind, Vitest
- `tsconfig.json` — Strict TypeScript, `@/*` path alias
- `vite.config.ts` — Dev proxy `/api → http://localhost:8080`, manual chunk splitting, Vitest config
- `tailwind.config.ts` — Custom `primary` amber color palette
- `postcss.config.js`
- `index.html`
- `Dockerfile` — Multi-stage: `deps → development → builder → production` (Nginx)
- `nginx.conf` — SPA routing (`try_files`), `/api/` proxy to backend, asset caching, security headers, gzip

**Source**
- `src/main.tsx` — React root, `QueryClientProvider` (5min staleTime, 1 retry)
- `src/App.tsx` — `BrowserRouter` with all routes, `PrivateRoute` wrapper using Zustand auth token
- `src/index.css` — Tailwind directives

**Types** (`src/types/`)
- `auth.types.ts` — `AuthResponse`, `LoginRequest`, `RegisterRequest`
- `book.types.ts` — `Book`, `Category`, `BookSearchParams`, `PageResponse<T>`
- `cart.types.ts` — `Cart`, `CartItem`
- `order.types.ts` — `Order`, `OrderItem`, `PlaceOrderRequest`

**API Layer** (`src/api/`)
- `client.ts` — Axios instance, JWT interceptor (from Zustand), global 401 handler (logout + redirect)
- `auth.api.ts` — `register`, `login`
- `books.api.ts` — `getBooks` (with params), `getBook`, `getCategories`
- `cart.api.ts` — `getCart`, `addItem`, `updateItem`, `removeItem`, `clearCart`
- `orders.api.ts` — `placeOrder`, `getOrders`, `getOrder`

**State** (`src/store/`)
- `auth.store.ts` — Zustand + `persist` middleware (localStorage `apnamart-auth`): `token`, `user`, `setAuth`, `logout`
- `ui.store.ts` — `isCartOpen`, `openCart`, `closeCart`, `toggleCart`

**Hooks** (`src/hooks/`)
- `useAuth.ts` — `useLogin`, `useRegister`, `useLogout` (mutations + navigation)
- `useBooks.ts` — `useBooks(params)`, `useBook(id)`, `useCategories` (staleTime: Infinity)
- `useCart.ts` — `useCart` (only when authenticated), `useAddToCart`, `useUpdateCartItem`, `useRemoveCartItem`
- `useOrders.ts` — `useOrders(page)`, `useOrder(id)`, `usePlaceOrder` (navigates to order detail on success)

**Components** (`src/components/`)
- `common/Navbar.tsx` — Logo, Books link, cart badge (item count), user dropdown (Orders, Profile, Logout), Login/Sign Up for guests
- `books/BookCard.tsx` — Cover image, title, author, price + MRP strikethrough, discount badge, Add to Cart button (redirects to login if unauthenticated)

**Pages** (`src/pages/`)
- `HomePage.tsx` — Hero banner, "New Arrivals" grid (8 books), skeleton loading
- `LoginPage.tsx` — Email/password form with Zod validation, error display
- `RegisterPage.tsx` — First/last name, email, password form
- `CatalogPage.tsx` — Category sidebar filter, search input, paginated book grid
- `BookDetailPage.tsx` — Cover, title, author, price/discount, description, metadata table, quantity selector, Add to Cart
- `CartPage.tsx` — Item list with quantity controls, remove, order summary panel, Proceed to Checkout
- `CheckoutPage.tsx` — Address form (line1, line2, city, state, 6-digit pincode), payment method (COD/ONLINE), order summary
- `OrdersPage.tsx` — Paginated order list with status badges (color-coded)
- `OrderDetailPage.tsx` — Items, totals, shipping address, payment info
- `ProfilePage.tsx` — Display user name, email, role

### Infrastructure (`infrastructure/`)
- `ecs/backend-task-def.json` — Fargate 512 CPU/1024 MB, port 8080, secrets from AWS Secrets Manager, CloudWatch logs, health check via `/actuator/health`
- `ecs/frontend-task-def.json` — Fargate 256 CPU/512 MB, port 80, CloudWatch logs
- `scripts/create-ecr-repos.sh` — Creates both ECR repos with image scanning enabled

### CI/CD (`.github/workflows/`)
- `ci.yml` — Runs on PRs to `main`/`develop`: Java 21 + `mvn -B verify`, Node 22 + type-check + lint + `npm test`
- `cd.yml` — Runs on push to `main`: OIDC AWS auth → ECR login → build+push both images (with registry-level build cache) → deploy both ECS services (waits for stability)

---

## 5. Git Commit

```
feat: initial scaffold for apnaMart book shopping cart

- Java 21 + Spring Boot 3.3.5 backend with modular clean architecture
- React 18 + TypeScript + Vite frontend with Tailwind CSS
- PostgreSQL via Flyway migrations (UUID PKs, JSONB address snapshot)
- JWT authentication with Spring Security 6
- Docker Compose for local dev (multi-stage layered Dockerfiles)
- GitHub Actions CI/CD → ECR → ECS Fargate with OIDC auth
- Domains: auth, user, catalog (books/categories), cart, order

118 files changed, 4966 insertions(+)
```

---

## 6. Pending: GitHub Push & AWS Setup

The initial commit exists locally. To complete the setup:

### Step 1 — Install tools (macOS)
```bash
brew install --cask temurin@21 docker
brew install maven node@22 git gh awscli
echo 'export PATH="/opt/homebrew/opt/node@22/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
# Open Docker Desktop from /Applications and complete setup
```

### Step 2 — Push to GitHub
```bash
gh auth login
git config --global user.name "Abhishek Dubey"
git config --global user.email "your@email.com"

cd /Users/abhishekdubey/code/apnaMart
gh repo create apnaMart --public --description "apnaMart - Book Shopping Cart" --source=. --remote=origin
git push -u origin main
```

### Step 3 — Start local dev
```bash
cp .env.example .env
docker compose up --build
# Frontend: http://localhost:3000
# API:      http://localhost:8080/api/v1
```

### Step 4 — AWS Setup (one-time)
```bash
aws configure   # Set access key, secret, region ap-south-1

# Create ECR repos
bash infrastructure/scripts/create-ecr-repos.sh

# Then manually (or via Console/CDK):
# - ECS cluster: apnamart-cluster
# - RDS PostgreSQL 16 (t3.micro)
# - Application Load Balancer with target groups for both services
# - AWS Secrets Manager entries: apnamart/db-url, db-username, db-password, jwt-secret
# - IAM role with OIDC trust for GitHub Actions (add as AWS_DEPLOY_ROLE_ARN secret)
# - ECS services: apnamart-backend-service, apnamart-frontend-service
```

### Step 5 — Auto-scaling (via Console after services are created)
```
Backend service:  min=1, max=4 tasks  |  scale-out: CPU > 70%  |  scale-in: CPU < 30%
Frontend service: min=1, max=2 tasks
```

---

## Summary

| Metric | Value |
|---|---|
| Total files created | 118 |
| Lines of code | ~4,966 |
| Backend Java files | 47 |
| Frontend TypeScript/TSX files | 30 |
| Config/infra files | 41 |
| Git commits | 1 |
| GitHub push | Pending (gh CLI not installed) |
