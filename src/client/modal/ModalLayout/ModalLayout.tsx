import { useEffect } from 'react';
import { ChallengeNotificationModal } from '../ChallengeNotificationModal/ChallengeNotificationModal';
import { appSocket } from '../../../common/socket/app.socket';

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
