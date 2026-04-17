import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './DashboardLayout.css'

function DashboardLayout({ onLogout }) {
  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
