import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { currentUser, loginWithMicrosoft, logout } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setError('');
    setBusy(true);
    try {
      await loginWithMicrosoft();
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="container login-container">
        <div className="card login-card">
          {currentUser ? (
            <>
              <h2>You're signed in</h2>
              <p>{currentUser.displayName || currentUser.email}</p>
              <button className="btn btn-secondary" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <h2>Welcome back</h2>
              <p>Sign in with your school Microsoft account to continue.</p>
              <button className="btn btn-primary login-ms-btn" onClick={handleLogin} disabled={busy}>
                {busy ? 'Signing in\u2026' : 'Sign in with Microsoft'}
              </button>
              {error && <p className="login-error">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}