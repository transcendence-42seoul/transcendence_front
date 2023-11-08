import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import GameReadyPage from './game/ready/GameReadyPage';
import GamePlayPage from './game/play/GamePlayPage';
import PongGame from './game/play/PongGame';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route
          path="/game-ready"
          element={<GameReadyPage gameType="Ladder" gameMode="Hard" />}
          // element={<GameReadyPage gameType="Challenge" gameMode="Hard" />}
        />
        <Route path="/game-play" element={<GamePlayPage />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
