
# DACN Copilot Instructions

## Big Picture Architecture
- **Monorepo structure**: All code (frontend, backend, database) is in a single Next.js project under `src/` and `prisma/`.
- **Frontend**: React components in `src/app` (pages, layouts, dashboard, login, etc.).
- **Backend**: API routes in `src/app/api` (RESTful endpoints for auth, users, dashboard, etc.).
- **Database**: PostgreSQL, schema managed via Prisma ORM (`prisma/schema.prisma`, migrations, seed scripts).
- **Styling**: Tailwind CSS throughout all React components.
- **Authentication**: Custom logic (not NextAuth), using JWT, bcryptjs, and must-change-password enforcement.

## Developer Workflows
- **Install dependencies**: `npm install`
- **Run dev server**: `npm run dev` (http://localhost:3000)
- **Build for production**: `npm run build` then `npm start`
- **Prisma workflows**:
	- Generate client: `npx prisma generate`
	- Validate schema: `npx prisma validate`
	- Open DB admin: `npx prisma studio`
	- Run migrations: Use provided SQL files in `prisma/` (see README for order)
- **Seed data**: Use scripts in `prisma/` (e.g. `seed.ts`, `seed-rbac.ts`)

## Project-Specific Conventions
- **Vietnamese content**: UI, docs, and comments are in Vietnamese for end-user clarity.
- **App Router**: All routing uses Next.js App Router (`src/app`).
- **API route structure**: Each resource (users, roles, dashboard, auth) has its own folder and route handler.
- **RBAC**: Role-based access control logic in `src/services/rbacService.ts` and related API routes.
- **Password change enforcement**: Login API returns `phai_doi_mat_khau` flag; frontend redirects to `/change-password` if required.
- **Validation**: Forms use React Hook Form + Zod for schema validation.
- **Icons**: Use Lucide React for all icons.
- **Config**: Menu and navigation config in `src/config/menuConfig.ts`.

## Integration Points & Cross-Component Patterns
- **Frontend/Backend communication**: Use Axios (`src/lib/axios.ts`) for API calls.
- **Prisma client**: Imported from `src/lib/prisma.ts` in all backend logic.
- **API response format**: Standardized via `src/lib/api-response.ts`.
- **JWT**: Token logic in `src/lib/jwt.ts`.
- **Middleware**: Auth and authorization logic in `src/middleware/auth.ts` and `src/middleware/authorize.ts`.

## Key Files & Directories
- `src/app/` - Main app pages and layouts
- `src/app/api/` - API route handlers
- `src/components/` - Reusable React components
- `src/services/` - Business logic (auth, dashboard, user, password, RBAC)
- `src/lib/` - Utilities (API, JWT, Prisma, validation)
- `prisma/` - Database schema, migrations, seed scripts
- `README.md` - Setup, migration, and workflow documentation

## Example Patterns
- **Login flow**: See `src/app/api/auth/login/route.ts` and `src/services/authService.ts` for backend; `src/app/login/page.tsx` and `src/components/LoginForm.tsx` for frontend.
- **Dashboard**: Modular API endpoints in `src/app/api/dashboard/admin/` and corresponding frontend in `src/app/dashboard/`.
- **RBAC**: Role logic in `src/services/rbacService.ts`, enforced in API routes and middleware.

## Notes
- All code, docs, and UI should follow Vietnamese conventions unless otherwise specified.
- Always validate Prisma schema after changes: `npx prisma validate`
- For new features, follow the folder and naming conventions above.
