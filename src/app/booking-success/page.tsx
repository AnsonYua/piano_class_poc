"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/shared/ButtonPrimary";

const BookingSuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-3xl font-medium">預約成功！</h1>
              <p className="text-gray-500 mt-2">您的琴房預約已確認</p>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-gray-600">
                您可以在您的帳戶中查看預約詳情。我們已向您發送了確認電郵。
              </p>
            </div>
            
            <div className="flex justify-center">
              <ButtonPrimary onClick={() => router.push("/")}>
                返回首頁
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage; 