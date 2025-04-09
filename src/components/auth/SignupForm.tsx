import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import ButtonPrimary from '../ButtonPrimary';
import Input from '../Input';

interface SignupFormProps {
  userType: 'teacher' | 'shop-owner';
  onSubmit: (data: any) => Promise<void>;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  shopName?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ userType, onSubmit }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const password = watch('password');

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      router.push(`/${userType}-admin/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <label className="block text-sm font-medium text-gray-700">姓名</label>
        <Input
          type="text"
          {...register('name', { required: '請輸入姓名' })}
          className="mt-1"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">電子郵件</label>
        <Input
          type="email"
          {...register('email', {
            required: '請輸入電子郵件',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '請輸入有效的電子郵件地址',
            },
          })}
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">密碼</label>
        <Input
          type="password"
          {...register('password', {
            required: '請輸入密碼',
            minLength: {
              value: 8,
              message: '密碼至少需要8個字符',
            },
          })}
          className="mt-1"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">確認密碼</label>
        <Input
          type="password"
          {...register('confirmPassword', {
            required: '請確認密碼',
            validate: (value) =>
              value === password || '密碼不匹配',
          })}
          className="mt-1"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message as string}</p>
        )}
      </div>

      {userType === 'shop-owner' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">商店名稱</label>
          <Input
            type="text"
            {...register('shopName', { required: '請輸入商店名稱' })}
            className="mt-1"
          />
          {errors.shopName && (
            <p className="mt-1 text-sm text-red-600">{errors.shopName.message as string}</p>
          )}
        </div>
      )}

      <ButtonPrimary type="submit" disabled={isLoading}>
        {isLoading ? '處理中...' : '註冊'}
      </ButtonPrimary>
    </form>
  );
};

export default SignupForm; 