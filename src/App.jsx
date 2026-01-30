import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import FirstRunGate from './components/FirstRunGate.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MoodPage from './pages/MoodPage.jsx'
import CrisisPage from './pages/CrisisPage.jsx'
import KnowledgePage from './pages/KnowledgePage.jsx'
import FriendPage from './pages/FriendPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <FirstRunGate>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/crisis" element={<CrisisPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/friend" element={<FriendPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </FirstRunGate>
    </BrowserRouter>
  )
}
