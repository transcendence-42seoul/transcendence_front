import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import GameReadyPage from './game/ready/GameReadyPage';
import GamePlayPage from './game/play/pong/GamePlayPage';
import PongGame from './game/play/pong/PongGame';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './client/WelcomePage';
import LoginPage from './client/LoginPage';
import MainPage from './client/MainPage';
import SettingPage from './client/SettingPage';
import AuthenticationPage from './client/Authentication';
import UserPage from './client/UserPage';
import MyPage from './client/MyPage';
import BanListPage from './client/BanListPage';
import AvatarSetting from './client/AvatarSetting';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route
          path="/game-ready"
          element={<GameReadyPage gameMode={3} />}
          // element={<GameReadyPage gameType="Challenge" gameMode="Hard" />}
        />
        <Route path="/game-play" element={<GamePlayPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/authentication" element={<AuthenticationPage />} />
        <Route path="/ban-list" element={<BanListPage />} />
        <Route path="/avatar-setting" element={<AvatarSetting />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
