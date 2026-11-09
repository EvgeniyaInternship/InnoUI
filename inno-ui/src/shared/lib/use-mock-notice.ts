import { useState } from 'react';

export function useMockNotice() {
  const [isOpen, setIsOpen] = useState(false);

  const openNotice = (): void => {
    setIsOpen(true);
  };

  const closeNotice = (): void => {
    setIsOpen(false);
  };

  return { isOpen, openNotice, closeNotice };
}
