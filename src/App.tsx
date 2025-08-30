import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Flags from './pages/Flags';
import Reports from './pages/Reports';
import DSR from './pages/DSR';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/flags" element={<ProtectedRoute><Flags /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/dsr" element={<ProtectedRoute><DSR /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}