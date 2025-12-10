# Dependencies Installation

## Đã cài đặt các dependencies sau:

### 1. Backend/Database
- ✅ `prisma` - Prisma ORM CLI
- ✅ `@prisma/client` - Prisma Client
- ✅ `bcryptjs` - Password hashing
- ✅ `@types/bcryptjs` - TypeScript types for bcryptjs
- ✅ `date-fns` - Date utilities

### 2. Authentication
- ✅ `next-auth` - Authentication for Next.js
- ✅ `@auth/prisma-adapter` - Prisma adapter for NextAuth

### 3. Form & Validation
- ✅ `react-hook-form` - Form management
- ✅ `zod` - Schema validation
- ✅ `@hookform/resolvers` - Resolvers for react-hook-form

### 4. HTTP Client
- ✅ `axios` - HTTP client

### 5. UI Icons
- ✅ `lucide-react` - Icon library

### 6. Utilities
- ✅ `clsx` - Conditional className utility
- ✅ `tailwind-merge` - Merge Tailwind classes

## Files Created

### Utility Files
- `src/lib/utils.ts` - Utility functions (cn, formatDate, formatDateTime)
- `src/lib/axios.ts` - Axios instance with interceptors
- `src/lib/validations.ts` - Zod validation schemas
- `src/lib/prisma.ts` - Prisma client singleton (already created)

### Components
- `src/components/LoginForm.tsx` - Example login form using react-hook-form, zod, and lucide-react

## Usage Examples

### 1. Using cn utility for Tailwind classes
```typescript
import { cn } from '@/lib/utils';

<div className={cn("base-class", condition && "conditional-class")} />
```

### 2. Using axios instance
```typescript
import axiosInstance from '@/lib/axios';

const response = await axiosInstance.get('/users');
const data = await axiosInstance.post('/users', { email, name });
```

### 3. Using validation schemas
```typescript
import { loginSchema } from '@/lib/validations';

const result = loginSchema.parse({ email, password });
```

### 4. Using react-hook-form with zod
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});
```

### 5. Using Lucide icons
```typescript
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

<Mail className="w-5 h-5" />
```

### 6. Using bcryptjs for password hashing
```typescript
import bcrypt from 'bcryptjs';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 7. Using date-fns
```typescript
import { format, formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';

const formatted = format(new Date(), 'dd/MM/yyyy', { locale: vi });
```

## Next Steps

1. **Configure NextAuth**: Create `src/app/api/auth/[...nextauth]/route.ts`
2. **Update Prisma Schema**: Add User, Session, Account models for NextAuth
3. **Create Authentication Pages**: Login, Register, etc.
4. **Implement Protected Routes**: Use NextAuth session protection

## Security Notes

- Mật khẩu được hash bằng bcryptjs trước khi lưu vào database
- Axios interceptors xử lý authentication tokens
- Zod validation đảm bảo data integrity
- NextAuth cung cấp secure session management
