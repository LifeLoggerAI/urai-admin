
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const MfaGuard = ({ children }: { children: React.ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Check if the user has MFA enabled
  const hasMfa = (user as any)?.multiFactor?.enrolledFactors.length > 0;

  if (!hasMfa) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Multi-Factor Authentication Required</h2>
        <p>This admin dashboard requires you to have Multi-Factor Authentication (MFA) enabled for your account.</p>
        <p>Please enable MFA in your Google Account settings and then refresh this page.</p>
        {/* You could add a link here to your organization's security settings page */}
      </div>
    );
  }

  return <>{children}</>;
};

export default MfaGuard;
