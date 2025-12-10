# Prisma & PostgreSQL Setup

## Cấu hình Database

### 1. Cài đặt PostgreSQL
Đảm bảo PostgreSQL đã được cài đặt và đang chạy trên máy của bạn.

### 2. Tạo Database
Tạo database mới với tên `da_qlhsvc`:

```sql
CREATE DATABASE da_qlhsvc;
```

### 3. Cấu hình Connection String
Cập nhật file `.env` với thông tin kết nối PostgreSQL của bạn:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Ví dụ:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/da_qlhsvc?schema=public"
```

### 4. Chạy Migration
Tạo và áp dụng migration để tạo bảng trong database:

```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma Client
Generate Prisma Client để sử dụng trong code:

```bash
npx prisma generate
```

## Prisma Commands

### Development
- `npx prisma migrate dev` - Tạo và áp dụng migration
- `npx prisma generate` - Generate Prisma Client
- `npx prisma studio` - Mở Prisma Studio để quản lý data
- `npx prisma db push` - Push schema changes (không tạo migration)

### Production
- `npx prisma migrate deploy` - Áp dụng migrations
- `npx prisma generate` - Generate client

### Database Management
- `npx prisma db pull` - Pull schema từ database
- `npx prisma db seed` - Chạy seed data
- `npx prisma format` - Format schema file

## API Endpoints

### Users API
- `GET /api/users` - Lấy danh sách users
- `POST /api/users` - Tạo user mới
  ```json
  {
    "email": "user@example.com",
    "name": "User Name"
  }
  ```

### Test Connection
- `GET /api/hello` - Kiểm tra kết nối database

## Schema Example

File `prisma/schema.prisma` đã được cấu hình với model User mẫu. Bạn có thể thêm các models khác theo nhu cầu:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Prisma Client Usage

Prisma Client được khởi tạo tại `src/lib/prisma.ts` và có thể import vào bất kỳ đâu:

```typescript
import { prisma } from '@/lib/prisma';

// Example queries
const users = await prisma.user.findMany();
const user = await prisma.user.create({
  data: { email: 'test@example.com', name: 'Test User' }
});
```

## Troubleshooting

### Connection Issues
- Kiểm tra PostgreSQL đã chạy
- Xác nhận DATABASE_URL trong .env đúng
- Kiểm tra firewall/port 5432

### Migration Issues
- Reset database: `npx prisma migrate reset`
- Xóa folder `prisma/migrations` và chạy lại

### Generate Issues
- Xóa `node_modules/.prisma` và chạy `npx prisma generate`
