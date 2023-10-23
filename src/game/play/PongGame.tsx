import { useEffect } from 'react';
import CGame from './pong_engin';

function PongGame() {
  useEffect(() => {
    const Pong = new CGame();
    Pong.initialize();
  }, []);
  return <canvas></canvas>;
}

export default PongGame;
