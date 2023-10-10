import { Route, Routes } from 'react-router-dom';
import './App.css';
import GameReadyPage from './game/ready/GameReadyPage';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route path="/game-ready" element={<GameReadyPage mode="Ladder" />} />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
