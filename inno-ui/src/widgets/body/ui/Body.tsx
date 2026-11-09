import Typography from '@mui/material/Typography';
import { ChatWithReceptionistButton } from '@/features/chat-with-receptionist/ui/ChatWithReceptionistButton';
import { ChooseDoctorButton } from '@/features/choose-doctor/ui/ChooseDoctorButton';
import { ChooseServiceButton } from '@/features/choose-service/ui/ChooseServiceButton';
import { ActionGrid, Section, SectionIntro, SectionLead } from './Body.styles';

export function Body() {
  return (
    <Section>
      <SectionIntro>
        <Typography variant="h4" component="h1">
          How can we help?
        </Typography>
        <SectionLead>
          Start with choosing a doctor, a service, or chatting with
          receptionist.
        </SectionLead>
      </SectionIntro>
      <ActionGrid>
        <ChooseDoctorButton />
        <ChooseServiceButton />
        <ChatWithReceptionistButton />
      </ActionGrid>
    </Section>
  );
}
