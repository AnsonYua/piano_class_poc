'use client';

import React, { FC } from "react";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import { UserTypeUtils, UserType } from "@/utils/UserTypeUtils";
import { usePathname } from "next/navigation";

export interface SharedAccountPageProps {
  userType?: UserType;
}

const SharedAccountPage: FC<SharedAccountPageProps> = ({ userType }) => {
  const pathname = usePathname();
  const currentUserType = userType || UserTypeUtils.getUserTypeFromPathname(pathname);
  
  return (
    <div className="nc-AccountPage max-w-sm mx-auto bg-white rounded-lg shadow-sm p-6">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold text-center mb-4">帳號資料</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-6"></div>
      
      <div className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          {/* Avatar section */}
          <div className="relative rounded-full overflow-hidden flex">
            <Avatar sizeClass="w-32 h-32" />
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label>稱呼</Label>
            <Input className="mt-1.5" defaultValue="Eden Tuan" />
          </div>
          
          {/* Additional fields can be added here based on user type */}
          
          <ButtonPrimary className="w-full">更新資料</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default SharedAccountPage; 