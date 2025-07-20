import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
  section?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Dashboard section error in ${this.props.section || 'unknown'}:`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Error loading {this.props.section || 'this section'}
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                  Something went wrong while loading this section. Please try again.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <p className="mt-2 text-xs font-mono text-red-600 dark:text-red-500">
                    {this.state.error.message}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={this.handleRetry}
                  leftIcon={<RefreshCw size={14} />}
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;