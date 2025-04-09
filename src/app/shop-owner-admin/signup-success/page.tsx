'use client';

import React from 'react';
import SignupSuccess from '@/components/auth/SignupSuccess';
import Layout from '@/components/Layout';

export default function ShopOwnerSignupSuccessPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <SignupSuccess userType="shop-owner" />
      </div>
    </Layout>
  );
} 