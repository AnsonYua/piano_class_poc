'use client';

import ForgotPasswordPage from '@/shared/ForgotPasswordPage';

export default function ShopOwnerForgotPasswordPage() {
  return (
    <ForgotPasswordPage 
      userType="shop-owner" 
      redirectPath="/shop-owner-admin/reset-password" 
      loginPath="/shop-owner-admin/login" 
    />
  );
} 