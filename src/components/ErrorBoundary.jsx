import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: '20px',
                    textAlign: 'center',
                    fontFamily: '"LibreFranklin", sans-serif'
                }}>
                    <h1 style={{ fontFamily: '"Arya", serif', fontSize: '3rem', color: '#9a0002' }}>Something went wrong.</h1>
                    <p style={{ maxWidth: '600px', margin: '20px 0', fontSize: '1.2rem', color: '#666' }}>
                        We're sorry, but an unexpected error has occurred. Please try refreshing the page.
                    </p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '12px 24px',
                                background: '#9a0002',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Refresh Page
                        </button>
                        <a href="/" style={{
                            padding: '12px 24px',
                            background: 'white',
                            color: '#9a0002',
                            border: '1px solid #9a0002',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            display: 'inline-block'
                        }}>
                            Go Home
                        </a>
                    </div>
                    {/* Optional: Show error details in development */}
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ marginTop: '40px', textAlign: 'left', background: '#f5f5f5', padding: '20px', borderRadius: '8px', maxWidth: '800px', overflow: 'auto' }}>
                            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Details</summary>
                            <pre style={{ marginTop: '10px', fontSize: '0.8rem' }}>
                                {this.state.error.toString()}
                                <br />
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
