import { ArrowRight } from 'lucide-react'
import { useSwitchRole } from '../homePageMutation';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function JoinNow() {
  const { mutateAsync } = useSwitchRole();
  const user = useSelector(state=>state.auth.user)
  const navigate = useNavigate()
  const handleSwitchToFreelancer = async() => {
  if (user?.is_freelancer) {
    await mutateAsync({ role: "freelancer" });
    navigate("/freelancer");
  } else {
    
    navigate('/onBoarding')
  }
};
  return (
    <section className="py-12 mb-15 sm:py-16 bg-[#EFF6FF]">
        <div className="max-w-[1728px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[#111827] font-inter text-3xl sm:text-4xl lg:text-[50px] font-bold leading-tight mb-4 sm:mb-6">
            Freelancer?
          </h2>
          <p className="text-[#4B5563] font-inter text-lg sm:text-xl lg:text-[25px] leading-relaxed mb-4 sm:mb-6">
            Join thousands of professionals finding work on our platform.
          </p>
          <button onClick={handleSwitchToFreelancer} className="text-primary font-inter text-sm sm:text-[20px] font-semibold inline-flex items-center gap-1 hover:underline">
             Switch To Freelancer<ArrowRight className='text-lg font-extrabold' strokeWidth={3}/>
          </button>
        </div>
      </section>
  )
}

export default JoinNow