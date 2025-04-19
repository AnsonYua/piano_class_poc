"use client";

import React, { FC, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface PageDashboardProps {}

const PageDashboard: FC<PageDashboardProps> = ({}) => {
  const router = useRouter();

  useEffect(() => {
    // Check if teacher is logged in
    const token = localStorage.getItem("teacher_auth_token");
    if (!token) {
      router.push("/teacher-admin/login" as any);
    }
  }, [router]);

  return (
    <div className="container mb-24 lg:mb-32">
      <h2 className="my-5 flex items-center text-3xl leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
        導師管理面板
      </h2>
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
        <p className="text-lg mb-4">歡迎來到導師管理面板</p>
        <p className="mb-4">在這裡您可以管理您的課程、學生和預約。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-primary-50 dark:bg-neutral-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">課程管理</h3>
            <p>查看和管理您的課程</p>
          </div>
          
          <div className="p-4 bg-primary-50 dark:bg-neutral-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">學生管理</h3>
            <p>查看和管理您的學生</p>
          </div>
          
          <div className="p-4 bg-primary-50 dark:bg-neutral-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">預約管理</h3>
            <p>查看和管理您的預約</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageDashboard; 