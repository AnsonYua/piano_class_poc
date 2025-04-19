"use client";
import React, { FC } from "react";
import { TeacherReservationsNav } from "./components/Nav";

export interface TeacherReservationsLayoutProps {
  children?: React.ReactNode;
}

const TeacherReservationsLayout: FC<TeacherReservationsLayoutProps> = ({ children }) => {
  return (
    <div className="nc-TeacherReservationsLayout bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-700 pt-0 bg-white dark:bg-neutral-800">
        <TeacherReservationsNav />
      </div>
      <div className="container pt-6 sm:pt-6 pb-8">{children}</div>
    </div>
  );
};

export default TeacherReservationsLayout;
