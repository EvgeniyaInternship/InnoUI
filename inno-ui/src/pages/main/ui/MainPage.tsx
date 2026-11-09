import { Body } from '@/widgets/body/ui/Body';
import { Bottom } from '@/widgets/bottom/ui/Bottom';
import { Header } from '@/widgets/header/ui/Header';
import { PageMain, PageRoot } from './MainPage.styles';

export function MainPage() {
  return (
    <PageRoot>
      <Header />
      <PageMain>
        <Body />
      </PageMain>
      <Bottom />
    </PageRoot>
  );
}
