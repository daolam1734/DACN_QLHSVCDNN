# DA QLHSVC

Dự án Next.js với TypeScript, Tailwind CSS, Prisma ORM và PostgreSQL bao gồm Backend và Frontend.

## Cấu trúc dự án

- **Frontend**: React components trong `src/app`
- **Backend**: API Routes trong `src/app/api`
- **Database**: PostgreSQL với Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Cài đặt

```bash
npm install
```

## Cấu hình Database

1. Tạo database PostgreSQL với tên `da_qlhsvc`
2. Cập nhật file `.env` với thông tin kết nối của bạn
3. Chạy migration:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Xem chi tiết trong [PRISMA_SETUP.md](./PRISMA_SETUP.md)

## Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## API Routes

- `GET /api/hello` - API endpoint mẫu + kiểm tra kết nối DB
- `GET /api/users` - Lấy danh sách users
- `POST /api/users` - Tạo user mới

## Prisma Studio

Mở giao diện quản lý database:

```bash
npx prisma studio
```

## Build cho production

```bash
npm run build
npm start
```

## Công nghệ sử dụng

### Core
- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React](https://react.dev/) - UI library

### Backend & Database
- [Prisma](https://www.prisma.io/) - ORM for TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Relational database

### Authentication & Security
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing

### Form & Validation
- [React Hook Form](https://react-hook-form.com/) - Form management
- [Zod](https://zod.dev/) - Schema validation

### UI & Utilities
- [Lucide React](https://lucide.dev/) - Icon library
- [Axios](https://axios-http.com/) - HTTP client
- [date-fns](https://date-fns.org/) - Date utilities
- [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) - ClassName utilities
