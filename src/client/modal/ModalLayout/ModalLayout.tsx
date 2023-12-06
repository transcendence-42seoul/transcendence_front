import { ChallengeNotificationModal } from '../ChallengeNotificationModal/ChallengeNotificationModal';

interface ModalLayoutProps {
  children: React.ReactNode;
}

const ModalLayout = (props: ModalLayoutProps) => {
  return (
    <>
      {props.children}
      <ChallengeNotificationModal />
    </>
  );
};

export default ModalLayout;
