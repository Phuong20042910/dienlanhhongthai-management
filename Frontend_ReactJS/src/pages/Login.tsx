import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wrench, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, token } = response.data;
      setAuth(user, token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đã có lỗi xảy ra khi đăng nhập');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[120px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="flex justify-center">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-4 rounded-2xl shadow-lg shadow-blue-500/30">
            <Wrench className="text-white" size={40} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Hồng Thái EMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Hệ thống quản lý nội bộ Điện Lạnh
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20 dark:border-gray-800 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center font-medium border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Địa chỉ Email
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="admin@dienlanhhongthai.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  type="password"
                  className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded cursor-pointer transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                  Ghi nhớ đăng nhập
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  'Đăng nhập vào Hệ thống'
                )}
              </button>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600 dark:text-gray-400">Chưa có tài khoản? </span>
              <Link to="/register" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
                Đăng ký ngay
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
