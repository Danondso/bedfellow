/* eslint-disable react/prop-types */
import React from 'react';
import { Text } from 'react-native';

interface ErrorBoundaryProps {
  error: unknown;
  children: unknown;
}

class ErrorBoundary extends React.Component {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.log('ERROR:: Failed to render component during test', error, info.componentStack);
  }

  render() {
    // @ts-ignore
    const { hasError } = this.state;
    // @ts-ignore
    const { children } = this.props;
    if (hasError) {
      return <Text>Failed to render component during test.</Text>;
    }

    return children || <Text>No children to render in ErrorBoundary component.</Text>;
  }
}

export default ErrorBoundary;
