"use client";

import { Route } from "@/routers/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { UserIcon, KeyIcon, UserGroupIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

export type UserRole = "student" | "teacher" | "shop-owner";

interface AccountNavigationProps {
  role?: UserRole;
}

export const AccountNavigation: React.FC<AccountNavigationProps> = ({ role: propRole }) => {
  const pathname = usePathname();
  
  // Determine role from URL if not provided as prop
  const role = propRole || (
    pathname?.startsWith("/teacher") ? "teacher" :
    pathname?.startsWith("/shop-owner-admin") ? "shop-owner" :
    pathname?.startsWith("/student") ? "student" :
    undefined
  );

  // Default navigation for backward compatibility
  const listNav = [
    "/account" as Route,
    "/account-students" as Route,
   // "/account-savelists",
    "/account-password" as Route,
    //"/account-billing",
  ];
  
  const displayMap = {
    "/account" :"帳號資料",
    "/account-students" :"同學資料",
    "/account-savelists" :"我的預約",
    "/account-password" :"密碼修改",
    "/account-billing" :"帳單管理",
  };

  // Role-based navigation
  const getTabs = () => {
    if (!role) {
      // Return default navigation if no role is provided
      return listNav.map(item => {
        const itemStr = item.toString();
        return {
          name: displayMap[itemStr as keyof typeof displayMap],
          href: item,
          icon: itemStr === "/account" ? UserIcon : 
                itemStr === "/account-password" ? KeyIcon : 
                itemStr === "/account-students" ? UserGroupIcon : 
                itemStr === "/account-rooms" ? BuildingOfficeIcon : UserIcon
        };
      });
    }
    
    const commonTabs = [
      { name: "帳號資料", href: `/${role}/account`, icon: UserIcon },
      { name: "密碼修改", href: `/${role}/account-password`, icon: KeyIcon },
    ];
    
    if (role === "student") {
      return [
        ...commonTabs,
        { name: "同學資料", href: "/student/account-students", icon: UserGroupIcon },
      ];
    } else if (role === "teacher") {
      return commonTabs;
    } else if (role === "shop-owner") {
      return [
        ...commonTabs,
        { name: "琴房資料", href: "/shop-owner-admin/account-rooms", icon: BuildingOfficeIcon },
      ];
    }
    
    return commonTabs;
  };

  const tabs = getTabs();

  return (
    <nav className="bg-white dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href as any}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-1" />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
