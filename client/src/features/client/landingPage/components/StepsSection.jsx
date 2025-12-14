export default function StepsSection() {
  const steps = [
    {
      number: 1,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 17.3333V28" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.33338 19.8653C4.34277 18.8532 3.59547 17.6289 3.14809 16.2852C2.70071 14.9415 2.56499 13.5136 2.75119 12.1097C2.9374 10.7058 3.44065 9.36265 4.22284 8.18203C5.00502 7.00141 6.04562 6.01427 7.26582 5.29539C8.48602 4.5765 9.85381 4.14472 11.2656 4.03276C12.6774 3.92079 14.0961 4.13157 15.4144 4.64913C16.7327 5.1667 17.9159 5.97747 18.8744 7.02004C19.8329 8.0626 20.5415 9.30963 20.9467 10.6667H23.3334C24.6207 10.6665 25.874 11.0804 26.908 11.8472C27.9421 12.6141 28.7021 13.6931 29.0757 14.9251C29.4494 16.157 29.417 17.4764 28.9831 18.6885C28.5493 19.9005 27.7372 20.9409 26.6667 21.656" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.6667 22.6666L16.0001 17.3333L21.3334 22.6666" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Post Your Project",
      description: "Describe your project, budget, and timeline. It's free to post and takes minutes.",
    },
    {
      number: 2,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 28L22.2134 22.2133" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.6667 25.3333C20.5577 25.3333 25.3333 20.5577 25.3333 14.6667C25.3333 8.77563 20.5577 4 14.6667 4C8.77563 4 4 8.77563 4 14.6667C4 20.5577 8.77563 25.3333 14.6667 25.3333Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Choose Talent",
      description: "Review proposals, portfolios, and ratings. Pick the perfect expert for your needs.",
    },
    {
      number: 3,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.068 13.3333C29.6769 16.3217 29.243 19.4285 27.8385 22.1357C26.434 24.8429 24.1439 26.9867 21.35 28.2097C18.5562 29.4328 15.4275 29.661 12.4857 28.8565C9.54397 28.0519 6.96693 26.2632 5.18438 23.7885C3.40183 21.3139 2.52151 18.303 2.69023 15.2578C2.85895 12.2127 4.06652 9.31744 6.11155 7.05488C8.15657 4.79232 10.9155 3.29923 13.9281 2.82459C16.9407 2.34995 20.0251 2.92247 22.6667 4.44665" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14.6666L16 18.6666L29.3333 5.33331" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Get It Done",
      description: "Collaborate securely. Payment is released only when you approve the work.",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-grotesk font-bold text-[45px] md:text-[65px] leading-[45px] tracking-[-1px] text-[#141414] mb-4">
            Simple Steps to Success
          </h2>
          <p className="font-grotesk font-normal text-2xl leading-6 text-[#141414]">
            Follow these steps to get started on your project.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-center gap-12 md:gap-24 max-w-[1400px] mx-auto mt-30">
          {steps.map((step) => (
            <div key={step.number} className="flex-1 flex flex-col items-center text-center max-w-[320px]">
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full border border-[#F3F4F6] shadow-[0_4px_6px_-4px_rgba(229,231,235,0.5),0_10px_15px_-3px_rgba(229,231,235,0.5)] flex items-center justify-center bg-white">
                  {step.icon}
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full border-4 border-white bg-[#3B82F6] flex items-center justify-center">
                  <span className="font-inter font-bold text-xs text-white">{step.number}</span>
                </div>
              </div>

              <h3 className="font-inter font-bold text-[17px] leading-7 text-[#1F2937] mb-3">
                {step.title}
              </h3>
              <p className="font-inter font-medium text-sm leading-[26px] text-[#4B5563]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
