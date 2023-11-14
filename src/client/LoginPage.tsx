import logo from '../assets/logo.svg';
import { Button } from '@chakra-ui/react';
import axios from 'axios';

function LoginPage() {
  // 백엔드의 loginWith42 함수로 요청을 보내고, 받은 URL로 리디렉션하는 함수
  const handleLogin = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/auth/oauth/42/authorize',
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Login error', error);
    }
  };

  return (
    <div className="bg-basic-color h-screen flex flex-col items-center justify-start align-middle mt-24 bg-green-200">
      <div className="w-screen h-3/5  flex justify-evenly items-center">
        <img src={logo} alt="logo" style={{ width: '100px', height: 'auto' }} />
      </div>
      <div>
        <Button
          colorScheme="teal"
          variant="outline"
          onClick={handleLogin}
          mr={1}
        >
          42 Intra
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
