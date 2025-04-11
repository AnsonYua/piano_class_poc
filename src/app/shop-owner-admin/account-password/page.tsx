"use client";

import React from "react";
import SharedPasswordPage from "@/components/SharedPasswordPage";
import ClientAccountLayout from "@/app/(account-pages)/(components)/ClientAccountLayout";

const ShopOwnerAccountPasswordPage = () => {
  return (
    <ClientAccountLayout role="shop-owner">
      <SharedPasswordPage userType="shopOwner" />
    </ClientAccountLayout>
  );
};

export default ShopOwnerAccountPasswordPage; 