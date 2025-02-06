import { Outlet } from 'react-router-dom';

export default function SisoEducation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Outlet />
    </div>
  );
}