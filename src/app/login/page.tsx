'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email('Email không hợp lệ')
    .refine((email) => email.toLowerCase().endsWith('@tvu.edu.vn'), {
      message: 'Email phải có đuôi @tvu.edu.vn',
    }),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    ma_nguoi_dung: number;
    email: string;
    ho_ten: string;
    ma_vai_tro?: number | null;
    ma_don_vi?: number | null;
    phai_doi_mat_khau: boolean;
  };
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: LoginResponse = await response.json();

      if (result.success && result.token) {
        // Lưu token vào localStorage
        localStorage.setItem('access_token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        setLoginSuccess(true);
        
        // Kiểm tra nếu phải đổi mật khẩu
        if (result.user?.phai_doi_mat_khau) {
          setTimeout(() => {
            window.location.href = '/change-password';
          }, 1000);
        } else {
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        }
      } else {
        setError(result.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl p-0 overflow-hidden">
        {/* Left Column: Giới thiệu */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white p-8">
          <div className="mb-6">
            <img
              src="/logo-tvu.jpg"
              alt="Logo Trường Đại học Trà Vinh"
              className="w-24 h-24 rounded-full shadow-lg border-4 border-white bg-white object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">Hệ thống quản lý hồ sơ</h1>
          <p className="text-lg mb-2">Viên chức đi nước ngoài</p>
          <p className="text-base opacity-80">Trường Đại học Trà Vinh</p>
        </div>
        {/* Right Column: Login Form */}
        <div className="w-full p-8 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Đăng nhập hệ thống</h2>
            <p className="text-gray-500 mt-2">Vui lòng sử dụng email TVU và mật khẩu</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {loginSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">Đăng nhập thành công! Đang chuyển hướng...</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email TVU</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="example@tvu.edu.vn"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Đăng nhập</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Chỉ dành cho viên chức Trường Đại học Trà Vinh</p>
            <p className="mt-1">Nếu bạn quên mật khẩu hoặc gặp sự cố đăng nhập, vui lòng liên hệ phòng CNTT để được hỗ trợ nhanh chóng và bảo mật.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
