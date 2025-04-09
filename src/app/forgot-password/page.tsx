'use client';

import ForgotPasswordPage from '@/shared/ForgotPasswordPage';

export default function StudentForgotPasswordPage() {
  return (
    <ForgotPasswordPage 
      userType="student" 
      redirectPath="/reset-password" 
      loginPath="/login" 
    />
  );
} 