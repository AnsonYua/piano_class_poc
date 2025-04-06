"use client";

import { Route } from "@/routers/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const ReservationsNav = () => {
  const pathname = usePathname();

  const listNav: Route[] = [
    "/my-reservations/recent",
    "/my-reservations/history",
  ];
  
  const displayMap = {
    "/my-reservations/recent": "近期預約",
    "/my-reservations/history": "上課紀錄",
  };

  return (
    <div className="container">
      <div className="flex justify-center space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
        {listNav.map((item) => {
          const isActive = pathname === item;
          return (
            <Link
              key={item}
              href={item}
              className={`block py-4 md:py-4 border-b-2 flex-shrink-0 capitalize ${
                isActive
                  ? "border-primary-500 font-medium"
                  : "border-transparent"
              }`}
            >
              {displayMap[item as keyof typeof displayMap]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}; 