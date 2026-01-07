import { Calendar, DollarSign, User } from 'lucide-react'
import React from 'react'

function ActiveContacts() {
  return (
    <div className="mb-8 max-w-260">
            <h2 className="text-[25px]  font-semibold text-[#111827] leading-7 mb-4" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
              Active Contracts
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { company: "TechCorp Inc.", title: "Mobile App Redesign", due: "Jan 28, 2025", price: "$5,000" },
                { company: "StartupXYZ", title: "Brand Identity Design", due: "Feb 5, 2025", price: "$3,500" },
                { company: "E-Commerce Co.", title: "Website Development", due: "Feb 12, 2025", price: "$8,000" },
                { company: "Marketing Agency", title: "Social Media Graphics", due: "Jan 30, 2025", price: "$2,000" },
              ].map((contract, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-[#F3F4F6] shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                    <User className="w-4 h-4 text-[#9CA3AF]" />
                    <span style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>{contract.company}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-[#111827] leading-[22px] mb-3" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                    {contract.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#4B5563] mb-2">
                    <Calendar className="w-4 h-4" />
                    <span style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>Due {contract.due}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#4B5563]" />
                      <span className="text-xs font-semibold text-[#111827]" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>{contract.price}</span>
                    </div>
                    <button className="text-xs font-medium text-[#3B82F6] hover:underline" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
  )
}

export default ActiveContacts