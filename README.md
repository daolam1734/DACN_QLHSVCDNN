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

1. Tạo database PostgreSQL với tên `QuanLyHoSoVienChuc_TVU`
2. Cập nhật file `.env` với thông tin kết nối của bạn
3. Chạy migration theo thứ tự:

```bash
# Phase 1: Lookup tables (Chức vụ, Loại đơn vị, Quốc gia, Nguồn kinh phí, Hình thức đi)
psql -U postgres -d QuanLyHoSoVienChuc_TVU -f prisma/migration-phase1-lookup-tables.sql

# Phase 2: Enhance data (Cập nhật bảng, Người đi cùng, Quy trình duyệt, Deadline)
psql -U postgres -d QuanLyHoSoVienChuc_TVU -f prisma/migration-phase2-enhance-data.sql

# Phase 3: Features (Thông báo, Template văn bản, Cấu hình hệ thống)
psql -U postgres -d QuanLyHoSoVienChuc_TVU -f prisma/migration-phase3-features.sql

# Sau khi chạy migration, cập nhật Prisma schema
npx prisma db pull
npx prisma generate
```

Xem chi tiết phân tích và thiết kế trong:
- [PHAN_TICH_VA_GIAI_PHAP.md](./prisma/PHAN_TICH_VA_GIAI_PHAP.md) - Phân tích chi tiết và giải pháp SQL
- [PRISMA_SETUP.md](./PRISMA_SETUP.md) - Hướng dẫn setup Prisma

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
