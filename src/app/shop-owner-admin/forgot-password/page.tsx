'use client';

import { useRouter } from 'next/navigation';
import { Route } from "@/routers/types";
import ForgotPasswordPageLayout from '@/shared/ForgotPasswordPageLayout';
import ForgotPasswordForm from '@/shared/ForgotPasswordForm';
import { ApiUtils } from '@/utils/ApiUtils';

export default function ShopOwnerForgotPasswordPage() {
  const router = useRouter();

  const handleForgotPassword = async (data: { contactNumber: string }) => {
    try {
      // Add 852 prefix to the contact number for the API request
      const contactNumberWithPrefix = data.contactNumber.startsWith('852') 
        ? data.contactNumber 
        : `852${data.contactNumber}`;
      
      const response = await fetch(ApiUtils.getAuthUrl('request-reset-password', 'shop-admin'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactNumber: contactNumberWithPrefix }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Pass the token via query parameter instead of localStorage
        router.push(`/shop-owner-admin/reset-password?token=${responseData.token}` as Route);
        return null;
      } else if (responseData.message === 'OTP_TOO_RECENT') {
        return '請求過於頻繁，請等待1分鐘再請求一次OTP。';
      } else {
        return responseData.message || '發生錯誤，請稍後再試';
      }
    } catch (error) {
      return '發生錯誤，請稍後再試';
    }
  };

  return (
    <ForgotPasswordPageLayout title="琴行忘記密碼">
      <ForgotPasswordForm 
        userType="shop-owner" 
        redirectPath="/shop-owner-admin/reset-password"
        onSubmit={handleForgotPassword}
      />
    </ForgotPasswordPageLayout>
  );
} 