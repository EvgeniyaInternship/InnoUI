import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

const PagerRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

type PagerProps = {
  pageNumber: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
};

export function Pager({ pageNumber, totalPages, onPageChange }: PagerProps) {
  if (totalPages <= 1) {
    return null;
  }
  return (
    <PagerRow>
      <Pagination
        count={totalPages}
        page={pageNumber + 1}
        color="primary"
        shape="rounded"
        onChange={(_event, page) => onPageChange(page - 1)}
      />
    </PagerRow>
  );
}
