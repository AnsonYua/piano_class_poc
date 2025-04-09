'use client';

import { useState } from 'react';
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";

interface ForgotPasswordFormProps {
  userType: 'student' | 'teacher' | 'shop-owner';
  redirectPath: string;
  onSubmit: (data: { contactNumber: string }) => Promise<string | null>;
}

export default function ForgotPasswordForm({ userType, redirectPath, onSubmit }: ForgotPasswordFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const errorMessage = await onSubmit({ contactNumber: "852"+phoneNumber });
      if (errorMessage) {
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (err) {
      setError('發生錯誤，請稍後再試');
      setIsLoading(false);
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
              電話號碼
            </span>
            <Input
              type="text"
              placeholder="請輸入電話號碼 (不包含852)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              required
            />
          </label>
        </div>

        <ButtonPrimary type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '處理中...' : '發送驗證碼'}
        </ButtonPrimary>
      </form>
    </div>
  );
} 