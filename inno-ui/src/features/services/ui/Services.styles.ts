import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const ServicePage = styled('section')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  paddingBlock: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    paddingBlock: theme.spacing(8),
  },
}));

export const TitleRow = styled('div')(({ theme }) => ({
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

export const Heading = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.5),
  textAlign: 'left',
}));

export const CatalogHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
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
    gridTemplateColumns: '1.3fr 1fr 0.8fr 0.7fr 0.7fr auto',
  },
}));

export const FilterActions = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

export const ServiceGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  gridTemplateColumns: '1fr',
  alignContent: 'start',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    minHeight: `calc(3 * 146px + 2 * ${theme.spacing(2)})`,
  },
}));

export const ServiceCard = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'unavailable',
})<{ unavailable?: boolean }>(({ theme, unavailable }) => ({
  width: '100%',
  height: '100%',
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
  opacity: unavailable ? 0.55 : 1,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
  },
}));

export const CardFooter = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
  marginTop: 'auto',
}));

export const NameRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(1.5),
  width: '100%',
}));

export const SpecialtyMark = styled('span')(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  width: theme.spacing(5),
  height: theme.spacing(5),
  borderRadius: '50%',
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
  '& svg': {
    fontSize: 22,
  },
}));

export const Summary = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  width: '100%',
}));

export const ProviderTable = styled('div')(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

export const PriceLine = styled('span')(({ theme }) => ({
  margin: 0,
  marginLeft: theme.spacing(2),
  padding: theme.spacing(0.5, 1.25),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  fontSize: theme.typography.h6.fontSize,
  fontWeight: 600,
  lineHeight: 1.2,
}));

export const Description = styled('p')(({ theme }) => ({
  margin: 0,
  color: theme.palette.text.primary,
  lineHeight: 1.6,
}));

export const ServiceMeta = styled('span')(({ theme }) => ({
  display: 'block',
  color: theme.palette.text.secondary,
  fontSize: theme.typography.h6.fontSize,
  fontWeight: 500,
}));

export const CardDescription = styled('span')(({ theme }) => ({
  display: '-webkit-box',
  overflow: 'hidden',
  width: '100%',
  color: theme.palette.text.secondary,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightRegular,
  lineHeight: 1.5,
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
}));

export const PageRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
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
  fontWeight: 600,
}));

export const WideDetail = styled('div')({
  gridColumn: '1 / -1',
});

export const EditorForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
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
