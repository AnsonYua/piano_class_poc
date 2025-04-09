'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import { Route } from "@/routers/types";

interface ForgotPasswordFormProps {
  userType: 'student' | 'teacher' | 'shop-owner';
  redirectPath: string;
}

export default function ForgotPasswordForm({ userType, redirectPath }: ForgotPasswordFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = userType === 'student' 
        ? '/api/auth/request-reset-password'
        : userType === 'teacher'
          ? '/api/teacher/request-reset-password'
          : '/api/shop-owner/request-reset-password';

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactNumber: "852"+phoneNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage for the reset password page
        localStorage.setItem('reset_token', data.token);
        router.push(redirectPath as Route);
      } else if (data.message === 'OTP_TOO_RECENT') {
        setError('請求過於頻繁，請等待1分鐘再請求一次OTP。');
        setIsLoading(false);
      } else {
        setError(data.message || '發生錯誤，請稍後再試');
        setIsLoading(false);
      }
    } catch (err) {
      setError('發生錯誤，請稍後再試');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
        <input type="text" style={{ display: 'none' }} autoComplete="off" />
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-center">
            {error}
          </div>
        )}
        
        <label className="block">
          <span className="text-neutral-800 dark:text-neutral-200">
            電話號碼
          </span>
          <Input
            type="tel"
            name={`phone-${Date.now()}`}
            placeholder="請輸入聯絡電話"
            className="mt-1"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            autoComplete="new-phone"
            disabled={isLoading}
          />
        </label>

        <ButtonPrimary type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              處理中...
            </div>
          ) : "發送驗證碼"}
        </ButtonPrimary>
      </form>
    </div>
  );
} 