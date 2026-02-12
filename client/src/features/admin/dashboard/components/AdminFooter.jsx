import React from 'react'
import { Link } from 'react-router-dom';

function AdminFooter() {
  const d = new Date();
let year = d.getFullYear();
  return (
    <div className="text-center py-6">
        <p className="text-xs text-gray-500">© {year} <Link to={'/'}><span className="text-black">gro</span><span className="text-primary">lance.</span></Link>  Admin Dashboard</p>
      </div>
  )
}

export default AdminFooter