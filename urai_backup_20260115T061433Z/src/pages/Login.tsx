import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // In a real application, you would handle authentication with Firebase here.
    // For this example, we'll just simulate a login and redirect to the dashboard.
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}