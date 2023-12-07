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
import { useEffect, useRef, useState } from 'react';
import { getCookie } from '../../common/cookie/cookie';
import axios from 'axios';

interface ProfilePictureChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarChange: (imageUrl: string) => void;
}

export const ProfilePictureChangeModal = (
  props: ProfilePictureChangeModalProps,
) => {
  const { isOpen, onClose, onAvatarChange } = props;

  const inputFileRef = useRef<HTMLInputElement>(null);
  const token = getCookie('token');
  const [userIdx, setUserIdx] = useState();

  useEffect(() => {
    fetchUserIdx();
  }, []);

  const fetchUserIdx = async () => {
    try {
      const userData = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUserIdx(userData.data.user_idx);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePictureSubmit = () => {
    if (inputFileRef.current?.files?.[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        if (e !== null && e.target !== null)
          onAvatarChange(e.target.result as string);
      };
      fileReader.readAsDataURL(inputFileRef.current.files[0]);

      const file = inputFileRef.current.files[0];
      const formData = new FormData();
      formData.append('image', file);

      // 백엔드로 이미지 업로드 요청 보내기
      fetch(`${import.meta.env.VITE_SERVER_URL}/avatars/${userIdx}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            onAvatarChange(data.imageUrl);
            onClose();
          }
        })
        .catch((error) => {
          console.error('이미지 업로드 중 오류:', error);
        });
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
};

export default ProfilePictureChangeModal;
