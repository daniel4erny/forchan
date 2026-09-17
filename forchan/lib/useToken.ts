'use client';

import { useState, useEffect, useCallback } from 'react';

export function useToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const checkToken = useCallback(() => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('token=')
    );

    if (tokenCookie) {
      const tokenValue = tokenCookie.split('=')[1];
      setToken(tokenValue || null);
    } else {
      setToken(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return {
    token,
    hasToken: !!token,
    isLoading,
    checkToken, 
  };
}