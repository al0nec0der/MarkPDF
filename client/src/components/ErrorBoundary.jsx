import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <details className="w-full max-w-2xl bg-red-50 p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">Error details</summary>
            <pre className="mt-2 text-sm overflow-auto">
              {this.state.error && this.state.error.toString()}
            </pre>
            <pre className="mt-2 text-sm overflow-auto">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <div className="mt-4 flex gap-2">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;