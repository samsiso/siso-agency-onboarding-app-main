import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoDetailPage from './pages/education/videos/[slug]';
import SisoEducation from './pages/SisoEducation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/education" element={<SisoEducation />}>
          <Route path="videos/:slug" element={<VideoDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;