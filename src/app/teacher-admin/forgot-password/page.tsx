'use client';

import ForgotPasswordPage from '@/shared/ForgotPasswordPage';

export default function TeacherForgotPasswordPage() {
  return (
    <ForgotPasswordPage 
      userType="teacher" 
      redirectPath="/teacher-admin/reset-password" 
      loginPath="/teacher-admin/login" 
    />
  );
} 