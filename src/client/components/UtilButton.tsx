import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { chatSocket, chatSocketConnect } from '../mini_chat/chat.socket';
import { CreateLadderModal } from '../modal/CreateLadderModal/CreateLadderModal';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatRoomAdded: () => void;
}

interface CreateChatResponse {
  status: string;
  chatIdx: number;
}

export const CreateChannelModal = (props: CreateChannelModalProps) => {
  const { isOpen, onClose, onChatRoomAdded } = props;

  const navigate = useNavigate();

  const [channelType, setChannelType] = useState('public');
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [maxPeople, setMaxPeople] = useState('');
  const maxPeopleOptions = Array.from({ length: 9 }, (_, i) => i + 2);

  const isPrivate = channelType === 'private';

  const handleTypeChange = (type: string) => {
    setChannelType(type);
    if (type === 'PUBLIC') {
      setPassword('');
    }
  };

  const handleSubmit = () => {
    onChatRoomAdded();
    onClose();
    chatSocketConnect();

    chatSocket.emit(
      'createChat',
      { title, password, maxPeople },
      (response: CreateChatResponse) => {
        console.log('response', response);
        if (response.status === 'success') {
          console.log('Created chat room with chat_idx:', response.chatIdx);
          navigate(`/chat/${response.chatIdx}`);
        } else {
          console.error('Failed to create chat room');
        }
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>채널 생성</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Input
            placeholder="채널명"
            mb={4}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            placeholder="최대 인원 선택"
            mb={4}
            value={maxPeople}
            onChange={(e) => setMaxPeople(e.target.value)}
          >
            {maxPeopleOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </Select>
          <RadioGroup onChange={handleTypeChange} value={channelType}>
            <Stack direction="row">
              <Radio value="public">Public</Radio>
              <Radio value="private">Private</Radio>
            </Stack>
          </RadioGroup>
          {isPrivate && (
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              mt={4}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface UtilButtonProps {
  pageType: string;
  onChatState: () => void;
}

interface UtilButton {
  label: string;
  onClick: () => void;
}

export const UtilButton = (props: UtilButtonProps) => {
  const { pageType, onChatState } = props;

  const {
    isOpen: isCreateChannelOpen,
    onOpen: onOpenCreateChannel,
    onClose: onCloseCreateChannel,
  } = useDisclosure();

  const utilButtonData = [
    ...(pageType === 'main'
      ? [{ label: '채널 생성', onClick: onOpenCreateChannel }]
      : []),
    ...(pageType === 'chat'
      ? [{ label: '채널 나가기', onClick: onChatState }]
      : []),
  ];

  const UtilButton = (props: UtilButton) => {
    const { label, onClick } = props;

    return (
      <Button
        colorScheme="teal"
        variant="outline"
        width={'full'}
        mx={2}
        onClick={onClick}
      >
        {label}
      </Button>
    );
  };

  return (
    <div className="h-1/6 flex flex-row items-center align-middle justify-between">
      <CreateLadderModal />
      {utilButtonData.map((button, index) => (
        <UtilButton key={index} label={button.label} onClick={button.onClick} />
      ))}

      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={onCloseCreateChannel}
        onChatRoomAdded={onChatState}
      />
    </div>
  );
};

export default UtilButton;
