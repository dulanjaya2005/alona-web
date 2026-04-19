import { Component } from 'react';
import Link from 'next/link';

/**
 * ErrorBoundary — catches render errors in the component tree.
 * Wrap layouts or page sections with this for graceful degradation.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomePage />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production you would send this to an error-tracking service
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught:', error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center grid-bg px-6"
          style={{ background: 'var(--bg)' }}
        >
          <div className="text-center max-w-md">
            {/* Icon */}
            <div
              className="w-16 h-16 flex items-center justify-center mx-auto mb-6 text-3xl"
              style={{
                background: 'rgba(255,68,68,0.08)',
                border: '1px solid rgba(255,68,68,0.2)',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              }}
            >
              ⚠
            </div>

            <h1
              className="text-3xl font-black mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Something went wrong
            </h1>

            <p className="mb-2" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              An unexpected error occurred while rendering this page.
            </p>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre
                className="text-left text-xs p-4 rounded my-4 overflow-auto"
                style={{
                  background: 'rgba(255,68,68,0.06)',
                  border: '1px solid rgba(255,68,68,0.15)',
                  color: '#f87171',
                  maxHeight: '160px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {this.state.error.toString()}
              </pre>
            )}

            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn-primary py-2.5 px-6"
              >
                Try Again
              </button>
              <Link href="/" className="btn-outline py-2.5 px-6">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
