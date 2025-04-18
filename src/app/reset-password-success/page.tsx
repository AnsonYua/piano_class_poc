'use client';

import ResetPasswordSuccessPage from '@/shared/ResetPasswordSuccessPage';

export default function StudentResetPasswordSuccessPage() {
  return (
    <ResetPasswordSuccessPage 
      userType="student" 
      loginPath="/login" 
    />
  );
} 