import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const nim = localStorage.getItem('nim')
  const id = localStorage.getItem('seller_id')
  const role = localStorage.getItem('role')
  const location = useLocation()
  const path = location.pathname

  // Validasi route seller
  if (path.startsWith('/homeslr') || path.startsWith('/profileslr') || path.startsWith('/productview')) {
    if (!id || role !== 'seller') {
      return <Navigate to="/loginslr" />
    }
  }

  // Validasi route mahasiswa
  if ((path.startsWith('/home') || path.startsWith('/profile')) && !path.includes('slr')) {
    if (!nim || role !== 'mahasiswa') {
      return <Navigate to="/login" />
    }
  }

  return children
}
