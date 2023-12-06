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

type difficultyLevelType = 'normal' | 'hard';

export const CreateLadderModal = () => {
  const navigate = useNavigate();
  const [difficultyLevel, setDifficultyLevel] =
    useState<difficultyLevelType>('normal');

  const [enableJoinQueue, setEnalbeJoinQueue] = useState<boolean>(true);
  const handleTypeChange = (value: difficultyLevelType) => {
    setDifficultyLevel(value);
  };

  const [submitState, setSubmitState] = useState<boolean>(false);

  const handleSubmit = () => {
    setSubmitState(true);
    gameSocketConnect();
    gameSocket.emit('joinLadderQueue', {
      mode: difficultyLevel,
      token: getCookie('token'),
    });

    gameSocket.on('error', () => {
      setEnalbeJoinQueue(false);
    });

    gameSocket.on('createGameSuccess', (game) => {
      navigate(`/game/${game.room_id}`);
    });
  };

  const {
    isOpen: isCreateLadderOpen,
    onOpen: onOpenCreateLadder,
    onClose: onCloseCreateLadder,
  } = useDisclosure();

  const handleModalClose = () => {
    setSubmitState(false);
    onCloseCreateLadder();
    setDifficultyLevel('normal');
    gameSocketDisconnect();
    gameSocket.off('createGameSuccess');
    gameSocket.off('joinLadderQueue');
    gameSocket.off('error');
    setEnalbeJoinQueue(true);
  };

  useEffect(() => {
    return () => {
      handleModalClose();
    };
  }, []);

  return (
    <>
      <Button
        colorScheme="teal"
        variant="outline"
        width={'full'}
        mx={2}
        onClick={onOpenCreateLadder}
      >
        경쟁전
      </Button>
      <Modal isOpen={isCreateLadderOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>경쟁전 신청</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {enableJoinQueue ? (
              !submitState ? (
                <RadioGroup onChange={handleTypeChange} value={difficultyLevel}>
                  <Stack direction="row" className="flex justify-evenly">
                    <Radio value="normal">Normal</Radio>
                    <Radio value="hard">Hard</Radio>
                  </Stack>
                </RadioGroup>
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
              )
            ) : (
              <span className="text-2xl">경쟁전에 참여할 수 없습니다.</span>
            )}
          </ModalBody>
          <ModalFooter>
            {!submitState && (
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Submit
              </Button>
            )}
            <Button onClick={handleModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
