'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import OTPVerification from '@/components/auth/OTPVerification';
import Layout from '@/components/Layout';

export default function TeacherOTPVerificationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleVerify = async (otp: string) => {
    // TODO: Implement teacher OTP verification API call
    console.log('Verifying OTP:', otp);
  };

  const handleResendOTP = async () => {
    // TODO: Implement teacher OTP resend API call
    console.log('Resending OTP to:', email);
  };

  if (!email) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <OTPVerification
          userType="teacher"
          email={email}
          onVerify={handleVerify}
          onResendOTP={handleResendOTP}
        />
      </div>
    </Layout>
  );
} 