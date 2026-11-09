import Snackbar from '@mui/material/Snackbar';

type MockNoticeProps = {
  open: boolean;
  message: string;
  onClose: () => void;
};

export function MockNotice({ open, message, onClose }: MockNoticeProps) {
  return <Snackbar open={open} message={message} onClose={onClose} />;
}
