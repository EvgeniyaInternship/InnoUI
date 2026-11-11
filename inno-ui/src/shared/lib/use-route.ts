import { useCallback, useEffect, useState } from 'react';

export function useRoute(): {
  path: string;
  navigate: (nextPath: string) => void;
} {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const syncPath = (): void => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', syncPath);
    return () => {
      window.removeEventListener('popstate', syncPath);
    };
  }, []);
  const navigate = useCallback((nextPath: string): void => {
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    setPath(nextPath);
  }, []);
  return { path, navigate };
}
