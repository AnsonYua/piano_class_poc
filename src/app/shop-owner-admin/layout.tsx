"use client";

import React from "react";
import { Nav } from "@/components/Nav";
import { usePathname } from "next/navigation";

export default function ShopOwnerAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMainPage = pathname === "/shop-owner-admin";
  
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {!isMainPage && (
        <div className="border-b border-neutral-200 dark:border-neutral-700 pt-0 bg-white dark:bg-neutral-800">
          <Nav />
        </div>
      )}
      <div className="container max-w-5xl mx-auto pt-6 sm:pt-6 pb-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6">
          {children}
        </div>
      </div>
    </div>
  );
} 