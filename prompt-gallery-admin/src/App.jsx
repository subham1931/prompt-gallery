import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import PromptEditor from './pages/PromptEditor'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/prompts/new" element={<PromptEditor />} />
      <Route path="/prompts/:id/edit" element={<PromptEditor />} />
    </Routes>
  )
}
