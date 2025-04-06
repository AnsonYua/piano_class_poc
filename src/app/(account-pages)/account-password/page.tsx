import React from "react";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";

const AccountPass = () => {
  return (
    <div className="nc-AccountPage min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-2xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          {/* HEADING */}
          <h2 className="text-3xl font-semibold text-center mb-6">修改密碼</h2>
          <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 mx-auto mb-8"></div>
          
          <div className="space-y-6">
            <div>
              <Label>目前密碼</Label>
              <Input type="password" className="mt-1.5" placeholder="請輸入目前密碼" />
            </div>
            <div>
              <Label>新密碼</Label>
              <Input type="password" className="mt-1.5" placeholder="請輸入新密碼" />
            </div>
            <div>
              <Label>確認新密碼</Label>
              <Input type="password" className="mt-1.5" placeholder="請輸入新密碼" />
            </div>
            <div className="pt-2">
              <ButtonPrimary className="w-full">確認修改</ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPass;
