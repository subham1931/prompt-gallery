import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import PromptDetail from './pages/PromptDetail'
import Library from './pages/Library'
import Libraries from './pages/Libraries'
import About from './pages/About'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Profile from './pages/Profile'
import { SignIn, SignUp } from './pages/AuthPages'

function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="liquid-bg-canvas flex min-h-screen flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Liquid Systems Floating Gradient Glow Mesh */}
      <div className="liquid-bg-blob-1" />
      <div className="liquid-bg-blob-2" />
      <div className="liquid-bg-blob-3" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/prompt/:slug" element={<PromptDetail />} />
              <Route path="/library/:categorySlug" element={<Library />} />
              <Route path="/libraries" element={<Libraries />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
