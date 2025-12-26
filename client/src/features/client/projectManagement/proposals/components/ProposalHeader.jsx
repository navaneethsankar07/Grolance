import React from 'react';

export default function ProjectHeader({ title, budget, proposalCount, postedTime }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 lg:text-xl capitalize">{title}</h2>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-gray-600">Budget: </span>
              <span className="font-medium text-gray-900">{budget}</span>
            </div>
            <div>
              <span className="text-gray-600">Proposals: </span>
              <span className="font-medium text-gray-900">{proposalCount}</span>
            </div>
            <div className="text-gray-600">{postedTime}</div>
          </div>
        </div>
        <button className="rounded-lg border border-blue-500 bg-transparent px-6 py-2.5 text-sm font-medium text-blue-500 transition hover:bg-blue-50">
          View Post
        </button>
      </div>
    </div>
  );
}