import { Routes, Route, Link } from 'react-router-dom'

// pagesCRUD
import CreatePage from './pagesCRUD/CreatePage'
import ReadPage from './pagesCRUD/ReadPage'
import UpdatePage from './pagesCRUD/UpdatePage'
import DeletePage from './pagesCRUD/DeletePage'

// Auth page
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'

function App() {
  return (
    <>
      <nav>
        <Link to="/">Read</Link> | <Link to="/create">Create</Link> | <Link to="/update">Update</Link> | <Link to="/delete">Delete</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ReadPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/update" element={<UpdatePage />} />
        <Route path="/delete" element={<DeletePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
