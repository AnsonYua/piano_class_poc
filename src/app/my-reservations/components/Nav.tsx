"use client";

import { Route } from "@/routers/types";
import React from "react";
import { SharedNav, NavItem } from "@/components/SharedNav";

export const ReservationsNav = () => {
  const listNav: NavItem[] = [
    {
      id: "recent",
      name: "近期預約",
      href: "/my-reservations/recent" as Route<string>,
    },
    {
      id: "history",
      name: "上課紀錄",
      href: "/my-reservations/history" as Route<string>,
    },
  ];

  return <SharedNav items={listNav} />;
}; 