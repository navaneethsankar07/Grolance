import { ArrowRight } from 'lucide-react'
import { useSwitchRole } from '../homePageMutation';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function JoinNow() {
  const { mutateAsync } = useSwitchRole();
  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()

  const handleSwitchToFreelancer = async () => {
    if (user?.is_freelancer) {
      await mutateAsync({ role: "freelancer" });
      navigate("/freelancer");
    } else {
      navigate('/onBoarding')
    }
  };

  return (
    <div className="w-full px-4 md:px-8 mb-12 sm:mb-20">
      <section className="py-12 sm:py-20 bg-[#EFF6FF] rounded-[32px] md:rounded-[60px]">
        <div className="max-w-[1728px] mx-auto px-6 text-center">
          <h2 className="text-[#111827] font-inter text-3xl sm:text-4xl lg:text-5xl xl:text-[50px] font-bold leading-tight mb-3 sm:mb-4">
            Freelancer?
          </h2>
          <p className="text-[#4B5563] font-inter text-base sm:text-lg lg:text-xl xl:text-[25px] leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of professionals finding work on our platform.
          </p>
          <button 
            onClick={handleSwitchToFreelancer} 
            className="text-primary font-inter text-base sm:text-xl font-bold inline-flex items-center gap-2 hover:underline group transition-all"
          >
             Switch To Freelancer
             <ArrowRight 
               className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" 
               strokeWidth={3}
             />
          </button>
        </div>
      </section>
    </div>
  )
}

export default JoinNow;