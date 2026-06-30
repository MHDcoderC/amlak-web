import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center border border-warm-200">
            <div className="text-5xl mb-3">⚠️</div>
            <h1 className="text-xl font-bold text-warm-900 mb-2">
              مشکلی پیش اومد
            </h1>
            <p className="text-warm-500 text-sm mb-5">
              لطفاً صفحه رو رفرش کنید.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-800 transition-colors"
            >
              بارگذاری مجدد
            </button>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-5 text-left">
                <summary className="cursor-pointer text-xs text-warm-500 hover:text-warm-700">
                  جزئیات خطا
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
