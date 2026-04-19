import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

/**
 * useApi — generic data-fetching hook
 * @param {string} url  — the API endpoint (relative to baseURL)
 * @param {object} opts — { params, skip }
 */
export function useApi(url, opts = {}) {
  const { params, skip = false } = opts;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (overrideParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, { params: overrideParams ?? params });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params)]);

  useEffect(() => {
    if (!skip) fetch();
  }, [skip, fetch]);

  return { data, loading, error, refetch: fetch };
}

/**
 * useMutation — for POST/PUT/DELETE operations
 * @param {function} mutationFn — async function that performs the mutation
 */
export function useMutation(mutationFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(...args);
      return { success: true, data: result };
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export default useApi;
