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

function UpdateChatStateModal({ isOpen, opOpen, onClose, chatIdx, type }) {
  const navigate = useNavigate();

  const [chatType, setChatType] = useState(type);
  const [password, setPassword] = useState('');

  const isPrivate = chatType === 'PRIVATE';
  console.log('isPrivate', isPrivate);

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

    chatSocket.emit('updateChat', { chatIdx, password }, (response) => {
      if (response.status === 'success') {
        console.log('Updated chat room with chat_idx:', response.chat.idx);
        navigate(`/chat/${response.chat.idx}`);
      } else {
        console.error('Failed to update chat room');
      }
    });
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
