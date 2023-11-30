import { useEffect, useState } from 'react';
import { Box, Image, Button, useDisclosure, Input } from '@chakra-ui/react';
import ProfilePictureChangeModal from './components/ProfilePictureChange';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { getCookie } from '../common/cookie/cookie';

const defaultAvatar = 'src/assets/logo.jpg'; // 기본 프로필 이미지 경로

function AvatarSetting() {
  const token = getCookie('token');
  const [userIdx, setUserIdx] = useState<number>(0);

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customAvatar, setCustomAvatar] = useState<string>(defaultAvatar); // 사용자가 선택한 커스텀 아바타의 상태

  const [nickname, setNickname] = useState<string>('');
  const [isNicknameAvailable, setIsNicknameAvailable] =
    useState<boolean>(false);

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

  const handleCustomAvatarChange = (newAvatar: string) => {
    setCustomAvatar(newAvatar);
    onClose();
  };

  const updateNickname = () => {
    try {
      console.log('nickname:', nickname);

      axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/users/${userIdx}/nickname`,
        { nickname: nickname },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompleteProfileSetup = () => {
    updateNickname();
    navigate('/main');
  };

  const handleCheckNickname = () => {
    try {
      console.log('nickname:', nickname);

      if (nickname.trim() === '') {
        alert('닉네임을 입력해주세요.');
        return;
      }

      axios
        .get(
          `${import.meta.env.VITE_SERVER_URL}/users/check-nickname/${nickname}`,
        )
        .then((response) => {
          console.log(response.data);
          if (response.data) {
            setIsNicknameAvailable(true);
            alert('사용 가능한 사용자 이름입니다.');
          } else {
            setIsNicknameAvailable(false);
            alert('이미 사용 중인 사용자 이름입니다.');
          }
        })
        .catch((error) => {
          console.error('중복 확인 요청 중 에러 발생:', error);
          alert('중복 확인 요청 중 에러가 발생했습니다.');
        });
    } catch (error) {
      console.log(error);
    }
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
      <Button colorScheme="blue" onClick={onOpen}>
        파일 첨부
      </Button>

      <div
        className="flex flex-row"
        style={{ width: '100%', maxWidth: '350px' }}
      >
        <Input
          placeholder="사용자 이름을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          mb={4}
          mt={4}
          mr={2}
          borderColor="black"
          borderWidth="2px"
          borderStyle="solid"
        />
        <Button colorScheme="blue" mb={4} mt={4} onClick={handleCheckNickname}>
          중복 확인
        </Button>
      </div>

      <Button
        colorScheme="teal"
        onClick={handleCompleteProfileSetup}
        isDisabled={!isNicknameAvailable || !nickname}
      >
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
