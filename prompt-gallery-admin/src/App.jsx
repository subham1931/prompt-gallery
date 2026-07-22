import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import PromptEditor from './pages/PromptEditor'
import Login from './pages/Login'
import Admins from './pages/Admins'
import Profile from './pages/Profile'
import RequireStaff from './components/RequireStaff'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireStaff>
            <Dashboard />
          </RequireStaff>
        }
      />
      <Route
        path="/categories"
        element={
          <RequireStaff>
            <Categories />
          </RequireStaff>
        }
      />
      <Route
        path="/prompts/new"
        element={
          <RequireStaff>
            <PromptEditor />
          </RequireStaff>
        }
      />
      <Route
        path="/prompts/:id/edit"
        element={
          <RequireStaff>
            <PromptEditor />
          </RequireStaff>
        }
      />
      <Route
        path="/admins"
        element={
          <RequireStaff superadminOnly>
            <Admins />
          </RequireStaff>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireStaff>
            <Profile />
          </RequireStaff>
        }
      />
    </Routes>
  )
}
