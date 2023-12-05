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
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { chatSocket, chatSocketConnect } from '../mini_chat/chat.socket';

interface UpdateChatStateModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  chatIdx: string | undefined;
  type: 'PUBLIC' | 'PRIVATE' | undefined;
}

function UpdateChatStateModal(props: UpdateChatStateModalProps) {
  const { isOpen, onClose, chatIdx, type } = props;
  const navigate = useNavigate();

  const [chatType, setChatType] = useState(type);
  const [password, setPassword] = useState('');

  const isPrivate = chatType === 'PRIVATE';
  const handleTypeChange = (type: any) => {
    setChatType(type);
    if (type === 'PUBLIC') {
      setPassword('');
    }
  };

  const handleSubmit = () => {
    // onChatRoomUpdated();
    onClose();
    chatSocketConnect();

    console.log('password', password);

    chatSocket.emit(
      'updateChat',
      { chatIdx, password },
      (response: { status: 'success'; chat: { idx: number } }) => {
        if (response.status === 'success') {
          console.log('Updated chat room with chat_idx:', response.chat.idx);
          navigate(`/chat/${response.chat.idx}`);
        } else {
          console.error('Failed to update chat room');
        }
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>채널 업데이트</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <RadioGroup onChange={handleTypeChange} value={chatType}>
            <Stack direction="row">
              <Radio value="PUBLIC">Public</Radio>
              <Radio value="PRIVATE">Private</Radio>
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
            Update
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UpdateChatStateModal;
