"use client";

import React from "react";
import { Nav } from "@/components/Nav";
import { UserType } from "@/utils/UserTypeUtils";

interface AdminPageLayoutProps {
  children: React.ReactNode;
  userType: "teacher" | "shopOwner" | "hostAdmin";
}

export default function AdminPageLayout({
  children,
  userType,
}: AdminPageLayoutProps) {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-700 pt-0 bg-white dark:bg-neutral-800">
        <Nav />
      </div>
      <div className="container max-w-4xl mx-auto pt-6 sm:pt-6 pb-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6">
          <div className="mt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}