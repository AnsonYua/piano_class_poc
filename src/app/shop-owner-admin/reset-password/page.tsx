'use client';

import ResetPasswordPage from '@/shared/ResetPasswordPage';

export default function ShopOwnerResetPasswordPage() {
  return (
    <ResetPasswordPage 
      userType="shop-owner" 
      redirectPath="/shop-owner-admin/reset-password-success" 
      loginPath="/shop-owner-admin/login" 
    />
  );
} 