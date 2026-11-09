import type { ReactNode } from 'react';
import { MockNotice } from '@/shared/ui/mock-notice/MockNotice';
import { useMockNotice } from '@/shared/lib/use-mock-notice';
import {
  ActionCard,
  ActionIcon,
  ActionText,
  ActionTitle,
} from './MockActionButton.styles';

type MockActionButtonProps = {
  label: string;
  description: string;
  notice: string;
  icon: ReactNode;
};

export function MockActionButton({
  label,
  description,
  notice,
  icon,
}: MockActionButtonProps) {
  const { isOpen, openNotice, closeNotice } = useMockNotice();

  return (
    <>
      <ActionCard onClick={openNotice}>
        <ActionIcon>{icon}</ActionIcon>
        <ActionTitle>{label}</ActionTitle>
        <ActionText>{description}</ActionText>
      </ActionCard>
      <MockNotice open={isOpen} message={notice} onClose={closeNotice} />
    </>
  );
}
