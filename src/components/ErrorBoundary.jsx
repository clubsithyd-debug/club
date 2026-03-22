import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-[#c9d1d9] p-4 text-center font-mono">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong.</h1>
          <p className="mb-4">The application encountered an error and could not render.</p>
          <details className="text-left bg-[#161b22] p-4 rounded border border-[#30363d] overflow-auto max-w-full">
            <summary className="cursor-pointer mb-2 font-semibold">Error Details</summary>
            <pre className="text-xs text-red-400 whitespace-pre-wrap">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-4 py-2 bg-[#238636] text-white rounded hover:bg-[#2ea043] transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
