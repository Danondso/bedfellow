import { useState, useCallback } from 'react';

/**
 * Hook for managing common component states
 */
export const useComponentState = (disabled?: boolean, loading?: boolean) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || loading;

  const handlePressIn = useCallback(() => {
    if (!isDisabled) {
      setIsPressed(true);
    }
  }, [isDisabled]);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return {
    isPressed,
    isFocused,
    isDisabled,
    isLoading: loading || false,
    handlers: {
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
};
