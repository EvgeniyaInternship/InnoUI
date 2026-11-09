import { MockNotice } from '@/shared/ui/mock-notice/MockNotice';
import { useMockNotice } from '@/shared/lib/use-mock-notice';
import { ActionCard, ActionText, ActionTitle } from './MockActionButton.styles';

type MockActionButtonProps = {
  label: string;
  description: string;
  notice: string;
};

export function MockActionButton({
  label,
  description,
  notice,
}: MockActionButtonProps) {
  const { isOpen, openNotice, closeNotice } = useMockNotice();

  return (
    <>
      <ActionCard onClick={openNotice}>
        <ActionTitle>{label}</ActionTitle>
        <ActionText>{description}</ActionText>
      </ActionCard>
      <MockNotice open={isOpen} message={notice} onClose={closeNotice} />
    </>
  );
}
