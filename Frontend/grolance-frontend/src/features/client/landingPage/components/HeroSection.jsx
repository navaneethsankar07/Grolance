export default function HeroSection() {
  const categories = [
    "Web Development",
    "UI/UX",
    "Branding",
    "Mobile App",
    "Content Writing",
  ];

  return (
    <section className="pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 max-w-[656px]">
            <h1 className="font-grotesk font-bold text-[42px] md:text-[60px] leading-none tracking-[-3px] mb-6">
              <span className="text-[#1A1A1A]">Hire World-Class</span>
              <br />
              <span className="bg-linear-to-r from-[#8A2BE2] to-[#00BFFF] bg-clip-text text-transparent">Freelancers</span>
              <span className="text-[#1A1A1A]"> for Any</span>
              <br />
              <span className="text-[#1A1A1A]">Project</span>
            </h1>

            <p className="text-[#6C757D] font-grotesk font-bold text-lg leading-7 mb-6">
              Access a global network of vetted experts and bring your ideas to life.
            </p>

            <div className="flex flex-wrap gap-4">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex h-8 px-4 items-center justify-center rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A] font-grotesk font-bold text-sm leading-5"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 max-w-[957px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/d980d2e1ac6b36e1ae1e2899e34972477b352239?width=1914"
              alt="Team collaborating"
              className="w-full h-auto rounded-[40px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
