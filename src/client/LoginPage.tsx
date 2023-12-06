import { Button } from '@chakra-ui/react';
import axios from 'axios';

function LoginPage() {
  // 백엔드의 loginWith42 함수로 요청을 보내고, 받은 URL로 리디렉션하는 함수
  const handleLogin = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth/oauth/42/authorize`,
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Login error', error);
    }
  };

  return (
    <div className="bg-basic-color w-screen h-screen flex flex-col items-start justify-start align-middl bg-pink-50">
      <div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-opacity-100 px-12 py-6 rounded flex flex-col justify-start items-center"
        style={{ width: '40%', height: '30%' }}
      >
        <h1 className="text-7xl font-bold pb-12">기절초퐁</h1>
        <Button
          colorScheme="teal"
          variant="outline"
          onClick={handleLogin}
          mr={1}
        >
          42 계정으로 로그인
        </Button>
      </div>
      <div className="bg-basic-color w-screen h-screen flex flex-row justify-center items-start">
        <img
          src={'./gamepong.png'}
          alt="left"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

export default LoginPage;
