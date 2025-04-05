"use client";

import React, { FC, useState } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Route } from "@/routers/types";

export interface PageSignUpProps {}

const PageSignUp: FC<PageSignUpProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("auth_token", "demo_token");
    router.push("/" as Route);
  };

  return (
    <div className={`nc-PageSignUp`}>
      <div className="container mb-24 lg:mb-32">
        {
        <h2 className="my-5 hidden md:flex items-center text-3xl leading-[115%] md:text-3xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          創建帳戶
        </h2>}
        <div className="my-2 flex md:hidden items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          <br/>
        </div>
        <div className="max-w-md mx-auto space-y-6">
          {/* Add hidden dummy fields */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            {/* Hidden Dummy Input Fields */}
            <span className="block text-neutral-700 dark:text-neutral-300 font-bold">
              請填寫以下資料：
            </span>
            <input
              type="text"
              name="fake-email"
              autoComplete="off"
              style={{ display: "none" }}
            />
            <input
              type="password"
              name="fake-password"
              autoComplete="off"
              style={{ display: "none" }}
            />

            {/* Actual Input Fields */}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                電話號碼 (必須可接收WhatsApp的號碼)
              </span>
              <Input
                type="tel"
                placeholder="請輸入電話號碼"
                className="mt-1"
                value={email}
                autoComplete="new-phone" // Use a non-standard autocomplete value
                name="random-phone-field" // Use a random name
                pattern="[5698][0-9]{7}"
                maxLength={8}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "");
                  setEmail(onlyNumbers);
                }}
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                密碼
              </span>
              <Input
                type="password"
                placeholder="請輸入密碼"
                className="mt-1"
                value={password}
                autoComplete="new-password" // Use a non-standard autocomplete value
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <ButtonPrimary type="submit">提交</ButtonPrimary>
          </form>
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            已有帳號?{" "}
            <Link href={"/login" as Route} className="font-semibold underline">
              登入
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;