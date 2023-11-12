import { useEffect, useRef, useState } from 'react';
import { GameType } from './pong_engin';
import { io } from 'socket.io-client';

const serverUrl: string = 'http://localhost:3000/games';

const PongGame = () => {
  const socketRef = useRef(
    io(serverUrl, {
      transports: ['websocket'],
    }),
  );
  const [game, setGame] = useState<GameType>();

  useEffect(() => {
    socketRef.current.on('connection', () => {});

    return () => {};
  }, [game]);
  return <canvas></canvas>;
};

export default PongGame;
