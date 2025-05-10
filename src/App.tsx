import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AuthGuard } from './components/auth/AuthGuard';
import PaymentsPage from './pages/financial/PaymentsPage';
import SimplePaymentsPage from './pages/financial/SimplePaymentsPage';
import TestFlowPage from './components/projects/userflow/TestFlowPage';
import UserFlow from './pages/UserFlow';
import MinimalUserFlow from './pages/MinimalUserFlow';
import Index from './pages/Index';
import Home from './pages/Home';
import LeaderboardPage from './pages/LeaderboardPage';
import TasksPage from './pages/projects/TasksPage';
import TimelinePage from './pages/projects/TimelinePage';
import PlanFeaturesPage from './pages/projects/PlanFeaturesPage';
import PlanBuilderPage from './pages/PlanBuilderPage';
import ResourcesPage from './pages/ResourcesPage';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Main routes */}
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
        <Route path="/dashboard" element={<AuthGuard><Home /></AuthGuard>} />
        
        {/* UserFlow routes */}
        <Route path="/test-flow" element={<AuthGuard><TestFlowPage /></AuthGuard>} />
        <Route path="/minimal-flow" element={<AuthGuard><MinimalUserFlow /></AuthGuard>} />
        <Route path="/projects/:id/userflow" element={<AuthGuard><UserFlow /></AuthGuard>} />
        
        {/* Project Routes */}
        <Route path="/projects/tasks" element={<AuthGuard><TasksPage /></AuthGuard>} />
        <Route path="/projects/timeline" element={<AuthGuard><TimelinePage /></AuthGuard>} />
        <Route path="/projects/plan-features" element={<AuthGuard><PlanFeaturesPage /></AuthGuard>} />
        <Route path="/plan-builder" element={<AuthGuard><PlanBuilderPage /></AuthGuard>} />
        
        {/* Financial Routes */}
        <Route path="/financial/payments" element={<AuthGuard><PaymentsPage /></AuthGuard>} />
        <Route path="/financial/simple-payments" element={<AuthGuard><SimplePaymentsPage /></AuthGuard>} />
        <Route path="/financial/payments/token-usage" element={<AuthGuard><PaymentsPage /></AuthGuard>} />
        <Route path="/financial/leaderboards" element={<AuthGuard><Navigate to="/economy/leaderboards" replace /></AuthGuard>} />
        
        {/* Economy Routes */}
        <Route path="/economy/leaderboards" element={<AuthGuard><LeaderboardPage /></AuthGuard>} />
        
        {/* Resources Routes */}
        <Route path="/resources" element={<AuthGuard><ResourcesPage /></AuthGuard>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
