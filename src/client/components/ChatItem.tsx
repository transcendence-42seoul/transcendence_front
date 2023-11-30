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
} from '@chakra-ui/react';
import { useState } from 'react';

export interface IChatRoom {
  idx: number;
  name: string;
  limit: number;
  currentParticipant: number;
  type: string;
  password: string;
  isHighlighted: boolean;
}

interface ChatItemProps {
  chatRoom: IChatRoom;
  onClick: (chatRoom: IChatRoom) => void;
  onDoubleClick: (chatRoom: IChatRoom) => void;
}

export const ChatItem = (props: ChatItemProps) => {
  const { chatRoom, onClick, onDoubleClick } = props;
  return (
    <div
      className={`flex justify-between items-center p-4 my-2 mx-2
		  border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
        chatRoom.isHighlighted ? 'bg-blue-100' : 'bg-white'
      }`}
      onClick={() => onClick(chatRoom)}
      onDoubleClick={() => onDoubleClick(chatRoom)}
    >
      <span>{chatRoom.name}</span>
      <span>{`${chatRoom.currentParticipant}/${chatRoom.limit}`}</span>
      <span>{chatRoom.type}</span>
    </div>
  );
};

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string, chatRoom: IChatRoom) => void;
  chatRoom: IChatRoom;
}

export const PasswordModal = (props: PasswordModalProps) => {
  const { isOpen, onClose, onSubmit: onSubmit, chatRoom } = props;

  const [password, setPassword] = useState('');

  const handlePasswordSubmit = () => {
    onSubmit(password, chatRoom);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{chatRoom.name} - Enter Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handlePasswordSubmit}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
