import React from 'react';
import { Text } from 'react-native';

interface ErrorBoundaryProps {
  children: JSX.Element;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.log('ERROR:: Failed to render component during test', error, info.componentStack);
    this.setState({
      hasError: true,
    });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <Text>Failed to render component during test.</Text>;
    }

    return children;
  }
}

export default ErrorBoundary;
