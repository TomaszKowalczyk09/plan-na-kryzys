import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import FirstRunGate from './components/FirstRunGate.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MoodPage from './pages/MoodPage.jsx'
import CrisisPage from './pages/CrisisPage.jsx'
import KnowledgePage from './pages/KnowledgePage.jsx'
import FriendPage from './pages/FriendPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import AddictionConfigPage from './pages/AddictionConfigPage.jsx';
import TermsPage from './pages/TermsPage.jsx'

function FirstRunLayout() {
  return (
    <FirstRunGate>
      <Outlet />
    </FirstRunGate>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Trasy dostępne bez onboardingu */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Reszta aplikacji za bramką pierwszego uruchomienia */}
          <Route element={<FirstRunLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/crisis" element={<CrisisPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/friend" element={<FriendPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/sobriety" element={import('./pages/SobrietyPage.jsx').then(mod => <mod.default />)} />
           <Route path="/addiction-config" element={<AddictionConfigPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
