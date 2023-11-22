import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './client/WelcomePage';
import LoginPage from './client/LoginPage';
import MainPage from './client/MainPage';
import SettingPage from './client/SettingPage';
import AuthenticationPage from './client/Authentication';
import GamePage from './game/GamePage';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/authentication" element={<AuthenticationPage />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
