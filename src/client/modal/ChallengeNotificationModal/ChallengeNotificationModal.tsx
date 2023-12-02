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
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  gameSocket,
  gameSocketConnect,
  gameSocketDisconnect,
} from '../../../game/socket/game.socket';
import { useNavigate } from 'react-router';
import { appSocket } from '../../../common/socket/app.socket';

interface IRequestData {
  nickname: string;
  requesterIdx: number;
  gameMode: 'normal' | 'hard';
}

export const ChallengeNotificationModal = () => {
  const [requestData, setRequestData] = useState<IRequestData>();
  const [submitState, setSubmitState] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = () => {
    gameSocketConnect();
    gameSocket.emit('acceptChallengeGame', {
      requesterIdx: requestData?.requesterIdx,
      gameMode: requestData?.gameMode,
    });

    appSocket.on('createGameSuccess', (game) => {
      navigate(`/game/${game.room_id}`);
    });
    setSubmitState(true);
  };

  const {
    isOpen: isRequestedChallengeOpen,
    onOpen: onOpenRequetedChallenge,
    onClose: onCloseRequetedChallenge,
  } = useDisclosure();

  const handleModalClose = () => {
    if (!submitState)
      appSocket.emit('cancelChallengeGame', {
        requestedIdx: requestData?.requesterIdx,
      });
    onCloseRequetedChallenge();
    gameSocketDisconnect();
    gameSocket.off('createGameSuccess');
    setSubmitState(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (requestData?.nickname) {
      timer = setTimeout(() => {
        if (!submitState) {
          handleModalClose();
        }
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [requestData, submitState]);

  useEffect(() => {
    appSocket.on('requestedChallenge', (data: IRequestData) => {
      setRequestData(data);
      onOpenRequetedChallenge();
    });

    appSocket.on('cancelChallengeGame', () => {
      handleModalClose();
    });

    return () => {
      handleModalClose();
      appSocket.off('requestedChallenge');
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
            {!submitState ? (
              <div className="flex justify-center">
                <span className="text-black-500 text-xl">
                  {`${requestData?.nickname}가 ${
                    requestData?.gameMode === 'normal' ? 'Normal' : 'Hard'
                  } 게임을 도전했습니다.`}
                  {`5초 안에 수락해주세요!`}
                </span>
              </div>
            ) : (
              <Center>
                <Spinner
                  className="flex justify-center"
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Center>
            )}
          </ModalBody>
          <ModalFooter>
            {!submitState && (
              <>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                  수락
                </Button>
                <Button onClick={handleModalClose}>거절</Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
