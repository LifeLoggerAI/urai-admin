
import { useRouter } from 'next/router';
import { useAuth } from '../lib/firebase'; // Adjust this import to your firebase auth setup

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (role && user.customClaims?.uraiRole !== role) {
    return <p>Access disabled</p>;
  }

  return children;
};

export default ProtectedRoute;
