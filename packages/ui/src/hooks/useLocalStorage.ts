import { useEffect, useState } from 'react';

function getStorageValue(key: string, defaultValue?: any) {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (ignored) {
      return saved;
    }
  }
  return defaultValue;
}

/**
 * React hook to manage values in local storage.
 * @param key - The key to store the value in local storage.
 * @param defaultValue - The default value to use if the key is not found in local storage.
 */
export function useLocalStorage(key: string, defaultValue?: any) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(() => getStorageValue(key, defaultValue));
  }, [key, defaultValue]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
