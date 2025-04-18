"use client";

import React from "react";
import SharedAccountPage from "@/components/SharedAccountPage";
import AdminPageLayout from "@/components/AdminPageLayout";

const ShopOwnerAccountPage = () => {
  return (
    <AdminPageLayout userType="shopOwner">
      <SharedAccountPage userType="shopOwner" />
    </AdminPageLayout>
  );
};

export default ShopOwnerAccountPage; 