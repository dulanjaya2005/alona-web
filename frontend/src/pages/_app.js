import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import ErrorBoundary from '../components/ErrorBoundary';

export default function App({ Component, pageProps }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ErrorBoundary>
      {getLayout(<Component {...pageProps} />)}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background   : '#111118',
            color        : '#f0f0f5',
            border       : '1px solid rgba(255,255,255,0.08)',
            fontFamily   : 'var(--font-body)',
            fontSize     : '0.875rem',
            borderRadius : '4px',
            padding      : '12px 16px',
            maxWidth     : '360px',
          },
          success: { iconTheme: { primary: '#00ff88', secondary: '#0a0a0f' } },
          error  : { iconTheme: { primary: '#f87171', secondary: '#0a0a0f' } },
        }}
      />
    </ErrorBoundary>
  );
}
