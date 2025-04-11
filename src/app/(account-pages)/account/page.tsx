'use client';

import React from "react";
import SharedAccountPage from "@/components/SharedAccountPage";
import { UserTypeUtils } from "@/utils/UserTypeUtils";

const AccountPage = () => {
  return <SharedAccountPage userType="student" />;
};

export default AccountPage;
