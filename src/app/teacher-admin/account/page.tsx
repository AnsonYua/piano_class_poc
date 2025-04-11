"use client";

import React from "react";
import SharedAccountPage from "@/components/SharedAccountPage";
import AdminPageLayout from "@/components/AdminPageLayout";

const TeacherAccountPage = () => {
  return (
    <AdminPageLayout userType="teacher">
      <SharedAccountPage userType="teacher" />
    </AdminPageLayout>
  );
};

export default TeacherAccountPage; 