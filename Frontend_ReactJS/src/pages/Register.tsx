import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wrench, Loader2, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  full_name: z.string().min(2, 'Họ tên quá ngắn'),
  role: z.enum(['ADMIN', 'TECHNICIAN', 'BOSS']),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'TECHNICIAN'
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      setSuccess('');
      await api.post('/auth/register', data);
      setSuccess('Tạo tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đã có lỗi xảy ra khi đăng ký');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 dark:bg-blue-900/20 blur-[120px]"></div>
        <div className="absolute top-[50%] -left-[10%] w-[40%] h-[60%] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[120px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="flex justify-center">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-4 rounded-2xl shadow-lg shadow-blue-500/30">
            <Wrench className="text-white" size={40} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Đăng ký tài khoản
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Hệ thống quản lý nội bộ Điện Lạnh
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20 dark:border-gray-800 transition-colors duration-300">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center font-medium border border-red-100 dark:border-red-900/50">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl text-sm text-center font-medium border border-green-100 dark:border-green-900/50">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Họ và tên
              </label>
              <input
                {...register('full_name')}
                type="text"
                className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                placeholder="Nguyễn Văn A"
              />
              {errors.full_name && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Địa chỉ Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                placeholder="email@example.com"
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Số điện thoại
                </label>
                <input
                  {...register('phone')}
                  type="text"
                  className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                  placeholder="0987654321"
                />
                {errors.phone && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Vai trò
                </label>
                <select
                  {...register('role')}
                  className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                >
                  <option value="TECHNICIAN">Thợ kỹ thuật</option>
                  <option value="ADMIN">Quản trị viên</option>
                  <option value="BOSS">Chủ cửa hàng</option>
                </select>
                {errors.role && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.role.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Mật khẩu
              </label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all duration-200"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
            </div>

            <div className="pt-4">
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
                  'Đăng ký tài khoản'
                )}
              </button>
            </div>
            
            <div className="text-center mt-6 flex justify-center items-center gap-2">
              <Link to="/login" className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ArrowLeft size={16} /> Quay lại Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
