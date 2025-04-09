'use client';

import { useState } from 'react';
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { Route } from "@/routers/types";

interface ResetPasswordFormProps {
  userType: 'student' | 'teacher' | 'shop-owner';
  redirectPath: string;
  onSubmit: (data: { otp: string; newPassword: string }) => Promise<string | null>;
}

export default function ResetPasswordForm({ userType, redirectPath, onSubmit }: ResetPasswordFormProps) {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('密碼不匹配');
      return;
    }

    setIsLoading(true);
    try {
      const errorMessage = await onSubmit({ otp, newPassword });
      if (errorMessage) {
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (err) {
      setError('發生錯誤，請稍後再試');
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getLoginPath = () => {
    switch (userType) {
      case 'teacher':
        return '/teacher-admin/login';
      case 'shop-owner':
        return '/shop-owner-admin/login';
      default:
        return '/login';
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block">
            <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              驗證碼
            </span>
            <Input
              type="text"
              placeholder="請輸入驗證碼"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isLoading}
              required
            />
          </label>
        </div>

        <div>
          <label className="block">
            <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              新密碼
            </span>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="請輸入新密碼"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </label>
        </div>

        <div>
          <label className="block">
            <span className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              確認新密碼
            </span>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="請再次輸入新密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </label>
        </div>

        <ButtonPrimary type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '處理中...' : '重設密碼'}
        </ButtonPrimary>
      </form>

      <div className="text-center">
        <Link href={getLoginPath() as Route} className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400">
          返回登入
        </Link>
      </div>
    </div>
  );
} 