import React from 'react';
import { useRouter } from 'next/router';
import ButtonPrimary from '../ButtonPrimary';

interface SignupSuccessProps {
  userType: 'teacher' | 'shop-owner';
}

const SignupSuccess: React.FC<SignupSuccessProps> = ({ userType }) => {
  const router = useRouter();

  const handleContinue = () => {
    router.push(`/${userType}-admin/login`);
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <svg
          className="mx-auto h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-4">註冊成功！</h2>
      <p className="text-gray-600 mb-8">
        您的帳戶已成功創建。現在您可以登錄並開始使用我們的服務。
      </p>

      <ButtonPrimary onClick={handleContinue}>
        前往登錄
      </ButtonPrimary>
    </div>
  );
};

export default SignupSuccess; 