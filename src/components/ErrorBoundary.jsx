import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('ErrorBoundary caught an error', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Something went wrong while rendering the app.
        </div>
      );
    }

    return this.props.children;
  }
}
