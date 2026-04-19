import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '../store/authStore';

export default function withAuth(Component) {
  return function ProtectedPage(props) {
    const router = useRouter();
    const { isAuthenticated, initialize } = useAuthStore();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      initialize();
      const token = localStorage.getItem('alona_admin_token');
      if (!token) {
        router.replace('/admin/login');
      } else {
        setChecking(false);
      }
    }, []);

    if (checking) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }} />
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>Verifying session...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
