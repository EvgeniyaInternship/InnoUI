import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const DoctorPage = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  paddingBlock: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    paddingBlock: theme.spacing(8),
  },
}));

export const DoctorTitleRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: theme.spacing(2),
  width: '100%',
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const BackButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  flex: '0 0 auto',
  width: 'auto',
  minWidth: 0,
  height: 'auto',
  margin: 0,
  paddingInline: theme.spacing(1.5),
  justifyContent: 'flex-start',
}));

export const DoctorHeading = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  textAlign: 'left',
}));

export const DetailList = styled('dl')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  gridTemplateColumns: '1fr',
  margin: 0,
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 1fr',
  },
}));

export const DetailRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderLeft: `3px solid ${theme.palette.success.main}`,
}));

export const DetailLabel = styled('dt')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
}));

export const DetailValue = styled('dd')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.primary,
  fontSize: theme.typography.body1.fontSize,
  fontWeight: 600,
}));

export const CatalogHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

export const DoctorIntro = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const FilterPanel = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

export const FilterFields = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  gridTemplateColumns: '1fr',
  alignItems: 'end',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.2fr) minmax(12rem, 0.9fr) auto',
  },
}));

export const FilterActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const EditorForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  width: '100%',
}));

export const FieldGroups = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr',
  width: '100%',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: '1fr 1fr',
  },
}));

export const FieldGroup = styled('fieldset')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1.5),
  gridTemplateColumns: '1fr',
  margin: 0,
  minWidth: 0,
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: '1fr 1fr',
  },
}));

export const GroupTitle = styled('legend')(({ theme }) => ({
  paddingInline: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
}));

export const WideControl = styled('div')({
  gridColumn: '1 / -1',
});

export const DoctorGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 18rem))',
  justifyContent: 'start',
  alignContent: 'start',
  [theme.breakpoints.up('md')]: {
    minHeight: `calc(3 * 146px + 2 * ${theme.spacing(2)})`,
  },
}));

export const DoctorCard = styled(Button)(({ theme }) => ({
  width: '100%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  textAlign: 'left',
  whiteSpace: 'normal',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
  },
}));

export const DoctorIdentity = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const DoctorAvatar = styled('span')(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  width: theme.spacing(6),
  height: theme.spacing(6),
  borderRadius: '50%',
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
  '& svg': {
    fontSize: 28,
  },
}));

export const DoctorMeta = styled('span')(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightRegular,
}));

export const ViewLabel = styled('span')(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: theme.typography.fontWeightMedium,
}));

export const ServiceSection = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  width: '100%',
}));

export const ServiceTableWrap = styled('div')(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  '& th': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
    fontWeight: 600,
  },
  '& td': {
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
  },
}));

export const PageRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
}));
