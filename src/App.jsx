import { Routes, Route, Link } from 'react-router-dom'

// pagesCRUD
import CreatePage from './pagesCRUD/CreatePage'
import ReadPage from './pagesCRUD/ReadPage'
import UpdatePage from './pagesCRUD/UpdatePage'
import DeletePage from './pagesCRUD/DeletePage'

// Auth page mhs
import RegisterMhs from './pages/Auth/RegisterMhs'
import LoginMhs from './pages/Auth/LoginMhs'
// pages mhs
import HomeMhs from './pages/Customer/Home'
import ProfileMhs from './pages/Customer/Profile'

// Auth page seller
import RegisterSlr from './pages/Auth/RegisterSlr'
import LoginSlr from './pages/Auth/LoginSlr'
import RestoPage from './pages/Customer/RestoPage';
// pages seller
import HomeSlr from './pages/Seller/HomeSlr'
import ProfileSlr from './pages/Seller/ProfileSlr'

// components
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      {/* <nav>
        <Link to="/">Read</Link> | <Link to="/create">Create</Link> | <Link to="/update">Update</Link> | <Link to="/delete">Delete</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav> */}
      <Routes>
        {/* Route Mahasiswa */}
        {/* <Route path="/" element={<ReadPage />} /> */}
        <Route path="/" element={
            <ProtectedRoute>
              <HomeMhs />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterMhs />} />
        <Route path="/login" element={<LoginMhs />} />
        <Route path="/home" element={
            <ProtectedRoute>
              <HomeMhs />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileMhs />
            </ProtectedRoute>
          }
        />

        {/* Route Seller */}
        <Route path="/registerslr" element={<RegisterSlr />} />
        <Route path="/loginslr" element={<LoginSlr />} />
        <Route path="/homeslr" element={
            <ProtectedRoute>
              <HomeSlr />
            </ProtectedRoute>
          }
        />
        <Route path="/profileslr" element={
            <ProtectedRoute>
              <ProfileSlr />
            </ProtectedRoute>
          }
        />
        <Route path="/resto/:id" element={<RestoPage />} />
      </Routes>
    </>
  )
}

export default App
