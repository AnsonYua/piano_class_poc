'use client';

import ResetPasswordSuccessPage from '@/shared/ResetPasswordSuccessPage';

export default function TeacherResetPasswordSuccessPage() {
  return (
    <ResetPasswordSuccessPage 
      userType="teacher" 
      loginPath="/teacher-admin/login" 
    />
  );
} 