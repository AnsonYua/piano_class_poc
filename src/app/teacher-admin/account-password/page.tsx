"use client";

import React from "react";
import SharedPasswordPage from "@/components/SharedPasswordPage";
import AdminPageLayout from "@/components/AdminPageLayout";

const TeacherAccountPasswordPage = () => {
  return (
    <AdminPageLayout userType="teacher">
      <SharedPasswordPage userType="teacher" />
    </AdminPageLayout>
  );
};

export default TeacherAccountPasswordPage; 