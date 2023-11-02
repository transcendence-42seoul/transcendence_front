import { Route, Routes } from 'react-router-dom';
import './App.css';
import GameReadyPage from './game/ready/GameReadyPage';
import { ChakraProvider } from '@chakra-ui/react';
import GamePlayPage from './game/play/GamePlayPage';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route
          path="/game-ready"
          // element={<GameReadyPage gameType="Ladder" gameMode="Hard" />}
          element={<GameReadyPage gameType="Challenge" gameMode="Hard" />}
        />
        <Route path="/game-play" element={<GamePlayPage />} />
        <Route path="/home" element={<div>Home</div>} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
