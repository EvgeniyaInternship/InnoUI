import {
  FooterBrand,
  FooterInner,
  FooterNote,
  FooterRoot,
} from './Bottom.styles';

export function Bottom() {
  return (
    <FooterRoot>
      <FooterInner>
        <FooterBrand variant="body2">Clinic</FooterBrand>
        <FooterNote variant="body2">
          You can browse before you sign in.
        </FooterNote>
      </FooterInner>
    </FooterRoot>
  );
}
