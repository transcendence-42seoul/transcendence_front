import { Route, Routes } from 'react-router-dom';
import './App.css';
import GameReadyPage from './game/ready/GameReadyPage';
import { ChakraProvider } from '@chakra-ui/react';
import WelcomePage from './client/WelcomePage';
import LoginPage from './client/LoginPage';
import MainPage from './client/mainPage';
import SettingPage from './client/SettingPage';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route
          path="/game-ready"
          // element={<GameReadyPage gameType="Ladder" gameMode="Hard" />}
          element={<GameReadyPage gameType="Challenge" gameMode="Hard" />}
        />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/setting" element={<SettingPage />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
