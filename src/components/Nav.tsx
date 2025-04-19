"use client";

import React from 'react';
import { UserIcon, UserGroupIcon, CalendarIcon, KeyIcon } from "@heroicons/react/24/outline";
import { SharedNav, NavItem } from "./SharedNav";
import { UserTypeUtils, UserType } from "@/utils/UserTypeUtils";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();
  const userType = UserTypeUtils.getUserTypeFromPathname(pathname);
  
  // Define navigation items based on user type
  const getNavItems = (userType: UserType): NavItem[] => {
    switch (userType) {
      case 'student':
        return [
          {
            id: "account",
            name: "帳戶資料",
            href: "/account" as any,
          },
          {
            id: "account-students",
            name: "同學資料",
            href: "/account-students" as any,
          },
          {
            id: "account-password",
            name: "密碼修改",
            href: "/account-password" as any,
          },
        ];
      case 'shopOwner':
        // get current path
        const currentPath = pathname;
        if(currentPath?.includes("/account-rooms")){
          return [
            {
              id: "account-rooms",
              name: "琴室資料",
              href: "/shop-owner-admin/account-rooms" as any,
            }
          ];
        }else{
          return [
            {
              id: "account",
              name: "帳戶資料",
              href: "/shop-owner-admin/account" as any,
              },
            {
              id: "account-password",
              name: "密碼修改",
              href: "/shop-owner-admin/account-password" as any,
            },
          ];
        }

      case 'teacher':
        return [
          {
            id: "account",
            name: "帳戶資料",
            href: "/teacher-admin/account" as any,
          },
          {
            id: "account-password",
            name: "密碼修改",
            href: "/teacher-admin/account-password" as any,
          },
        ];
      case 'hostAdmin':
          return [
            {
              id: "account-approval",
              name: "帳號批核",
              href: "/host-admin/account-approval" as any,
            },
            {
              id: "class-approval",
              name: "課堂取消批核",
              href: "/host-admin/class-approval" as any,
            },
          ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(userType);
  
  return <SharedNav items={navItems} />;
} 