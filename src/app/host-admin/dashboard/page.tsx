"use client";

import React from "react";
import AdminPageLayout from "@/components/AdminPageLayout";
import { UserType } from "@/utils/UserTypeUtils";
import { Nav } from "@/components/Nav";

const HostAdminDashboardPage = () => {
  return (
    <AdminPageLayout userType="hostAdmin" /* extend AdminPageLayout to accept hostAdmin if needed */>
      <div>
        {/* Top bar and secondary menu are handled by AdminPageLayout and Nav */}
        <h2 className="text-2xl font-semibold mb-4">Host Admin Dashboard</h2>
        <div className="mt-4">
          <p className="text-neutral-700 dark:text-neutral-200">歡迎來到場地主控台，請從側邊選單選擇管理項目。</p>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default HostAdminDashboardPage;
