import { Route, Routes } from 'react-router-dom';
import './App.css';
import GameReadyPage from './game/ready/GameReadyPage';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route
          path="/game-ready"
          // element={<GameReadyPage gameType="Ladder" gameMode="Hard" />}
          element={<GameReadyPage gameType="Challenge" gameMode="Hard" />}
        />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
