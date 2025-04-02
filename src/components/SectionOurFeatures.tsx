import React, { FC } from "react";
import rightImgPng from "@/images/our-features.png";
import Image, { StaticImageData } from "next/image";
import Badge from "@/shared/Badge";

export interface SectionOurFeaturesProps {
  className?: string;
  rightImg?: StaticImageData;
  type?: "type1" | "type2";
}

const SectionOurFeatures: FC<SectionOurFeaturesProps> = ({
  className = "lg:pt-0 lg:pb-8",
  rightImg = rightImgPng,
  type = "type1",
}) => {
  return (
    <div
      className={`nc-SectionOurFeatures relative flex flex-col items-center ${
        type === "type1" ? "lg:flex-row" : "lg:flex-row-reverse"
      } ${className}`}
      data-nc-id="SectionOurFeatures"
      id="secondary-content-container"

    >
      {
        /*
      <div className="flex-grow">
        <Image src={rightImg} alt="" />
      </div>
      */
      }
      <div
        className={`flex-shrink-0 mt-10 lg:mt-0 w-full ${
          type === "type1" ? "lg:pl-16" : "lg:pr-16"
        }`}
         id="secondary-content-banner"
      >
        {/*
        <span className="uppercase text-sm  tracking-widest">
          核心理念
        </span>
        <span className="block mt-5 text-neutral-500 dark:text-neutral-400">
        鋼琴 Go! 是一個專為家長與孩子設計的創新鋼琴教育平台，旨在透過標準化教學模組和AI技術支持，打破傳統學琴對特定導師與固定時間的依賴，讓學琴變得更加靈活、高效且無壓力。
        </span>
        */}
        <ul className="space-y-0 mt-0">
        
          <li className="space-y-4">
            <span className="block text-3xl font-semibold text-center" id="featureTitle">
            家長需要做什麼？如何開始？
            </span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mt-8 mb-8 text-neutral-500 dark:text-neutral-400 pt-4 pb-10 lg:pt-8 lg:pb-8">
              <div className="mx-4 lg:mx-4 lg:p-4">
                <span className="font-semibold text-lg lg:text-xl">1.註冊帳號</span><br/>
                註冊帳號，輸入孩子的基本資料（如年齡與學琴經驗）。
              </div>
              <div className="mx-4 lg:mx-4 lg:p-4">
                <span className="font-semibold text-lg lg:text-xl">2.參加評估課程</span><br/>
                安排孩子參加評估課程，我們會了解他的鋼琴基礎，並為他分配學習等級。
              </div>
              <div className="mx-4 lg:mx-4 lg:p-4">
                <span className="font-semibold text-lg lg:text-xl">3.預約課程</span><br/>
                根據您的日程自由選擇上課時間，完成課程預約。系統會自動分配導師，簡單快捷。
              </div>
              <div className="mx-4 lg:mx-4 lg:p-4">
                <span className="font-semibold text-lg lg:text-xl">4.查看學習進度</span><br/>
                每堂課後，AI會生成學習報告，讓家長和導師掌握孩子的學習情況。
              </div>
              <div className="mx-4 lg:mx-4 lg:p-4">
                <span className="font-semibold text-lg lg:text-xl">5.參加定期評估考試</span><br/>
                AI會安排定期考試，檢測孩子的學習成果，並自動調整學習計劃。
              </div>
            </div>
          </li>
          
        </ul>
      </div>
    </div>
  );
};

export default SectionOurFeatures;
