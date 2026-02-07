import { Calendar, DollarSign, User, FileX } from 'lucide-react'
import React from 'react'
import { useMyContracts } from '../../contracts/contractsQueries'
import { formatDateDMY } from '../../../../utils/date'
import { Link } from 'react-router-dom'

function ActiveContacts() {
  const { data, isLoading } = useMyContracts()
  const contracts = data?.results || []
  const activeContracts = contracts
    .filter(contract => contract.status === 'active' || contract.status === 'disputed')
    .slice(0, 4)
  console.log(data);
  
  const getDueDate = (signedAt, days) => {
    if (!signedAt || !days) return 'N/A';
    
    const signedDate = new Date(signedAt);
    const dueDate = new Date(signedDate);
    dueDate.setDate(signedDate.getDate() + parseInt(days));

    return formatDateDMY(dueDate.toISOString());
  };

  if (isLoading) {
    return (
      <div className="mb-8 max-w-260">
        <h2 className="text-[25px] font-semibold text-[#111827] leading-7 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
          Active Contracts
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-xl border border-[#F3F4F6]"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8 max-w-260">
      <h2 className="text-[25px] font-semibold text-[#111827] leading-7 mb-4" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
        Active Contracts
      </h2>
      
      {activeContracts.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {activeContracts.map((contract, index) => (
            <div key={contract.id || index} className="bg-white rounded-xl p-6 border border-[#F3F4F6] shadow-sm">
              <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                <User className="w-4 h-4 text-[#9CA3AF]" />
                <span style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>{contract.client_name}</span>
              </div>
              <h3 className="text-[15px] font-semibold text-[#111827] leading-[22px] mb-3" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                {contract.project_title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#4B5563] mb-2">
                <Calendar className="w-4 h-4" />
                <span style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                  Due {getDueDate(contract.freelancer_signed_at, contract.delivery_days)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#4B5563]" />
                  <span className="text-xs font-semibold text-[#111827]" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                    {contract.total_amount}
                  </span>
                </div>
                <Link to={`contracts/${contract.id}`} className="text-xs font-medium text-[#3B82F6] hover:underline" style={{ fontFamily: 'Inter, -apple-system, Roboto, Helvetica, sans-serif' }}>
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-10 border border-[#F3F4F6] shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <FileX className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-[#6B7280] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            No active contracts found.
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Accept an offer to start a project.
          </p>
        </div>
      )}
    </div>
  )
}

export default ActiveContacts