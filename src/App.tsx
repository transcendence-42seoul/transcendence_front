import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WelcomePage from './client/WelcomePage';
import LoginPage from './client/LoginPage';
import MainPage from './client/MainPage';
import SettingPage from './client/SettingPage';
import AuthenticationPage from './client/Authentication';
import GamePage from './game/GamePage';
import UserPage from './client/UserPage';
import MyPage from './client/MyPage';
import BanListPage from './client/BanListPage';
import AvatarSetting from './client/AvatarSetting';
import ChatPage from './client/chat';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getCookie, removeCookie } from './common/cookie/cookie';
import {
  appSocketConnect,
  appSocketDisconnect,
} from './common/socket/app.socket';
import axios from 'axios';
import ModalLayout from './client/modal/ModalLayout/ModalLayout';
import DmPage from './client/DmChat';

function App() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const checkToken = async () => {
    const token = getCookie('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('token 올바르지 않습니다.');
      removeCookie('token');
      navigate('/login');
      return;
    }

    if (currentPath === '/') {
      navigate('/welcome');
    }
    if (currentPath === '/login' || currentPath === '/welcome') {
      navigate('/main');
    }
    appSocketConnect();
  };

  useEffect(() => {
    return () => {
      appSocketDisconnect();
    };
  }, []);

  useEffect(() => {
    checkToken();
  }, [currentPath]);

  return (
    <ChakraProvider>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route
          path="/main"
          element={
            <ModalLayout>
              <MainPage />
            </ModalLayout>
          }
        />
        <Route
          path="/setting"
          element={
            <ModalLayout>
              <SettingPage />
            </ModalLayout>
          }
        />
        <Route
          path="/userpage/:idx"
          element={
            <ModalLayout>
              <UserPage />
            </ModalLayout>
          }
        />
        <Route
          path="/mypage"
          element={
            <ModalLayout>
              <MyPage />
            </ModalLayout>
          }
        />
        <Route
          path="/authentication"
          element={
            <ModalLayout>
              <AuthenticationPage />
            </ModalLayout>
          }
        />
        <Route
          path="/ban-list"
          element={
            <ModalLayout>
              <BanListPage />
            </ModalLayout>
          }
        />
        <Route
          path="/avatar-setting"
          element={
            <ModalLayout>
              <AvatarSetting />
            </ModalLayout>
          }
        />
        <Route
          path="/chat/:idx"
          element={
            <ModalLayout>
              <ChatPage />
            </ModalLayout>
          }
        />
        <Route
          path="/dm/:idx"
          element={
            <ModalLayout>
              <DmPage />
            </ModalLayout>
          }
        />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
