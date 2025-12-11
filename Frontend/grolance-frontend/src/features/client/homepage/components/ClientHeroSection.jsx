import { Search } from "lucide-react";

export default function ClientHeroSection() {
  return (
    <section className="relative mx-auto mt-8 w-full max-w-[1546px] overflow-hidden rounded-[100px]">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/7698e59ab3a82e2b519c51d34120ccb7d1cc4710?width=3092"
        alt="Hero background"
        className="h-[500px] w-full object-cover md:h-[722px]"
      />
      <div className="absolute inset-0 flex items-center justify-center rounded-[100px] bg-black/50">
        <div className="flex max-w-[850px] flex-col items-center gap-6 px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-[-1.2px] text-white md:text-5xl md:leading-12">
            Find the Right Freelancer for Your Project
          </h1>
          <p className="text-lg leading-[27px] text-gray-200">
            Browse thousands of skilled professionals across hundreds of categories.
          </p>
          <button className="flex h-14 items-center justify-center gap-2 rounded-[13px] border border-[#135BEC] bg-[#3B82F6] px-7 transition-colors hover:bg-[#2563EB]">
            <Search className="h-6 w-6 text-white" />
            <span className="text-2xl font-bold leading-5 text-white">Find Talents</span>
          </button>
        </div>
      </div>
    </section>
  );
}
