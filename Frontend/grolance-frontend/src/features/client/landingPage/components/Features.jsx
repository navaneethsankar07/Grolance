export default function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_578_5188)">
            <path d="M25.0984 11.3373C25.6312 13.9522 25.2515 16.6706 24.0226 19.0394C22.7937 21.4082 20.7898 23.284 18.3452 24.3542C15.9006 25.4243 13.163 25.6241 10.5889 24.9201C8.0149 24.2161 5.75999 22.6509 4.20026 20.4856C2.64052 18.3203 1.87024 15.6858 2.01788 13.0213C2.16551 10.3568 3.22213 7.82341 5.01153 5.84368C6.80093 3.86394 9.21494 2.55748 11.851 2.14217C14.4871 1.72686 17.1858 2.22781 19.4973 3.56148" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.25 12.5278L13.6667 15.9445L25.0556 4.55557" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      ),
      title: "Verified Talent",
      description: "Access a pool of top talent across 700 categories",
    },
    {
      icon: (
        <svg width="48" height="58" viewBox="0 0 48 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.1 41.4L31.45 29H23.45L24.9 17.65L15.65 31H22.6L21.1 41.4ZM16 49L18 35H8L26 9H30L28 25H40L20 49H16Z" fill="#3B82F6"/>
        </svg>
      ),
      title: "Quality & Speed",
      description: "Get quality work done quickly and within budget",
    },
    {
      icon: (
        <svg width="48" height="58" viewBox="0 0 48 58" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28 31C26.3333 31 24.9167 30.4167 23.75 29.25C22.5833 28.0833 22 26.6667 22 25C22 23.3333 22.5833 21.9167 23.75 20.75C24.9167 19.5833 26.3333 19 28 19C29.6667 19 31.0833 19.5833 32.25 20.75C33.4167 21.9167 34 23.3333 34 25C34 26.6667 33.4167 28.0833 32.25 29.25C31.0833 30.4167 29.6667 31 28 31ZM14 37C12.9 37 11.9583 36.6083 11.175 35.825C10.3917 35.0417 10 34.1 10 33V17C10 15.9 10.3917 14.9583 11.175 14.175C11.9583 13.3917 12.9 13 14 13H42C43.1 13 44.0417 13.3917 44.825 14.175C45.6083 14.9583 46 15.9 46 17V33C46 34.1 45.6083 35.0417 44.825 35.825C44.0417 36.6083 43.1 37 42 37H14ZM18 33H38C38 31.9 38.3917 30.9583 39.175 30.175C39.9583 29.3917 40.9 29 42 29V21C40.9 21 39.9583 20.6083 39.175 19.825C38.3917 19.0417 38 18.1 38 17H18C18 18.1 17.6083 19.0417 16.825 19.825C16.0417 20.6083 15.1 21 14 21V29C15.1 29 16.0417 29.3917 16.825 30.175C17.6083 30.9583 18 31.9 18 33ZM40 45H6C4.9 45 3.95833 44.6083 3.175 43.825C2.39167 43.0417 2 42.1 2 41V19H6V41H40V45Z" fill="#3B82F6"/>
        </svg>
      ),
      title: "Secure Payments",
      description: "Only pay when you're happy with the work",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="font-poppins font-semibold text-[48px] md:text-[65px] leading-12 text-[#111827] text-center mb-16">
          Make it all happen with freelancers
        </h2>

        <div className="flex flex-col md:flex-row items-start justify-center gap-12 md:gap-24 mt-30">
          {features.map((feature, index) => (
            <div key={index} className="flex-1 flex flex-col items-center text-center max-w-[400px]">
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="font-poppins font-medium text-lg leading-7 text-[#1F2937] mb-2">
                {feature.title}
              </h3>
              <p className="font-poppins font-normal text-base leading-6 text-[#4B5563]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
