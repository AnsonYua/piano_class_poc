'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import OTPVerification from '@/components/auth/OTPVerification';
import Layout from '@/components/Layout';

export default function ShopOwnerOTPVerificationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleVerify = async (otp: string) => {
    // TODO: Implement shop owner OTP verification API call
    console.log('Verifying OTP:', otp);
  };

  const handleResendOTP = async () => {
    // TODO: Implement shop owner OTP resend API call
    console.log('Resending OTP to:', email);
  };

  if (!email) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <OTPVerification
          userType="shop-owner"
          email={email}
          onVerify={handleVerify}
          onResendOTP={handleResendOTP}
        />
      </div>
    </Layout>
  );
} 