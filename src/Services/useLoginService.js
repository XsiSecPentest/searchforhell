import { useState, useCallback, useEffect } from 'react';

export const useLoginService = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null);

  const fetchData = useCallback(async () => {
    if (data) return data;

    setIsLoading(true);
    const httpAbortCtrl = new AbortController();
    setController(httpAbortCtrl);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: httpAbortCtrl.signal,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong!');
      }

      setData(responseData);
      setIsLoading(false);
      return responseData;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Something went wrong!');
      }
      setIsLoading(false);
      throw err;
    }
  }, [url, data]);

  useEffect(() => {
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [controller]);

  const clearError = () => {
    setError(null);
  };

  return { data, isLoading, error, fetchData, clearError };
};
