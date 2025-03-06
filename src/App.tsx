
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TestSummaryPage from './pages/TestSummary';

// [Analysis] Simplified App component to focus on our test route
// [Plan] Add proper routing and layout components as needed later
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<TestSummaryPage />} />
            <Route path="/test-summary" element={<TestSummaryPage />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
