'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Route } from "@/routers/types";
import ResetPasswordPageLayout from '@/shared/ResetPasswordPageLayout';
import ResetPasswordForm from '@/shared/ResetPasswordForm';
import { useEffect } from 'react';
import { ApiUtils } from '@/utils/ApiUtils';

export default function ShopOwnerResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/shop-owner-admin' as Route);
    }
  }, [token, router]);

  const handleResetPassword = async (data: { otp: string; newPassword: string }) => {
    try {
      if (!token) {
        return '無效的請求，請重新發送驗證碼';
      }

      const response = await fetch(ApiUtils.getAuthUrl('reset-password', 'shop_admin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          otp: data.otp,
          newPassword: data.newPassword
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        router.push('/shop-owner-admin/reset-password-success' as Route);
        return null;
      } else {
        return responseData.message || '發生錯誤，請稍後再試';
      }
    } catch (error) {
      return '發生錯誤，請稍後再試';
    }
  };

  if (!token) {
    return null;
  }

  return (
    <ResetPasswordPageLayout title="琴行重設密碼">
      <ResetPasswordForm 
        userType="shop-owner" 
        redirectPath="/shop-owner-admin/reset-password-success"
        onSubmit={handleResetPassword}
      />
    </ResetPasswordPageLayout>
  );
} 