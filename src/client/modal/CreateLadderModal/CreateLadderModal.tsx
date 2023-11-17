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
import { useState } from 'react';

type difficultyLevelType = 'normal' | 'hard';

export const CreateLadderModal = () => {
  const [difficultyLevel, setDifficultyLevel] =
    useState<difficultyLevelType>('normal');

  const handleTypeChange = (value: difficultyLevelType) => {
    setDifficultyLevel(value);
  };

  const [submitState, setSubmitState] = useState<boolean>(false);

  const handleSubmit = () => {
    // radder 대기열에 등록
    setSubmitState(true);
    // onCloseCreateRadder();
  };

  const {
    isOpen: isCreateRadderOpen,
    onOpen: onOpenCreateRadder,
    onClose: onCloseCreateRadder,
  } = useDisclosure();

  const handleCancleButton = () => {
    setSubmitState(false);
    onCloseCreateRadder();
  };

  const handleModalClose = () => {
    setSubmitState(false);
    onCloseCreateRadder();
  };

  return (
    <>
      <Button
        colorScheme="teal"
        variant="outline"
        width={'full'}
        mx={2}
        onClick={onOpenCreateRadder}
      >
        경쟁전
      </Button>
      <Modal isOpen={isCreateRadderOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>경쟁전 신청</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {!submitState ? (
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
            )}
          </ModalBody>
          <ModalFooter>
            {!submitState && (
              <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                Submit
              </Button>
            )}
            <Button onClick={handleCancleButton}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
