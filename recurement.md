# Executive Summary  
Building a production-grade car marketplace involves a robust back-end with NestJS/MySQL and an engaging 3D-rich frontend.  We propose a **modular NestJS architecture** with separate modules for users (buyers/sellers), listings, auth, payments, notifications, and admin tasks.  Data is persisted in MySQL with well-defined tables (users, car_listings, images/assets, payments, notifications, audit_logs, etc) and appropriate keys/indexes.  A **JWT-based auth system** handles authentication, with refresh tokens and role-based guards to restrict endpoints (buyer, seller, admin).  API endpoints follow REST conventions, returning JSON for listing creation/search, user actions, etc., and standard HTTP codes (200 OK, 201 Created, 400/401/403/404 on errors).  

On the frontend, we use **React/Next.js** combined with **Three.js (React Three Fiber)** to render a 3D hero scene featuring a black-and-red Ferrari.  We load a glTF model (optimized with Draco compression) into the scene.  Performance is ensured via lazy loading and low-poly LOD strategies, and accessibility by providing semantic fallbacks.  The CSS theme uses black (#000000) and Ferrari-red (#E10600) tokens with high contrast.  

For DevOps, CI/CD pipelines (GitHub Actions or similar) will build and deploy the NestJS app (with TypeORM migrations) and React frontend.  Backups (MySQL dumps or managed backups), monitoring (Prometheus/Grafana, Sentry), and security hardening are included.  We apply Helmet for HTTP headers, strict CORS, rate limiting (via `@nestjs/throttler`), and global `ValidationPipe` with `whitelist: true`/`forbidNonWhitelisted: true`.  Comprehensive tests (Jest unit tests, supertest integration/E2E) validate key flows (user login, listing lifecycle, payments).  Diagrams below illustrate the **system architecture** and **data model**.  

```mermaid
graph LR
    U[User (Buyer/Seller/Admin)] -->|Browses UI| FE[Front-end<br/>(React/Next + Three.js)]
    FE -->|REST API| API[NestJS API Server]
    subgraph Backend
      API --> DB[(MySQL Database)]
      API --> PaymentGateway[(Payment Gateway)]
      API --> Notification[(Email/Notification Service)]
      API --> AuditLogs[(Audit Log Store)]
    end
    AP[Admin Dashboard] --> API
```

```mermaid
classDiagram
    class User {
      +int id PK
      +string name
      +string email
      +string passwordHash
      +enum role { buyer, seller, admin }
      +datetime created_at
    }
    class Listing {
      +int id PK
      +int seller_id FK
      +string title
      +decimal price
      +string status  /* e.g. draft, published, sold, archived */
      +string model
      +string color
      +int year
      +text specs  /* JSON of specs: engine, power, etc. */
      +datetime created_at
      +datetime updated_at
    }
    class Image {
      +int id PK
      +int listing_id FK
      +string url
      +string type  /* 'photo' or 'model3D' */
    }
    class Notification {
      +int id PK
      +int user_id FK
      +string message
      +bool read_flag
      +datetime created_at
    }
    class AuditLog {
      +int id PK
      +int user_id FK
      +string action     /* e.g. 'CREATE_LISTING' */
      +string entity     /* e.g. 'listing' */
      +int entity_id
      +datetime timestamp
    }
    class Payment {
      +int id PK
      +int buyer_id FK
      +int listing_id FK
      +decimal amount
      +string status    /* e.g. pending, completed */
      +datetime created_at
    }
    User "1" -- "0..*" Listing : "owns >"
    Listing "1" -- "0..*" Image : "has >"
    User "1" -- "0..*" Notification : "receives >"
    User "1" -- "0..*" AuditLog : "performs >"
    User "1" -- "0..*" Payment : "purchases >"
    Listing "1" -- "0..*" Payment : "includes >"
```

## MySQL Schema (ER Diagram)  
- **Users table**: `id (PK, AUTO_INCREMENT)`, `name`, `email UNIQUE`, `password_hash`, `role ENUM('buyer','seller','admin')`, timestamps.  (`id` as primary key should be stable and auto-increment.)  
- **Listings table**: `id (PK)`, `seller_id (FK->User.id)`, `title`, `description`, `price` (DECIMAL), `status` (ENUM: draft/published/sold/archived), filters fields (`model`, `color`, `year`, `engine_specs JSON`), `created_at`, `updated_at`.  Indexes on `price`, `model`, `year`, and any TEXT fields with FULLTEXT if needed for keyword search.  
- **Images/Assets table**: `id (PK)`, `listing_id (FK)`, `url`, `type` (photo or 3D model).  Stores URLs or file paths (could use a CDN).  One listing can have many images/models.  
- **Payments table**: `id (PK)`, `buyer_id (FK->User.id)`, `listing_id (FK)`, `amount`, `currency`, `status` (pending/paid/failed), `provider_txn_id`, `created_at`.  Records each purchase transaction.  
- **Notifications table**: `id (PK)`, `user_id (FK)`, `content`, `type` (email/sms/in-app), `read_flag`, `created_at`.  Used for order/status notifications.  
- **AuditLogs table**: `id (PK)`, `user_id (FK)`, `action`, `entity`, `entity_id`, `details JSON`, `timestamp`.  Every administrative or CRUD action is logged here for auditing.  
- **(Analytics)**: No separate table needed upfront; use DB queries or a data warehouse for metrics (e.g. PostgreSQL views or a BI tool).  

All `PRIMARY KEY` fields are `NOT NULL` and auto-increment integers by default.  Foreign key constraints enforce referential integrity (`FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE`, etc.).  Suitable indexes should be added on columns used in JOINs and WHERE clauses (e.g. `seller_id`, `status`, and text search columns).  This relational design supports listing lifecycles (create/edit/publish/sell/archive) via the `status` field and easily allows range queries on `price` or filtering by `color`, `model`, etc.  

## NestJS Modules & Controllers  
- **Module structure**: We split functionality into logical NestJS modules:  
  - `AuthModule`: handles registration, login, JWT generation, refresh tokens.  
  - `UsersModule`: user profiles, account management.  
  - `ListingsModule`: create/edit/delete/search car listings.  
  - `ImagesModule`: upload/manage listing images and 3D assets.  
  - `PaymentsModule`: initiate and confirm payments.  
  - `NotificationsModule`: send emails or push notifications.  
  - `AdminModule`: admin-only functions (user/listing management, analytics).  
  - `AppModule` imports all the above.  

- **Controllers & DTOs**: Each module has a controller exposing REST routes, and services for business logic.  Example DTOs use `class-validator`:  
  ```ts
  // create-listing.dto.ts
  export class CreateListingDto {
    @IsString() title: string;
    @IsNumber() price: number;
    @IsString() model: string;
    @IsString() color: string;
    @IsInt() year: number;
    @IsOptional() @IsString() description?: string;
    @IsOptional() specs?: Record<string, any>;
  }
  ```  
  Validation pipes are enabled globally (whitelisting and forbidding extra fields) to enforce schema correctness.  Controllers use `@Body()`, `@Param()`, `@Query()` with appropriate DTOs and pipes.  For example:  
  ```ts
  @Controller('listings')
  export class ListingsController {
    constructor(private readonly listingService: ListingService) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Seller)
    create(@Body() dto: CreateListingDto) { 
      return this.listingService.create(dto, request.user.id); 
    }
  
    @Get()
    findAll(@Query() filters: ListingFilterDto) {
      return this.listingService.search(filters);
    }
  
    @Get(':id')
    findOne(@Param('id') id: number) {
      return this.listingService.findById(id);
    }
  
    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Seller)
    update(@Param('id') id: number, @Body() dto: UpdateListingDto) {
      return this.listingService.update(id, dto);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Seller)
    remove(@Param('id') id: number) {
      return this.listingService.remove(id);
    }
  }
  ```  
  Each method returns JSON, and uses appropriate status codes (e.g. `201 Created` for new listings).  Errors (validation failures or unauthorized) automatically produce `400 Bad Request` or `401/403 Forbidden`.  We follow NestJS conventions for modules and use `ValidationPipe` (with `class-validator`) as documented.

## REST API Endpoints  
We adopt REST conventions. Key endpoints include: 

- **Auth**:  
  - `POST /auth/register` â€“ Create a new user. *Request:* `{ "name": "...", "email": "...", "password": "..." }` â†’ *Response:* `201 Created` with `{ "id": 123, "name": "...", "email": "..." }` (no password returned).  
  - `POST /auth/login` â€“ User login. *Request:* `{ "email": "...", "password": "..." }` â†’ *Response:* `200 OK` with `{ "accessToken": "...", "refreshToken": "..." }`.  
    - Example error: `401 Unauthorized` if credentials invalid.  
  - `POST /auth/refresh` â€“ Refresh JWT. *Request:* `{ "refreshToken": "..." }` â†’ *Response:* new JWT tokens. (We will use short-lived access tokens + refresh tokens strategy.)  

- **Users**:  
  - `GET /users/:id` â€“ Get user profile (admin or self). *Response:* `{ "id": 123, "name": "...", "email": "...", "role": "seller", ... }`.  
  - `PUT /users/:id` â€“ Update profile. Only the user or admin can do this.  
  - (Admin only) `GET /admin/users` â€“ List all users (paginated).  
  - (Admin) `PUT /admin/users/:id/role` â€“ Change a userâ€™s role.  

- **Listings**:  
  - `GET /listings` â€“ Search listings with query filters: `?model=Camaro&color=Black&minPrice=50000&maxPrice=100000`. *Response:* `200 OK` with `{ "data": [ /* array of listing objects */ ], "total": 123 }`.  
  - `GET /listings/:id` â€“ Get details of one listing. *Response:* `{ "id":1,"title":"Ferrari 488","price":200000,... }` or `404 Not Found` if missing.  
  - `POST /listings` â€“ Create new listing (seller only). *Request:* JSON with title, price, etc. *Response:* `201 Created` with the listing object.  
  - `PUT /listings/:id` â€“ Edit listing (owner or admin only). *Response:* `200 OK` with updated object. Error codes: `403 Forbidden` if not owner (e.g. `{statusCode:403,"message":"Forbidden resource"}`).  
  - `DELETE /listings/:id` â€“ Archive or delete listing (seller or admin). *Response:* `204 No Content`.  

- **Images/Assets**:  
  - `POST /listings/:id/images` â€“ Upload image/3D model for a listing. (Multipart or base64; here we just handle URL references.) Returns `201 Created`.  
  - `GET /listings/:id/images` â€“ List all images/3D assets for a listing.  

- **Payments**:  
  - `POST /payments` â€“ Initiate purchase (buyer only). *Request:* `{ "listingId": 5 }`. *Response:* e.g. `302 Redirect` to payment provider or `200 OK` with payment session info.  
  - `POST /payments/confirm` â€“ Webhook/callback when payment is done, or `GET /payments/:id/status` to poll.  

- **Notifications**: (internal) â€“ triggered by events; not exposed as public API except maybe for testing.  

- **Admin**:  
  - All `GET /admin/*` endpoints are protected by `@Roles(Role.Admin)`.  Examples:  
  - `GET /admin/analytics` â€“ Return aggregated metrics (total listings, sales, users, etc).  
  - `GET /admin/audit-logs` â€“ Paginated audit entries.  

Each endpoint returns JSON.  Errors use standard codes:  
`400 Bad Request` for invalid input, `401 Unauthorized` for no/invalid token, `403 Forbidden` for insufficient role, `404 Not Found` when entity missing, etc.  For example, a forbidden action yields:  

```
HTTP/1.1 403 Forbidden
{ "statusCode": 403, "error": "Forbidden", "message": "Forbidden resource" }
```  

*(Example adapted from NestJS Auth0 tutorial.)*  

## Authentication & Authorization  
We use **JWTs** (with Passport JWT strategy). On login, issue an access token (short-lived, e.g. 15min) and a refresh token (longer-lived).  Access tokens carry user ID and roles in their payload.  We store refresh tokens hashed in the DB or use stateless JWT refresh if needed.  

NestJS Guards enforce auth:  
- **JWT Guard** (`@UseGuards(AuthGuard('jwt'))`) validates tokens on protected routes.  
- **RolesGuard** checks the userâ€™s roles.  For example, a `@Roles(Role.Admin)` decorator (using `SetMetadata`) can specify required roles, and the `RolesGuard` compares `user.roles` to that metadata.  
- For fine-grained permissions, one could use a `PermissionsGuard` as in Auth0â€™s example: it attaches `@Permissions('create:items')` metadata and the guard uses `reflector.get('permissions')` versus `user.permissions` claim.  

For our use-case, roles (`buyer`, `seller`, `admin`) are usually sufficient.  Example snippet from NestJS docs:  
```ts
export enum Role { Buyer='buyer', Seller='seller', Admin='admin' }
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
// In RolesGuard: compare route roles with `request.user.roles`.
```  

The admin user has a separate account and uses the admin dashboard. All admin endpoints are behind an Admin guard (RBAC).  Refresh tokens are rotated on use to avoid reuse.  Weâ€™ll also implement logout/invalidate endpoints and store token revocation if needed.  

## Admin Dashboard & Endpoints  
The admin panel (a React/Next.js app or even AdminJS) interfaces with Admin-specific APIs:  
- **User management** (`GET/PUT/DELETE /admin/users`), e.g. changing roles or deactivating.  
- **Listing management** (`GET /admin/listings`, `DELETE /admin/listings/:id`) to remove inappropriate content.  
- **Audit logs** (`GET /admin/audit-logs`): Admins can view logs of user/listing actions.  
- **Analytics endpoints** (`GET /admin/analytics`): e.g. returns data for total active listings, sales volume over time, daily signups, etc. The frontend dashboard can display charts.  

Admin APIs also return JSON.  The **data model** for admin is the same tables, but with broader query filters (no owner restriction).  For example, an admin can query all listings regardless of status:  
```json
GET /admin/listings?status=published
Response: {
  "data": [ { "id": 5, "title": "Ferrari 488", ... }, ... ],
  "total": 42
}
```  
All admin routes use role-based guards (`@Roles('admin')`) so only users with the Admin role can access them.  Actions performed by admins (like deleting a listing) should also be recorded in the **AuditLog** table for accountability.  

## 3D Frontend Design (Black-Red Ferrari)  
- **Tech Stack**: We recommend **Next.js** (for React SSR/SSG) combined with **React Three Fiber** (a React renderer for Three.js) to manage the 3D scene.  This allows us to treat Three.js components as React components.  
- **3D Asset Pipeline**: Use a high-quality Ferrari model (black body, red racing stripes). Export it to **glTF** format (modern standard). Compress geometry with **Draco compression** and textures with **KTX2/ETC2** or WebP to reduce size. Store assets on a CDN or optimized storage (S3, Cloudflare) for fast delivery. Use Reactâ€™s `<Suspense>` and lazy-loading to fetch the model only when the user scrolls to it, avoiding blocking initial load.  
- **Scene Setup**: Place the Ferrari model in a simple 3D showroom (e.g., a floor with environment lighting). Use one or two **HDRI environment maps** (low-res) for realistic reflections. Consider `meshopt` or `basisU` compressed textures if very large. Precompute Lightmaps if static.  
- **Performance**: Limit polygons (<= 100k faces ideally for web), batch draw calls, and consider LOD (load a simpler model first). Use `requestIdleCallback` to load after critical rendering. Use `Renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`. Render the 3D canvas within a fixed-size container with `pointerEvents: none` until user interaction to not block UI. Use `IntersectionObserver` to pause animation when offscreen.  
- **Accessibility**: Provide ARIA labels or caption for the 3D canvas: e.g. a `<div role="img" aria-label="3D model of a black Ferrari car on a red background">` surrounding the canvas. Ensure keyboard users can navigate to other content (the 3D model should not trap focus). If WebGL fails, show a static fallback image or message.  
- **CSS Theme Tokens** (Black & Red): We use CSS custom properties for consistency. Example:  
  ```css
  :root {
    --color-primary: #E10600;  /* Ferrari red */
    --color-secondary: #000000; /* pure black */
    --color-background: #1a1a1a;
    --color-text: #ffffff;
    --font-sans: 'Inter', sans-serif;
    --font-mono: 'Roboto Mono', monospace;
  }
  .btn-primary { background-color: var(--color-primary); color: var(--color-text); }
  .hero-bg { background: var(--color-secondary); }
  ```
  These tokens ensure all red accents (buttons, links) are consistent (#E10600 for the bright red) and backgrounds/text use a dark/light contrast.  Use a `prefers-color-scheme` media query to adjust if a dark UI mode is desired.  

(For reference on using React Three Fiber to build a car show, see a developerâ€™s experience: â€œintegrating additional features and managing the scaling aspect, which required uploading multiple heavy modelsâ€.)

## DevOps & Security  
- **CI/CD**: Use pipelines (e.g. GitHub Actions or GitLab CI) to run tests, build Docker images, and deploy. For example, a GitHub Action can `npm run test && npm run build` then deploy to AWS ECS or similar. Include database migrations in the pipeline (`typeorm migration:run`).  
- **Database Migrations**: Use **TypeORMâ€™s migration CLI** or a tool like **Umzug**. Ensure every schema change is version-controlled. Automate running migrations on deploy (or use â€œblue/greenâ€ DB deployments).  
- **Backups**: Schedule regular MySQL dumps or use managed DB snapshots (e.g. AWS RDS snapshots daily). Keep logs of backups and test restore procedures.  
- **Monitoring**: Integrate application monitoring (Prometheus exporters or DataDog). Use NestJS middleware or interceptors to log metrics (e.g. request count, latency). For errors, use Sentry or a similar APM. For DB, monitor slow query logs and connection pool usage.  
- **Security Hardening**:  
  - **HTTP Headers**: Apply `helmet()` middleware (built into NestJS) to set headers like HSTS, X-Content-Type-Options, etc.  Start with defaults, enabling CSP once front-end is finalized.  
  - **CORS**: Enable CORS only for known origins (e.g. `https://yoursite.com`, `https://admin.yoursite.com`) with credentials allowed for cookies. Do *not* use `*` if tokens/cookies are in play.  
  - **Validation/Sanitization**: Use Nestâ€™s `ValidationPipe` globally with `whitelist:true` and `forbidNonWhitelisted:true` to strip/ban unknown fields.  This prevents mass-assignment attacks and ensures payloads match DTOs.  
  - **Rate Limiting**: Implement a rate limiter (e.g. NestJS **ThrottlerModule**) globally.  As a baseline, throttle to e.g. 100 requests/minute per IP.  Tighter limits on abuse-prone routes (e.g. `POST /auth/login` could allow only 5 attempts/minute).  
  - **Transport Security**: Enforce HTTPS (redirect HTTP to HTTPS) and set HSTS header.  
  - **Password Storage**: Hash passwords with bcrypt (salted). Email and other sensitive data should be validated.  
  - **Auth Tokens**: Store refresh tokens securely (e.g. HttpOnly cookies) and revoke on logout.  
  - **Logging**: Use structured logging (e.g. Winston) and avoid leaking secrets in error messages.   
- **Security Headers Table** (example defaults):  

  | Header                 | Value                                                                 |
  |------------------------|-----------------------------------------------------------------------|
  | `Content-Security-Policy` | `default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'` |
  | `X-Content-Type-Options`  | `nosniff`                                                          |
  | `X-Frame-Options`         | `DENY`                                                             |
  | `Referrer-Policy`         | `no-referrer`                                                      |
  | `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload`                   |  
  | `X-XSS-Protection` (deprecated) | `0` (modern browsers ignore, default CSP handles XSS)         |

  These can be configured via Helmet in NestJS.  

- **Rate Limit Example**: Using `@nestjs/throttler`:  
  ```ts
  ThrottlerModule.forRoot({ ttl: 60, limit: 100 }),
  ```  
  And on auth routes:  
  ```ts
  @Throttle(5, 60) // max 5 requests/minute
  @Post('login') login(...) { ... }
  ```  

## Testing Strategy  
We adopt **Jest** (default for NestJS) for all tests.  Plans:  
- **Unit tests** (mocked): Test individual services/controllers.  Use `@nestjs/testing` to create a testing module. Example: testing `ListingService.findAll()`. Mock the repository or related service.  
- **Integration tests**: Test multiple modules together (e.g. ListingsController + ListingsService + real DB). Use an in-memory or test MySQL. Use `TestingModule` with real TypeORM connection to a sqlite/MySQL test database.  
- **End-to-End (E2E) tests**: Use `@nestjs/testing` and **supertest**. Boot up the Nest application (`app.init()`), then perform HTTP calls. Example test case (simplified):  

  ```ts
  describe('Auth (e2e)', () => {
    let app: INestApplication;
    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AuthModule, UsersModule],
      }).compile();
      app = moduleRef.createNestApplication();
      await app.init();
    });
    it('/POST auth/register -> 201', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({name: 'Alice', email: 'a@x.com', password: 'Secret123' })
        .expect(201)
        .expect(res => expect(res.body.email).toBe('a@x.com'));
    });
  });
  ```  
  (This pattern is shown in NestJS docs.)  

- **Sample test cases**:  
  1. **Auth**: register, login with correct/wrong password (`200 OK` vs `401 Unauthorized`).  
  2. **Listing**: a seller creates a listing, then buyer searches for it by filter (check it appears). Test edit by non-owner -> expect `403`.  
  3. **Payments**: mock a payment provider response and ensure a purchase updates status.  
  4. **Admin**: test accessing `/admin/users` as non-admin returns `403`, and as admin returns user list.  
  5. **Validation**: sending invalid payload (e.g. missing required field) yields `400`.  

Using Jest snapshots can validate JSON schemas.  Code coverage should cover all critical logic (guards, pipes, services).

## Alternative Tools & Libraries  

| Category         | Option               | Pros / Cons                                          |
|------------------|----------------------|------------------------------------------------------|
| **ORM/Database** | **TypeORM**          | Native Nest support, Active Record/Mapper. Good for simple CRUD. <br/>*Drawback:* older migrations (some noted ALTER DROP/CREATE behavior).<br/>**Prisma**: Type-safe, schema-driven, great migrations, but another tool. <br/>**Sequelize**: Mature, supports MySQL, but less TypeScript-friendly. <br/>**MikroORM**: EF-like, good TS, but smaller community. |
| **3D Engine**    | **Three.js**         | Industry-standard JS 3D library (used via React Three Fiber). Highly flexible. <br/>**Babylon.js**: Also JS 3D, comes with editor, physics out-of-box. Good TS support. <br/>**Unity WebGL**: Rich engine, but heavy and not ideal for dynamic web UI. |
| **Auth**         | **Passport JWT**     | Simple JWT strategy (used here). <br/>**OAuth2 Providers** (Auth0, Okta): offload security but add complexity and cost. <br/>**Supabase** or **Firebase Auth**: full user system, but locks you into their stack. |
| **Admin UI**     | **React Admin/AdminJS** | Quickly scaffolds CRUD admin UI from APIs. <br/>**Custom**: Full control but more work. Many teams use **AdminJS** (formerly AdminBro) with NestJS. |
| **Testing**      | **Jest**             | Default for Nest, rich features. <br/>**Mocha/Chai**: Alternative, but Jest has built-in runner. <br/>**Cypress**: For real browser E2E tests (can test front-end interactions with API). |
| **CI/CD**        | **GitHub Actions**   | Native for GitHub, easy YAML setup. <br/>**GitLab CI/Jenkins**: More config but powerful pipelines. |
| **Monitoring**   | **Prometheus/Grafana** | Full control of metrics/alerts. <br/>**Datadog/NewRelic**: Paid, easy integration. |
  
Most NestJS examples use TypeORM (as we do here), but Prisma is gaining popularity for its type-safe client and robust migrations. For 3D, Three.js (with React Three Fiber) is the de facto choice for custom scenes.  

## Conclusion  
This design outlines a **scalable, secure marketplace**. The NestJS back end is organized into clear modules with validated DTOs and comprehensive RBAC guards. The MySQL schema supports all required entities (listings, users, payments, etc.) with integrity constraints. The React/Three.js frontend delivers an immersive Ferrari showcase, optimized for performance. DevOps best practices (CI/CD, migrations, monitoring) and security defaults (Helmet, CORS, rate-limiting, strict validation) ensure reliability. Extensive unit and e2e tests (per NestJS guidelines) will verify functionality. Together, this solution meets the requirements of a broker-style car marketplace with admin oversight and rich 3D presentation.  

**Sources:** Official NestJS docs and tutorials for architecture, guards, and validation; Auth0 blog on JWT and RBAC; database best practices; and React Three Fiber community examples.
