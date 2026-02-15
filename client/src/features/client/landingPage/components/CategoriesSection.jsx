export default function CategoriesSection() {
  const categories = [
    {
      title: "Web Development",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 18L22 12L16 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6L2 12L8 18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Design & Creative",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.7071 21.293C15.5196 21.4805 15.2653 21.5858 15.0001 21.5858C14.7349 21.5858 14.4806 21.4805 14.2931 21.293L12.7071 19.707C12.5196 19.5195 12.4143 19.2652 12.4143 19C12.4143 18.7348 12.5196 18.4805 12.7071 18.293L18.2931 12.707C18.4806 12.5195 18.7349 12.4142 19.0001 12.4142C19.2653 12.4142 19.5196 12.5195 19.7071 12.707L21.2931 14.293C21.4806 14.4805 21.5859 14.7348 21.5859 15C21.5859 15.2652 21.4806 15.5195 21.2931 15.707L15.7071 21.293Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 13L16.625 6.12601C16.5876 5.93899 16.4975 5.76656 16.3653 5.62907C16.2331 5.49157 16.0644 5.39475 15.879 5.35001L3.23501 2.02801C3.06843 1.98773 2.89431 1.99094 2.72933 2.03733C2.56436 2.08371 2.41407 2.17172 2.29289 2.29289C2.17172 2.41407 2.08371 2.56436 2.03733 2.72933C1.99094 2.89431 1.98773 3.06843 2.02801 3.23501L5.35001 15.879C5.39475 16.0644 5.49157 16.2331 5.62907 16.3653C5.76656 16.4975 5.93899 16.5876 6.12601 16.625L13 18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.30005 2.3L9.58605 9.586" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11 13C12.1046 13 13 12.1046 13 11C13 9.89543 12.1046 9 11 9C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Digital Marketing",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 11L21 6V18L3 14V11Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M11.6 16.8C11.4949 17.1808 11.3159 17.5372 11.0731 17.8489C10.8303 18.1605 10.5285 18.4213 10.1849 18.6163C9.84132 18.8113 9.4627 18.9367 9.07065 18.9854C8.6786 19.0341 8.28081 19.0051 7.89997 18.9C7.51914 18.7949 7.16273 18.6159 6.85109 18.3731C6.53945 18.1303 6.27868 17.8285 6.08368 17.4849C5.88867 17.1413 5.76325 16.7627 5.71457 16.3707C5.6659 15.9786 5.69492 15.5808 5.79997 15.2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Writing & Translation",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.376 3.62199C16.7741 3.2239 17.314 3.00026 17.877 3.00026C18.44 3.00026 18.9799 3.2239 19.378 3.62199C19.7761 4.02008 19.9997 4.56001 19.9997 5.12299C19.9997 5.68598 19.7761 6.2259 19.378 6.62399L7.36798 18.635C7.13007 18.8729 6.836 19.0469 6.51298 19.141L3.64098 19.979C3.55493 20.0041 3.46372 20.0056 3.37689 19.9834C3.29006 19.9611 3.2108 19.9159 3.14742 19.8525C3.08404 19.7892 3.03887 19.7099 3.01662 19.6231C2.99437 19.5363 2.99588 19.445 3.02098 19.359L3.85898 16.487C3.9532 16.1643 4.12722 15.8706 4.36498 15.633L16.376 3.62199Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "AI & Data Science",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.0001 5C12.0013 4.60003 11.9224 4.20386 11.7683 3.8348C11.6141 3.46574 11.3877 3.13123 11.1023 2.85095C10.817 2.57067 10.4785 2.35027 10.1067 2.20273C9.73497 2.05519 9.33745 1.98348 8.93757 1.99181C8.53769 2.00015 8.14351 2.08836 7.77821 2.25127C7.41292 2.41417 7.08389 2.64848 6.81048 2.94041C6.53706 3.23233 6.32478 3.57599 6.18613 3.95115C6.04747 4.32632 5.98523 4.72543 6.00307 5.125C5.41528 5.27614 4.86958 5.55905 4.40731 5.95231C3.94503 6.34557 3.57831 6.83887 3.33492 7.39485C3.09152 7.95082 2.97783 8.5549 3.00246 9.16131C3.02709 9.76773 3.18939 10.3606 3.47707 10.895C2.97125 11.3059 2.5735 11.8342 2.31841 12.4339C2.06333 13.0336 1.95863 13.6866 2.01344 14.336C2.06824 14.9854 2.28089 15.6116 2.63288 16.16C2.98487 16.7085 3.46554 17.1627 4.03307 17.483C3.96299 18.0252 4.00481 18.5761 4.15596 19.1015C4.30711 19.627 4.56437 20.1158 4.91186 20.538C5.25935 20.9601 5.68968 21.3065 6.17629 21.5558C6.6629 21.805 7.19545 21.9519 7.74105 21.9873C8.28665 22.0227 8.83372 21.9459 9.34846 21.7616C9.86321 21.5773 10.3347 21.2894 10.7338 20.9158C11.133 20.5421 11.4512 20.0906 11.669 19.5891C11.8868 19.0876 11.9995 18.5467 12.0001 18V5Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 13C9.83956 12.7047 10.5727 12.167 11.1067 11.455C11.6407 10.743 11.9515 9.88867 12 9" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.00293 5.125C6.0227 5.60873 6.15926 6.0805 6.40093 6.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.47705 10.896C3.65999 10.747 3.85575 10.6145 4.06205 10.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.99996 18C5.31079 18.0003 4.63323 17.8226 4.03296 17.484" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 13H16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18H18C18.5304 18 19.0391 18.2107 19.4142 18.5858C19.7893 18.9609 20 19.4696 20 20V21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8H20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 8V5C16 4.46957 16.2107 3.96086 16.5858 3.58579C16.9609 3.21071 17.4696 3 18 3" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Video & Animation",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 13L21.223 16.482C21.2983 16.5321 21.3858 16.5608 21.4761 16.5652C21.5664 16.5695 21.6563 16.5492 21.736 16.5065C21.8157 16.4638 21.8824 16.4003 21.9289 16.3228C21.9754 16.2452 22 16.1564 22 16.066V7.87C22 7.78202 21.9768 7.69559 21.9328 7.61945C21.8887 7.5433 21.8253 7.48012 21.7491 7.4363C21.6728 7.39247 21.5863 7.36955 21.4983 7.36985C21.4103 7.37015 21.324 7.39366 21.248 7.438L16 10.5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 6H4C2.89543 6 2 6.89543 2 8V16C2 17.1046 2.89543 18 4 18H14C15.1046 18 16 17.1046 16 16V8C16 6.89543 15.1046 6 14 6Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Music & Audio",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18V5L21 3V16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 19C19.6569 19 21 17.6569 21 16C21 14.3431 19.6569 13 18 13C16.3431 13 15 14.3431 15 16C15 17.6569 16.3431 19 18 19Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Business",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 20V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 6H4C2.89543 6 2 6.89543 2 8V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-white mb-30">
      <div className="max-w-[1728px] mx-auto">
        <h2 className="font-grotesk font-bold text-[40px] md:text-[65px] leading-10 tracking-[-0.9px] uppercase text-[#0D191C] text-center mb-16">
          Browse By Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-14 mt-30">
          {categories.map((category) => (
            <div
              key={category.title}
              className="flex flex-col items-center justify-center h-[166px] p-6 rounded-3xl border border-[#F3F4F6] shadow-[0_2px_4px_-2px_rgba(229,231,235,0.5),0_4px_6px_-1px_rgba(229,231,235,0.5)] hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl mb-6">
                {category.icon}
              </div>
              <h3 className="font-inter font-bold text-2xl leading-7 text-[#1F2937] text-center">
                {category.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
