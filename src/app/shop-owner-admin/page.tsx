"use client";

import React from "react";
import Link from "next/link";
import { Route } from "@/routers/types";
import ButtonPrimary from "@/shared/ButtonPrimary";
import AdminPageLayout from "@/components/AdminPageLayout";

export default function ShopOwnerAdminLandingPage() {
  return (
      <div className="nc-PageHome relative overflow-hidden">
        <div className="container relative pt-10 pb-16 lg:pt-20 lg:pb-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl md:text-6xl">
              琴行管理平台
            </h1>
            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
              歡迎來到琴行管理平台，這裡是您管理琴行、課程和導師的中心。
            </p>
            
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">琴行管理</h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  管理您的琴行資料，設置營業時間和地點。
                </p>
                <div className="mt-4">
                  <Link href={"/shop-owner-admin/shop" as Route} className="text-blue-600 dark:text-blue-400 hover:underline">
                    查看琴行資料 →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">導師管理</h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  管理您的導師團隊，分配課程和排程。
                </p>
                <div className="mt-4">
                  <Link href={"/shop-owner-admin/teachers" as Route} className="text-green-600 dark:text-green-400 hover:underline">
                    查看導師 →
                  </Link>
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">課程管理</h3>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  管理您的課程，設置課程內容和時間表。
                </p>
                <div className="mt-4">
                  <Link href={"/shop-owner-admin/courses" as Route} className="text-purple-600 dark:text-purple-400 hover:underline">
                    查看課程 →
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <ButtonPrimary sizeClass="px-8 py-3 sm:px-10">
                <Link href={"/shop-owner-admin/dashboard" as Route}>進入管理面板</Link>
              </ButtonPrimary>
              <ButtonPrimary sizeClass="px-8 py-3 sm:px-10" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <Link href={"/shop-owner-admin/profile" as Route}>個人資料</Link>
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
  );
} 