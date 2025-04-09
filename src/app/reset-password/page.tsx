'use client';

import ResetPasswordPage from '@/shared/ResetPasswordPage';

export default function StudentResetPasswordPage() {
  return (
    <ResetPasswordPage 
      userType="student" 
      redirectPath="/reset-password-success" 
      loginPath="/login" 
    />
  );
} 