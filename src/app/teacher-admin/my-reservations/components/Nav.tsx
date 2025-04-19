"use client";

import { Route } from "@/routers/types";
import React from "react";
import { SharedNav, NavItem } from "@/components/SharedNav";

export const TeacherReservationsNav = () => {
  const listNav: NavItem[] = [
    {
      id: "recent",
      name: "最新預約",
      href: "/teacher-admin/my-reservations/recent" as Route<string>,
    },
    {
      id: "history",
      name: "我的預約",
      href: "/teacher-admin/my-reservations/history" as Route<string>,
    },
  ];

  return <SharedNav items={listNav} />;
};
