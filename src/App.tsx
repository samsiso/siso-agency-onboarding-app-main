import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Category from '@/pages/Category';
import Author from '@/pages/Author';
import Search from '@/pages/Search';
import Community from '@/pages/Community';
import AiNews from '@/pages/AiNews';
import AiNewsPost from '@/pages/AiNewsPost';
import Legal from '@/pages/Legal';
import NotFound from '@/pages/NotFound';
import { Analytics } from '@vercel/analytics/react';
import TestSummaryPage from './pages/TestSummary';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/author/:slug" element={<Author />} />
            <Route path="/search" element={<Search />} />
            <Route path="/community" element={<Community />} />
            <Route path="/ai-news" element={<AiNews />} />
            <Route path="/ai-news/:slug" element={<AiNewsPost />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/test-summary" element={<TestSummaryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <SiteFooter />
        <Analytics />
      </div>
    </Router>
  );
}

export default App;
