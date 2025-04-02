import React, { FC } from "react";
import imagePng from "@/images/homePageBanner1.png";
import HeroSearchForm from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface SectionHeroProps {
  className?: string;
}

const SectionHero: FC<SectionHeroProps> = ({ className = "" }) => {
  return (
    <div
      className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-8 lg:pb-64 xl:pr-14 lg:mr-10 xl:mr-0">
          <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl !leading-[114%] ">
          「學琴 Go!」
          </h2>
          <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
          為親子打造全新鋼琴學習體驗，運用標準化教學模組和AI技術，擺脫對固定老師與時間的依賴，讓學琴更自由、高效、無壓力。
          </span>
          <ButtonPrimary href="/listing-stay-map" sizeClass="px-5 py-4 sm:px-7">
            立即預約學琴
          </ButtonPrimary>
        </div>
        <div className="flex-grow lg:h-[530px]" id="hero-image">
          <Image className="w-full" src={imagePng} alt="hero" priority />
        </div>
      </div>

      <div className="hidden lg:block z-10 mb-12 lg:mb-0 lg:-mt-40 w-full">
        <HeroSearchForm />
      </div>
    </div>
  );
};

export default SectionHero;
