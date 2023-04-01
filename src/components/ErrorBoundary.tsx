import React, {Component, ErrorInfo, ReactNode} from 'react';
import StyledText from './Styled/StyledText';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <StyledText variant="h1">Что-то пошло не так.</StyledText>;
    }

    return this.props.children;
  }
}
