import logo from '../assets/logo.svg';
import { Button } from '@chakra-ui/react';

function LoginPage() {
  return (
    <div className="bg-basic-color h-screen flex flex-col items-center justify-start align-middle mt-24 bg-green-200">
      <div className="w-screen h-3/5  flex justify-evenly items-center">
        <img src={logo} alt="logo" style={{ width: '100px', height: 'auto' }} />
      </div>
      <div>
        <Button colorScheme="teal" variant="outline" onClick={() => {}} mr={1}>
          42 Intra
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
