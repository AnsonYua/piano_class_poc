'use client';

import ResetPasswordPage from '@/shared/ResetPasswordPage';

export default function TeacherResetPasswordPage() {
  return (
    <ResetPasswordPage 
      userType="teacher" 
      redirectPath="/teacher-admin/reset-password-success" 
      loginPath="/teacher-admin/login" 
    />
  );
} 