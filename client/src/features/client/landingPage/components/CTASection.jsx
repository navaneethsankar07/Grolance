import { useModal } from "../../../../hooks/modal/useModalStore";

export default function CTASection() {
  const {openModal} = useModal()
return (
    <section className="py-20 px-4 md:px-8 mb-20">
      <div className="max-w-[1600px] mx-auto text-center">
        <h2 className="font-grotesk font-bold text-[40px] md:text-[51px] leading-5 text-black mb-16">
          Ready to Start Your Project?
        </h2>

        <div className="flex justify-center">
          <button 
            onClick={() => openModal("signup")} 
            className="w-40 h-13 px-8 py-3 text-lg leading-7 font-poppins font-medium rounded-lg bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90 transition-colors cursor-pointer"
          >
            Join now
          </button>
        </div>
      </div>
    </section>
  );
}
