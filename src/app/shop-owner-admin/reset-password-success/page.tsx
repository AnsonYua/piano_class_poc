'use client';

import ResetPasswordSuccessPage from '@/shared/ResetPasswordSuccessPage';

export default function ShopOwnerResetPasswordSuccessPage() {
  return (
    <ResetPasswordSuccessPage 
      userType="shop-owner" 
      loginPath="/shop-owner-admin/login" 
    />
  );
} 