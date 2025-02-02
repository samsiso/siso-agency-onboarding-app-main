import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { SidebarProvider } from '@/components/ui/sidebar'
import Index from '@/pages/Index'
import Tools from '@/pages/Tools'
import Profile from '@/pages/Profile'
import AINews from '@/pages/AINews'
import Automations from '@/pages/Automations'
import ChatGPTAssistants from '@/pages/ChatGPTAssistants'
import Community from '@/pages/Community'
import Crypto from '@/pages/Crypto'
import CryptoExchange from '@/pages/CryptoExchange'
import Economy from '@/pages/Economy'
import HowToEarn from '@/pages/HowToEarn'
import Leaderboards from '@/pages/Leaderboards'
import LearnNetwork from '@/pages/LearnNetwork'
import Networking from '@/pages/Networking'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import SisoAI from '@/pages/SisoAI'
import SisoEducation from '@/pages/SisoEducation'
import Terms from '@/pages/Terms'
import ThankYou from '@/pages/ThankYou'
import ToolPage from '@/pages/ToolPage'
import Auth from '@/pages/Auth'
import SocialOnboarding from '@/pages/onboarding/social'

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-news" element={<AINews />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/assistants" element={<ChatGPTAssistants />} />
        <Route path="/community" element={<Community />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/crypto-exchange" element={<CryptoExchange />} />
        <Route path="/economy" element={<Economy />} />
        <Route path="/how-to-earn" element={<HowToEarn />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/learn-network" element={<LearnNetwork />} />
        <Route path="/networking" element={<Networking />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/siso-ai" element={<SisoAI />} />
        <Route path="/education" element={<SisoEducation />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/tool/:id" element={<ToolPage />} />
        <Route path="/onboarding/social" element={<SocialOnboarding />} />
      </Routes>
      <Toaster />
    </SidebarProvider>
  )
}

export default App