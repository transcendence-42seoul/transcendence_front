import { Route, Routes } from 'react-router-dom';
import './App.css';
import LadderTypeReadyPage from './game/ready/LadderTypeReadyPage';
import ChallengeTypeReadyPage from './game/ready/ChallengeTypeReadyPage';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Routes>
        <Route
          path="/ladder-type-ready"
          element={<LadderTypeReadyPage gameType="Ladder" gameMode="Normal" />}
        />
        <Route
          path="/challenge-type-ready"
          element={
            <ChallengeTypeReadyPage gameType="Challenge" gameMode="Normal" />
          }
        />
      </Routes>
    </ChakraProvider>
  );
}

export default App;
