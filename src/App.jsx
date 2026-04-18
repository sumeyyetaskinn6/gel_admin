import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import AdminProfilePage from './pages/AdminProfilePage'
import DriverCourierApprovalPage from './pages/DriverCourierApprovalPage'
import HistoryRecordsPage from './pages/HistoryRecordsPage'
import LoginPage from './pages/LoginPage'
import RatingComplaintPage from './pages/RatingComplaintPage'
import TrackingPage from './pages/TrackingPage'
import TransactionsPage from './pages/TransactionsPage'
import ContractsManagementPage from './pages/ContractsManagementPage'
import FaqManagementPage from './pages/FaqManagementPage'
import UserDetailPage from './pages/UserDetailPage'
import UserManagementPage from './pages/UserManagementPage'
import VehicleCatalogPage from './pages/VehicleCatalogPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard/transactions" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardLayout onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        <Route index element={<Navigate to="transactions" replace />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="driver-courier-approval" element={<DriverCourierApprovalPage />} />
        <Route path="delivery-tracking" element={<TrackingPage />} />
        <Route path="history-records" element={<HistoryRecordsPage />} />
        <Route path="user-management/:role/:userId" element={<UserDetailPage />} />
        <Route path="user-management" element={<UserManagementPage />} />
        <Route path="rating-complaint" element={<RatingComplaintPage />} />
        <Route path="app/faq" element={<FaqManagementPage />} />
        <Route path="app/vehicles" element={<VehicleCatalogPage />} />
        <Route path="app/contracts" element={<ContractsManagementPage />} />
        <Route path="admin-profile" element={<AdminProfilePage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/dashboard/transactions' : '/'} replace />}
      />
    </Routes>
  )
}

export default App
