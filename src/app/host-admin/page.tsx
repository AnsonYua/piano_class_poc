"use client";

import React from "react";
import Link from "next/link";
import { Route } from "@/routers/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import AdminPageLayout from "@/components/AdminPageLayout";
import { usePathname } from "next/navigation";
import { UserTypeUtils } from "@/utils/UserTypeUtils";

export default function HostAdminLandingPage() {
  const pathname = usePathname();
  const userType = UserTypeUtils.getUserTypeFromPathname(pathname);

  return (
    <div className="nc-PageHome relative overflow-hidden">
      <div className="container relative pt-10 pb-16 lg:pt-20 lg:pb-28">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl md:text-6xl">
            場地管理平台
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
            歡迎來到場地管理平台，這裡是您管理場地、預約和設定的中心。
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M9 21V7a3 3 0 016 0v14" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">場地管理</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                創建和管理您的場地，設置場地資訊與可用時間。
              </p>
              <div className="mt-4">
                <Link href={"/host-admin/venues" as Route} className="text-yellow-600 dark:text-yellow-400 hover:underline">
                  查看場地 →
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">預約管理</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                查看與管理所有預約，協調場地使用時段。
              </p>
              <div className="mt-4">
                <Link href={"/host-admin/bookings" as Route} className="text-blue-600 dark:text-blue-400 hover:underline">
                  查看預約 →
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">設定管理</h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                調整您的平台設定與權限。
              </p>
              <div className="mt-4">
                <Link href={"/host-admin/settings" as Route} className="text-green-600 dark:text-green-400 hover:underline">
                  查看設定 →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            {userType === "hostAdmin" ? (
              <ButtonPrimary sizeClass="px-8 py-3 sm:px-10">
                <Link href={"/host-admin/dashboard" as Route}>進入管理面板</Link>
              </ButtonPrimary>
            ) : (
              <>
                <ButtonPrimary sizeClass="px-8 py-3 sm:px-10" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                  <Link href={"/host-admin/profile" as Route}>個人資料</Link>
                </ButtonPrimary>
                <ButtonPrimary sizeClass="px-8 py-3 sm:px-10">
                  <Link href={"/host-admin/dashboard" as Route}>進入管理面板</Link>
                </ButtonPrimary>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
