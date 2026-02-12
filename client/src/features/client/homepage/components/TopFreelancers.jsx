import { Loader2 } from "lucide-react";
import { useRecommendedFreelancers } from "../homePageQueries";
import HomeFreelancerCard from "./HomeFreelancerCard";

export default function TopFreelancers() {
  const {data, isLoading} = useRecommendedFreelancers()
  console.log(data);
  
  console.log(data);
  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-medium">Curating top experts for you...</p>
      </div>
    );
  }
  
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1700px] mx-40 px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-[#111318] font-inter text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight mb-12 lg:mb-23">
          Recommended Freelancers
        </h2>

        <div className="flex flex-col gap-6 lg:gap-8">
          {data?.map((freelancer) => (
            <HomeFreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
          
          {data?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No recommendations available at the moment.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
