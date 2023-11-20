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
import { useRef } from 'react';

function ProfilePictureChangeModal({ isOpen, onClose, onAvatarChange }) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handlePictureSubmit = () => {
    if (inputFileRef.current?.files?.[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        onAvatarChange(e.target.result as string);
      };
      fileReader.readAsDataURL(inputFileRef.current.files[0]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>프로필 사진 변경</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input type="file" accept="image/*" pt={1} ref={inputFileRef} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handlePictureSubmit}>
            변경하기
          </Button>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ProfilePictureChangeModal;
