import { Search } from "lucide-react";
import { Link, replace } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative w-full px-4 sm:px-8 md:px-16 lg:px-20 xl:px-24 pt-4 pb-12 md:pb-16">
        <div className="relative w-full h-[500px] md:h-[635px] rounded-[80px] md:rounded-[100px] overflow-hidden">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/280b6ff0f948485c91943a6af802870b524ac937?width=3114"
            alt="Team collaboration"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-16 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 md:mb-6 max-w-4xl tracking-tight">
              Work With Experts Through a Seamless Process.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-2xl">
              A simple step-by-step workflow designed to help you get quality results faster.
            </p>
            <Link to={'/find-talents'} className="flex items-center gap-2 bg-[#3C83F6] hover:bg-[#2563EB] text-white px-6 py-3 md:px-7 md:py-3.5 rounded-lg font-bold text-base transition-colors">
              <Search className="w-5 h-5" />
              Find Talents
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-16 lg:px-20 xl:px-24 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-black text-[#0F172A] leading-tight mb-4 tracking-tight">
              How Our Platform Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[#475569] max-w-3xl mx-auto">
              A simple and secure way to hire talented freelancers and get your project delivered.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="space-y-0">
              <div className="flex gap-6 pb-8">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#3C83F6]/20 flex items-center justify-center mb-1">
                    <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.9546 23.7222V20.7326L19.3262 15.3854C19.472 15.2396 19.634 15.1343 19.8123 15.0695C19.9905 15.0046 20.1688 14.9722 20.347 14.9722C20.5415 14.9722 20.7278 15.0087 20.906 15.0816C21.0843 15.1545 21.2463 15.2639 21.3921 15.4097L22.2915 16.309C22.4211 16.4549 22.5224 16.6169 22.5953 16.7951C22.6682 16.9734 22.7046 17.1516 22.7046 17.3299C22.7046 17.5081 22.6722 17.6904 22.6074 17.8767C22.5426 18.0631 22.4373 18.2292 22.2915 18.375L16.9442 23.7222H13.9546ZM15.413 22.2639H16.3366L19.2776 19.2986L18.8401 18.8368L18.3783 18.3993L15.413 21.3403V22.2639ZM6.17687 23.7222C5.64214 23.7222 5.18439 23.5318 4.8036 23.151C4.42282 22.7703 4.23242 22.3125 4.23242 21.7778V6.22223C4.23242 5.68751 4.42282 5.22975 4.8036 4.84896C5.18439 4.46818 5.64214 4.27778 6.17687 4.27778H13.9546L19.788 10.1111V13.0278H17.8435V11.0833H12.9824V6.22223H6.17687V21.7778H12.0102V23.7222H6.17687ZM18.8401 18.8368L18.3783 18.3993L19.2776 19.2986L18.8401 18.8368Z" fill="#3C83F6"/>
                    </svg>
                  </div>
                  <div className="w-px h-16 bg-[#CBD5E1]" />
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">Post Your Project</h3>
                  <p className="text-base text-[#475569]">Describe your idea and set your budget.</p>
                </div>
              </div>

              <div className="flex gap-6 pb-8">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-px h-12 bg-[#CBD5E1]" />
                  <div className="w-10 h-10 rounded-full bg-[#3C83F6]/20 flex items-center justify-center mb-1">
                    <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.31543 21.7778V19.0555C1.31543 18.5046 1.45721 17.9983 1.74078 17.5365C2.02434 17.0746 2.40108 16.7222 2.87099 16.4792C3.87561 15.9768 4.89645 15.6001 5.93349 15.349C6.97052 15.0978 8.02376 14.9722 9.09321 14.9722C10.1627 14.9722 11.2159 15.0978 12.2529 15.349C13.29 15.6001 14.3108 15.9768 15.3154 16.4792C15.7853 16.7222 16.1621 17.0746 16.4456 17.5365C16.7292 17.9983 16.871 18.5046 16.871 19.0555V21.7778H1.31543ZM18.8154 21.7778V18.8611C18.8154 18.1481 18.6169 17.4635 18.2199 16.8073C17.823 16.151 17.2599 15.588 16.5307 15.118C17.3571 15.2153 18.1349 15.3814 18.864 15.6163C19.5932 15.8513 20.2738 16.1389 20.9057 16.4792C21.489 16.8032 21.9346 17.1638 22.2425 17.5608C22.5504 17.9577 22.7043 18.3912 22.7043 18.8611V21.7778H18.8154ZM9.09321 14C8.02376 14 7.10825 13.6192 6.34668 12.8576C5.58511 12.0961 5.20432 11.1805 5.20432 10.1111C5.20432 9.04166 5.58511 8.12615 6.34668 7.36458C7.10825 6.603 8.02376 6.22222 9.09321 6.22222C10.1627 6.22222 11.0782 6.603 11.8397 7.36458C12.6013 8.12615 12.9821 9.04166 12.9821 10.1111C12.9821 11.1805 12.6013 12.0961 11.8397 12.8576C11.0782 13.6192 10.1627 14 9.09321 14ZM18.8154 10.1111C18.8154 11.1805 18.4346 12.0961 17.6731 12.8576C16.9115 13.6192 15.996 14 14.9265 14C14.7483 14 14.5214 13.9797 14.246 13.9392C13.9705 13.8987 13.7437 13.8542 13.5654 13.8055C14.0029 13.287 14.3392 12.7118 14.5741 12.0799C14.8091 11.4479 14.9265 10.7917 14.9265 10.1111C14.9265 9.43055 14.8091 8.7743 14.5741 8.14235C14.3392 7.51041 14.0029 6.93518 13.5654 6.41666C13.7437 6.36805 13.9705 6.32349 14.246 6.28298C14.5214 6.24246 14.7483 6.22222 14.9265 6.22222C15.996 6.22222 16.9115 6.603 17.6731 7.36458C18.4346 8.12615 18.8154 9.04166 18.8154 10.1111Z" fill="#3C83F6"/>
                    </svg>
                  </div>
                  <div className="w-px h-12 bg-[#CBD5E1]" />
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">Get Matched With Freelancers</h3>
                  <p className="text-base text-[#475569]">Browse experts or receive recommended freelancers.</p>
                </div>
              </div>

              <div className="flex gap-6 pb-8">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-px h-12 bg-[#CBD5E1]" />
                  <div className="w-10 h-10 rounded-full bg-[#3C83F6]/20 flex items-center justify-center mb-1">
                    <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.73899 20.8055L2.2876 17.3542L3.64871 15.993L5.71468 18.059L9.84663 13.9271L11.2077 15.3125L5.73899 20.8055ZM5.73899 13.0278L2.2876 9.57638L3.64871 8.21526L5.71468 10.2812L9.84663 6.14929L11.2077 7.53471L5.73899 13.0278ZM12.982 18.8611V16.9167H21.732V18.8611H12.982ZM12.982 11.0833V9.13888H21.732V11.0833H12.982Z" fill="#3C83F6"/>
                    </svg>
                  </div>
                  <div className="w-px h-10 bg-[#CBD5E1]" />
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">Collaborate & Get Work Delivered</h3>
                  <p className="text-base text-[#475569]">Manage tasks and receive updates in a structured workspace.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-px h-10 bg-[#CBD5E1]" />
                  <div className="w-10 h-10 rounded-full bg-[#3C83F6]/20 flex items-center justify-center">
                    <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.9543 14.9722C13.1441 14.9722 12.4555 14.6887 11.8883 14.1215C11.3212 13.5544 11.0377 12.8657 11.0377 12.0555C11.0377 11.2454 11.3212 10.5567 11.8883 9.98958C12.4555 9.42245 13.1441 9.13888 13.9543 9.13888C14.7645 9.13888 15.4532 9.42245 16.0203 9.98958C16.5874 10.5567 16.871 11.2454 16.871 12.0555C16.871 12.8657 16.5874 13.5544 16.0203 14.1215C15.4532 14.6887 14.7645 14.9722 13.9543 14.9722ZM7.14876 17.8889C6.61404 17.8889 6.15629 17.6985 5.7755 17.3177C5.39471 16.9369 5.20432 16.4792 5.20432 15.9444V8.16666C5.20432 7.63194 5.39471 7.17418 5.7755 6.7934C6.15629 6.41261 6.61404 6.22222 7.14876 6.22222H20.7599C21.2946 6.22222 21.7524 6.41261 22.1331 6.7934C22.5139 7.17418 22.7043 7.63194 22.7043 8.16666V15.9444C22.7043 16.4792 22.5139 16.9369 22.1331 17.3177C21.7524 17.6985 21.2946 17.8889 20.7599 17.8889H7.14876ZM9.09321 15.9444H18.8154C18.8154 15.4097 19.0058 14.952 19.3866 14.5712C19.7674 14.1904 20.2252 14 20.7599 14V10.1111C20.2252 10.1111 19.7674 9.92071 19.3866 9.53992C19.0058 9.15914 18.8154 8.70138 18.8154 8.16666H9.09321C9.09321 8.70138 8.90281 9.15914 8.52203 9.53992C8.14124 9.92071 7.68349 10.1111 7.14876 10.1111V14C7.68349 14 8.14124 14.1904 8.52203 14.5712C8.90281 14.952 9.09321 15.4097 9.09321 15.9444ZM19.7877 21.7778H3.25987C2.72515 21.7778 2.2674 21.5874 1.88661 21.2066C1.50582 20.8258 1.31543 20.368 1.31543 19.8333V9.13888H3.25987V19.8333H19.7877V21.7778Z" fill="#3C83F6"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">Review & Release Payment</h3>
                  <p className="text-base text-[#475569]">Accept the final delivery and release secure escrow payment.</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg bg-white p-4">
              <div className="rounded-lg overflow-hidden aspect-[4/3]">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/0db69197b8aa14932d7eb5d1c1ae6d80cd78a4cc?width=1077"
                  alt="Team collaboration on project"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-16 lg:px-20 xl:px-24 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-20 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Ready to bring your idea to life?
            </h2>
            <p className="text-base sm:text-lg text-[#475569] mb-8 max-w-2xl mx-auto">
              Post a project today and connect with professional freelancers who can get the job done.
            </p>
            <Link to='/create-project' replace={true} className="bg-[#3C83F6] hover:bg-[#2563EB] text-white px-6 py-3 md:px-7 md:py-3.5 rounded-lg font-bold text-base transition-colors">
              Start Your Project Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
