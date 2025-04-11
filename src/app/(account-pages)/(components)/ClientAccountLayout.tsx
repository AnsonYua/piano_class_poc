"use client";

import React, { FC, ReactNode } from "react";
import { AccountNavigation } from "./Nav";
import { UserRole } from "./Nav";

interface ClientAccountLayoutProps {
  children: ReactNode;
  role: UserRole;
}

const ClientAccountLayout: FC<ClientAccountLayoutProps> = ({ children, role }) => {
  return (
    <div className="nc-AccountLayout bg-neutral-50 dark:bg-neutral-900">
      <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-6">
          <div className="border-b border-neutral-200 dark:border-neutral-700 mb-6">
            <AccountNavigation role={role} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ClientAccountLayout; 