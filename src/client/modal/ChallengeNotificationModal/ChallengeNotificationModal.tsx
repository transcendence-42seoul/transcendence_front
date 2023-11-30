import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  gameSocket,
  gameSocketConnect,
  gameSocketDisconnect,
} from '../../../game/socket/game.socket';
import { getCookie } from '../../../common/cookie/cookie';
import { useNavigate } from 'react-router';
import { appSocket } from '../../../common/socket/app.socket';
import { TUserStatus } from '../../../common/avatar/SmallAvatar';

type difficultyLevelType = 'normal' | 'hard';

interface ChallengeNotificationModalProps {}

export const ChallengeNotificationModal = (
  props: ChallengeNotificationModalProps,
) => {
  const [requestedNickname, setRequestedNickname] = useState<string>();
  const navigate = useNavigate();

  const handleSubmit = () => {};

  const {
    isOpen: isRequestedChallengeOpen,
    onOpen: onOpenRequetedChallenge,
    onClose: onCloseRequetedChallenge,
  } = useDisclosure();

  const handleModalClose = () => {
    onCloseRequetedChallenge();
    gameSocketDisconnect();
    gameSocket.off('createGameSuccess');
    gameSocket.off('submitChalleng');
    gameSocket.off('error');
  };

  useEffect(() => {
    appSocket.on('requestedChallenge', (data: { nickname: string }) => {
      setRequestedNickname(data.nickname);
      onOpenRequetedChallenge();
    });

    appSocket.on('createdGame', (data) => {
      navigate(`/game/${data.room_id}`);
    });
    return () => {
      handleModalClose();
      // appSocket.emit('cancelChallengeGame', { requestedIdx });
      appSocket.off('checkEnableChallengeGameSuccess');
    };
  }, []);
  return (
    <>
      <Modal
        isOpen={isRequestedChallengeOpen}
        onClose={handleModalClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>챌린지 신청</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex justify-center">
              <span className="text-red-500">
                {`${requestedNickname}가 챌린지 게임을 신청했습니다.`}
              </span>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              수락
            </Button>
            <Button onClick={handleModalClose}>거절</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
