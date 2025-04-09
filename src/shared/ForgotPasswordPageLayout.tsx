import React from 'react';

interface ForgotPasswordPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const ForgotPasswordPageLayout: React.FC<ForgotPasswordPageLayoutProps> = ({ title, children }) => {
  return (
    <div className="nc-PageForgotPassword bg-gray-50 dark:bg-neutral-900">
      <div className="container max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8">
          <h2 className="my-5 hidden md:flex items-center text-3xl leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPageLayout; 