
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages';
import Auth from './pages/Auth';
import ThankYou from './pages/ThankYou';
import AINews from './pages/AINews';
import DailyNews from './pages/DailyNews';
import BlogPost from './pages/BlogPost';
import Tools from './pages/Tools';
import ToolDetail from './pages/ToolDetail';
import Education from './pages/Education';
import VideoDetail from './pages/VideoDetail';
import DailyNewsAdmin from './pages/DailyNewsAdmin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Auth Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/thank-you" element={<ThankYou />} />
        
        {/* AI News Routes */}
        <Route path="/ai-news" element={<AINews />} />
        <Route path="/ai-news/daily/:date" element={<DailyNews />} />
        <Route path="/ai-news/admin" element={<DailyNewsAdmin />} />
        <Route path="/ai-news/:id" element={<BlogPost />} />

        {/* Tools Routes */}
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/:id" element={<ToolDetail />} />

        {/* Education Routes */}
        <Route path="/education" element={<Education />} />
        <Route path="/education/videos/:id" element={<VideoDetail />} />
        
      </Routes>
    </Router>
  );
}
