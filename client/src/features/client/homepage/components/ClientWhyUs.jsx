import { CheckCircle2, Headphones, Shield } from 'lucide-react'
import React from 'react'

function ClientWhyUs() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-[1660px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 xl:gap-[217px] justify-items-center">
            <div className="text-center max-w-[379px]">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-[#111827] font-inter text-xl sm:text-2xl lg:text-[30px] font-bold leading-7 mb-4">
                Secure Payments
              </h3>
              <p className="text-[#6B7280] font-inter text-sm leading-[22px]">
                Your money is held safely until you approve the work. No surprises.
              </p>
            </div>

            <div className="text-center max-w-[379px]">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-[#111827] font-inter text-xl sm:text-2xl lg:text-[30px] font-bold leading-7 mb-4">
                Quality Guarantee
              </h3>
              <p className="text-[#6B7280] font-inter text-sm leading-[22px]">
                Satisfaction guaranteed or your money back. We stand by our talent.
              </p>
            </div>

            <div className="text-center max-w-[379px]">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Headphones className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-[#111827] font-inter text-xl sm:text-2xl lg:text-[30px] font-bold leading-7 mb-4">
                24/7 Support
              </h3>
              <p className="text-[#6B7280] font-inter text-sm leading-[22px]">
                Our dedicated support team is here to help you anytime, anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>
  )
}

export default ClientWhyUs