'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import OTPVerification from '@/components/auth/OTPVerification';

export default function ShopOwnerOTPVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';

  const handleVerify = async (otp: string) => {
    // TODO: Implement shop owner OTP verification API call
    console.log('Verifying OTP:', otp);
  };

  const handleResendOTP = async () => {
    // TODO: Implement shop owner OTP resend API call
    console.log('Resending OTP to:', token);
  };

  if (!token) {
    return null;
  }

  return (
    <OTPVerification
      userType="shop-owner"
      email={token}
      onVerify={handleVerify}
      onResendOTP={handleResendOTP}
    />
  );
} 