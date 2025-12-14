import HomeFreelancerCard from "./HomeFreelancerCard";

export default function TopFreelancers() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1700px] mx-40 px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-[#111318] font-inter text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight mb-12 lg:mb-23">
          Recommended Freelancers
        </h2>

        <div className="ml-40 flex flex-col gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <HomeFreelancerCard key={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
