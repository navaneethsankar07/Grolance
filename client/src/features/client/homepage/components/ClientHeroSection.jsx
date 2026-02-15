import { Search } from "lucide-react";

export default function ClientHeroSection() {
  return (
    <div className="w-full px-4 md:px-8 mt-8">
      <section className="relative mx-auto w-full max-w-[1546px] overflow-hidden rounded-[40px] md:rounded-[100px]">
        <img
          src="hero-banner.jpg"
          alt="Hero background"
          className="h-[500px] w-full object-cover md:h-[722px]"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex max-w-[850px] flex-col items-center gap-6 px-6 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-[-1.2px] text-white md:text-5xl md:leading-12">
              Find the Right Freelancer for Your Project
            </h1>
            <p className="text-base leading-[24px] text-gray-200 md:text-lg md:leading-[27px]">
              Browse thousands of skilled professionals across hundreds of categories.
            </p>
            <button className="flex h-12 md:h-14 items-center justify-center gap-2 rounded-[13px] border border-[#135BEC] bg-primary px-5 md:px-7 transition-colors hover:bg-[#2563EB]">
              <Search className="h-5 w-5 md:h-6 md:w-6 text-white" />
              <span className="text-lg md:text-2xl font-bold leading-5 text-white">Find Talents</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}