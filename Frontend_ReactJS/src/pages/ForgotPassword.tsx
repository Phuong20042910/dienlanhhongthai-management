import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, ArrowLeft, Sun, Moon } from 'lucide-react';
import api from '../utils/api';
import { useThemeStore } from '../store/themeStore';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setError('');
      await api.post('/auth/forgot-password', {
        email: data.email,
      });
      setIsSuccess(true);
      toast.success('Gửi email khôi phục thành công!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đã có lỗi xảy ra khi gửi email khôi phục');
      toast.error('Lỗi gửi email khôi phục');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Nút quay lại Landing Page ở góc trên bên trái */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 shadow-sm transition-all"
        >
          <ArrowLeft size={16} />
          <span>Về Trang chủ Website</span>
        </Link>
      </div>

      {/* Nút chuyển đổi Theme Sáng / Tối ở góc trên bên phải */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-all cursor-pointer"
          title={isDarkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>
      </div>

      {/* Background Decorators (GPU-friendly Radial Gradients) */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_20%_20%,rgba(59,130,246,0.12),transparent_70%),radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(99,102,241,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_60%_60%_at_20%_20%,rgba(59,130,246,0.15),transparent_70%),radial-gradient(ellipse_60%_60%_at_80%_80%,rgba(99,102,241,0.15),transparent_70%)]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="flex justify-center">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-4 rounded-2xl shadow-lg shadow-blue-500/30">
            <Mail className="text-white" size={40} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Quên mật khẩu
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-white/40 dark:border-gray-800 transition-colors duration-200">
          {isSuccess ? (
            <div className="text-center">
              <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm font-medium border border-green-100 dark:border-green-900/50 mb-6">
                Một email khôi phục mật khẩu đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư đến (và thư mục rác) để tiếp tục.
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Quay lại trang Đăng nhập
              </button>
            </div>
          ) : (
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
                    'Gửi email khôi phục'
                  )}
                </button>
              </div>

              <div className="text-center mt-6">
                <Link to="/login" className="inline-flex items-center text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <ArrowLeft size={16} className="mr-1" /> Quay lại trang Đăng nhập
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
