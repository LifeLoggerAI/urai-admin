
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import PolicyManager from './PolicyManager';
import RoleManager from './RoleManager';
import Login from './pages/Login';
import MfaGuard from './components/MfaGuard';

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Router>
      <div>
        {user && (
          <nav>
            <ul>
              <li>
                <Link to="/roles">Role Management</Link>
              </li>
              <li>
                <Link to="/policies">Policy Management</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </nav>
        )}

        <hr />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/roles"
            element={
              user ? (
                <MfaGuard>
                  <RoleManager />
                </MfaGuard>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/policies"
            element={
              user ? (
                <MfaGuard>
                  <PolicyManager />
                </MfaGuard>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/roles" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
