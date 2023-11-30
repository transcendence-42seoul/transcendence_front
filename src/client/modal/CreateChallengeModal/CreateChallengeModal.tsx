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
import { useNavigate } from 'react-router';
import { appSocket } from '../../../common/socket/app.socket';
import { TUserStatus } from '../../../common/avatar/SmallAvatar';

type difficultyLevelType = 'normal' | 'hard';

interface CreateChallengeModalProps {
  requestedIdx: number;
}

export const CreateChallengeModal = (props: CreateChallengeModalProps) => {
  const { requestedIdx } = props;
  const navigate = useNavigate();
  const [difficultyLevel, setDifficultyLevel] =
    useState<difficultyLevelType>('normal');
  const [enableRequest, setEnableRequest] = useState<boolean>(false);
  const handleTypeChange = (value: difficultyLevelType) => {
    setDifficultyLevel(value);
  };

  const [submitState, setSubmitState] = useState<boolean>(false);

  const handleSubmit = () => {
    // event.stopPropagation();
    console.log('1adfasdfaasdlkfmlksdmflamsdlfkmsdfsadf');
    setSubmitState(true);
    // gameSocketConnect();

    appSocket.emit('checkEnableChallengeGame', {
      gameMode: difficultyLevel,
      requestedIdx,
    });

    appSocket.on(
      'checkEnableChallengeGameSuccess',
      (data: { status: TUserStatus; success: false }) => {
        console.log('1');

        console.log('checkEnableChallengeGameSuccess', data);
        const { success } = data;
        if (!success) {
          setEnableRequest(false);
        } else {
          setEnableRequest(true);
        }
      },
    );
    console.log('2');

    gameSocket.on('createGameSuccess', (game) => {
      navigate(`/game/${game.room_id}`);
    });
  };

  const {
    isOpen: isCreateChallengeOpen,
    onOpen: onOpenCreateChallenge,
    onClose: onCloseCreateChallenge,
  } = useDisclosure();

  const handleModalClose = () => {
    console.log('111111');
    setSubmitState(false);
    onCloseCreateChallenge();
    setDifficultyLevel('normal');
    gameSocketDisconnect();
    gameSocket.off('createGameSuccess');
    // gameSocket.off('submitChallenge');
    // gameSocket.off('error');
  };

  useEffect(() => {
    gameSocketConnect();
    return () => {
      console.log('unmount');
      // handleModalClose();
      appSocket.emit('cancelChallengeGame', { requestedIdx });
      appSocket.off('checkEnableChallengeGameSuccess');
      gameSocketDisconnect();
    };
  }, []);

  return (
    <>
      <li
        className="p-2 hover:bg-gray-100 cursor-pointer"
        onClick={onOpenCreateChallenge}
      >
        챌린지
      </li>
      <Modal
        isOpen={isCreateChallengeOpen}
        onClose={handleModalClose}
        isCentered
      >
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
            ) : !enableRequest ? (
              <div className="flex justify-center">
                <span className="text-red-500">
                  상대방이 오프라인이거나 게임중입니다.
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
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                도전
              </Button>
            )}
            <Button>취소</Button>
            {/* <Button onClick={handleModalClose}>취소</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
