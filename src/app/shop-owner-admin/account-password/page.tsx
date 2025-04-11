"use client";

import React from "react";
import SharedPasswordPage from "@/components/SharedPasswordPage";
import AdminPageLayout from "@/components/AdminPageLayout";

const ShopOwnerAccountPasswordPage = () => {
  return (
    <AdminPageLayout userType="shopOwner">
      <SharedPasswordPage userType="shopOwner" />
    </AdminPageLayout>
  );
};

export default ShopOwnerAccountPasswordPage; 