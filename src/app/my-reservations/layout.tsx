import React, { FC } from "react";
import { ReservationsNav } from "./components/Nav";

export interface ReservationsLayoutProps {
  children?: React.ReactNode;
}

const ReservationsLayout: FC<ReservationsLayoutProps> = ({ children }) => {
  return (
    <div className="nc-ReservationsLayout bg-neutral-50 dark:bg-neutral-900">
      <div className="border-b border-neutral-200 dark:border-neutral-700 pt-0 bg-white dark:bg-neutral-800">
        <ReservationsNav />
      </div>
      <div className="container pt-6 sm:pt-6 pb-8">{children}</div>
    </div>
  );
};

export default ReservationsLayout; 