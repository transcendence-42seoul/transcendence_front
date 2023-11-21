import { useState } from 'react';
import { Box, Image, Button, useDisclosure } from '@chakra-ui/react';
import ProfilePictureChangeModal from './components/ProfilePictureChange';
import { useNavigate } from 'react-router';

const defaultAvatar = 'src/assets/logo.jpg'; // 기본 프로필 이미지 경로

function AvatarSetting() {
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customAvatar, setCustomAvatar] = useState<string>(defaultAvatar); // 사용자가 선택한 커스텀 아바타의 상태

  const handleCustomAvatarChange = (newAvatar: string) => {
    setCustomAvatar(newAvatar);
    onClose();
  };

  const handleCompleteProfileSetup = () => {
    navigate('/main');
  };

  return (
    <Box className="w-screen h-screen flex flex-col items-center justify-center bg-sky-100">
      <div className="text-6xl mb-16 font-bold">아바타 선택</div>
      <Box className="mb-4">
        <Image
          src={customAvatar}
          alt="Custom Avatar"
          boxSize={{ base: '250px', md: '450px' }}
          borderRadius="full"
          border={2}
          borderStyle={'solid'}
          borderColor={'black'}
        />
      </Box>
      <Button colorScheme="blue" onClick={onOpen} mb={20}>
        파일 첨부
      </Button>
      <Button colorScheme="teal" onClick={handleCompleteProfileSetup}>
        프로필 설정 완료
      </Button>

      <ProfilePictureChangeModal
        isOpen={isOpen}
        onClose={onClose}
        onAvatarChange={handleCustomAvatarChange}
      />
    </Box>
  );
}

export default AvatarSetting;
