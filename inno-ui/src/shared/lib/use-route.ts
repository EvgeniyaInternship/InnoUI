import { useEffect, useState } from 'react';

export function navigateTo(nextPath: string): void {
  if (window.location.pathname !== nextPath) {
    window.history.pushState(null, '', nextPath);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}

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
  return { path, navigate: navigateTo };
}
