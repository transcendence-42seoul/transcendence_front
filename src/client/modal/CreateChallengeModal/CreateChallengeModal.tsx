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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  gameSocket,
  gameSocketConnect,
  gameSocketDisconnect,
} from '../../../game/socket/game.socket';
import { useNavigate } from 'react-router';
import { appSocket } from '../../../common/socket/app.socket';
import { TUserStatus } from '../../../common/avatar/SmallAvatar';

type difficultyLevelType = 'normal' | 'hard';

interface CreateChallengeModalProps {
  requestedIdx: number | undefined;
  modalState: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
}

export const CreateChallengeModal = (props: CreateChallengeModalProps) => {
  const { requestedIdx, modalState } = props;
  const navigate = useNavigate();
  const [difficultyLevel, setDifficultyLevel] =
    useState<difficultyLevelType>('normal');
  const [enableRequest, setEnableRequest] = useState<
    'possible' | 'impossible' | 'block'
  >('possible');
  const handleTypeChange = (value: difficultyLevelType) => {
    setDifficultyLevel(value);
  };

  const [submitState, setSubmitState] = useState<boolean>(false);

  const handleSubmit = () => {
    setSubmitState(true);
    gameSocketConnect();
    appSocket.emit('checkEnableChallengeGame', {
      gameMode: difficultyLevel,
      requestedIdx,
    });

    appSocket.on(
      'checkEnableChallengeGameSuccess',
      (data: { status: TUserStatus; success: boolean; block: boolean }) => {
        const { success, block } = data;
        if (block) setEnableRequest('block');
        else if (!success) {
          setEnableRequest('impossible');
        } else {
          setEnableRequest('possible');
        }
      },
    );

    appSocket.on('cancelChallengeGame', () => {
      handleModalClose();
    });

    appSocket.on('createGameSuccess', (game) => {
      navigate(`/game/${game.room_id}`);
    });
  };

  const handleModalClose = () => {
    // 231202 requested한테 취소 전달되는 부분?
    if (submitState) appSocket.emit('cancelChallengeGame', { requestedIdx });
    setSubmitState(false);
    modalState.onClose();
    setDifficultyLevel('normal');
    gameSocketDisconnect();
    appSocket.off('cancelChallengeGame');
    gameSocket.off('createGameSuccess');
  };

  useEffect(() => {
    return () => {
      modalState.onClose();
      appSocket.emit('cancelChallengeGame', { requestedIdx });
      appSocket.off('checkEnableChallengeGameSuccess');
      gameSocketDisconnect();
    };
  }, []);

  return (
    <>
      <Modal isOpen={modalState.isOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>챌린지 신청</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {!submitState ? (
              <RadioGroup onChange={handleTypeChange} value={difficultyLevel}>
                <Stack direction="row" className="flex justify-evenly">
                  <Radio value="normal">Normal</Radio>
                  <Radio value="hard">Hard</Radio>
                </Stack>
              </RadioGroup>
            ) : enableRequest != 'possible' ? (
              <div className="flex justify-center">
                <span className="text-red-500">
                  {enableRequest == 'impossible'
                    ? '상대방이 오프라인이거나 게임중입니다.'
                    : '차단된 상대방입니다.'}
                </span>
              </div>
            ) : (
              <>
                <div className="text-center font-bold mb-10">
                  상대방이 수락하면 게임이 시작됩니다.
                </div>
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
              </>
            )}
          </ModalBody>
          <ModalFooter>
            {!submitState && (
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                도전
              </Button>
            )}
            <Button onClick={handleModalClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
