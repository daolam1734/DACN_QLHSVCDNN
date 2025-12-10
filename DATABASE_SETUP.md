# Hướng dẫn tạo Database PostgreSQL

## Cách 1: Sử dụng pgAdmin hoặc psql command line

### Bước 1: Kết nối PostgreSQL
```bash
psql -U postgres
```

### Bước 2: Tạo database
```sql
CREATE DATABASE da_qlhsvc
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Vietnamese_Vietnam.1258'
    LC_CTYPE = 'Vietnamese_Vietnam.1258'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

### Bước 3: Kết nối vào database mới
```bash
\c da_qlhsvc
```

### Bước 4: Enable extensions (nếu cần)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Cách 2: Sử dụng pgAdmin GUI

1. Mở pgAdmin
2. Right-click vào "Databases" → "Create" → "Database..."
3. Nhập tên database: `da_qlhsvc`
4. Owner: `postgres`
5. Encoding: `UTF8`
6. Click "Save"

## Cách 3: Sử dụng Docker (nếu dùng container)

```bash
# Chạy PostgreSQL container
docker run --name postgres-qlhsvc -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=da_qlhsvc -p 5432:5432 -d postgres:15

# Hoặc nếu đã có container PostgreSQL
docker exec -it <container-name> psql -U postgres -c "CREATE DATABASE da_qlhsvc;"
```

## Sau khi tạo database

### 1. Kiểm tra kết nối trong .env
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/da_qlhsvc?schema=public"
```

### 2. Chạy Prisma migrate để tạo tables
```bash
npx prisma migrate dev --name init
```

### 3. Seed data (tạo dữ liệu mẫu)
```bash
psql -U postgres -d da_qlhsvc -f prisma/seed.sql
```

### 4. Kiểm tra tables đã được tạo
```bash
psql -U postgres -d da_qlhsvc
\dt
```

## Xử lý lỗi thường gặp

### Lỗi: "database does not exist"
- Chạy lại lệnh CREATE DATABASE

### Lỗi: "password authentication failed"
- Kiểm tra lại username/password trong .env
- Kiểm tra pg_hba.conf

### Lỗi: "could not connect to server"
- Kiểm tra PostgreSQL service đang chạy:
  ```bash
  # Windows
  Get-Service postgresql*
  
  # Linux
  sudo systemctl status postgresql
  ```

## Kiểm tra kết nối từ Node.js

```bash
# Test connection
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => console.log('✓ Connected')).catch(e => console.error('✗ Error:', e.message));"
```

## Reset database (nếu cần)

```bash
# Drop và tạo lại
psql -U postgres -c "DROP DATABASE IF EXISTS da_qlhsvc;"
psql -U postgres -c "CREATE DATABASE da_qlhsvc;"

# Hoặc dùng Prisma
npx prisma migrate reset
```
