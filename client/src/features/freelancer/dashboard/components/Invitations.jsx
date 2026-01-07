import { ChevronRight } from 'lucide-react'
import React from 'react'

function Invitations() {
  return (
    <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-[#F3F4F6]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[25px] font-semibold text-[#1E293B] leading-7" style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}>
                Pending Invitations
              </h2>
              <button className="text-sm font-medium text-[#4F46E5] hover:underline" style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}>
                View All
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { title: "Senior UI/UX Designer Needed", company: "TechFlow Solutions", time: "Sent 2 hours ago", icon: "design" },
                { title: "Frontend React Developer", company: "GreenLeaf Corp", time: "Sent yesterday", icon: "code" },
                { title: "Senior UI/UX Designer Needed", company: "TechFlow Solutions", time: "Sent 2 hours ago", icon: "design" },
              ].map((invitation, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0]">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${index === 1 ? 'bg-[#DCFCE7]' : 'bg-[#E0E7FF]'}`}>
                      {index === 1 ? (
                        <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.12111 19.8335L2.28778 14.0002L8.12111 8.16683L9.50653 9.55225L5.03431 14.0245L9.48223 18.4724L8.12111 19.8335ZM15.8989 19.8335L14.5135 18.4481L18.9857 13.9759L14.5378 9.52794L15.8989 8.16683L21.7322 14.0002L15.8989 19.8335Z" fill="#16A34A"/>
                        </svg>
                      ) : (
                        <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.89889 12.9791L10.9892 10.8645L9.62806 9.47911L8.55861 10.5486L7.1975 9.18745L8.24264 8.118L7.14889 7.02425L5.03431 9.13883L8.89889 12.9791ZM16.8711 20.9756L18.9857 18.8611L17.8919 17.7673L16.8225 18.8124L15.4614 17.4513L16.5065 16.3819L15.1211 15.0208L13.0308 17.1111L16.8711 20.9756ZM7.39195 22.7499H3.26V18.618L7.51348 14.3645L2.28778 9.13883L7.14889 4.27772L12.3989 9.52772L16.069 5.83328C16.2635 5.63883 16.4822 5.493 16.7253 5.39578C16.9683 5.29856 17.2195 5.24994 17.4788 5.24994C17.738 5.24994 17.9892 5.29856 18.2322 5.39578C18.4753 5.493 18.694 5.63883 18.8885 5.83328L20.1767 7.14578C20.3711 7.34022 20.5169 7.55897 20.6142 7.80203C20.7114 8.04508 20.76 8.29624 20.76 8.5555C20.76 8.81476 20.7114 9.06187 20.6142 9.29682C20.5169 9.53177 20.3711 9.74647 20.1767 9.94092L16.5065 13.6354L21.7322 18.8611L16.8711 23.7222L11.6454 18.4965L7.39195 22.7499ZM5.20445 20.8055H6.56556L16.0933 11.302L14.7079 9.91661L5.20445 19.4444V20.8055ZM15.4128 10.6215L14.7079 9.91661L16.0933 11.302L15.4128 10.6215Z" fill="#4F46E5"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#1E293B] leading-6" style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}>
                        {invitation.title}
                      </h3>
                      <p className="text-sm font-normal text-[#64748B] leading-5" style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}>
                        {invitation.company} • {invitation.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FEF9C3] text-[#CA8A04] px-3 py-1 rounded-full text-sm font-medium" style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      Pending
                    </span>
                    <ChevronRight className="w-6 h-6 text-[#64748B]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
  )
}

export default Invitations