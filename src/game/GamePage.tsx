import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GameReadyPage from './ready/GameReadyPage';
import GamePlayPage from './play/pong/GamePlayPage';
import { useRecoilState } from 'recoil';
import { GameAtom } from '../recoil/gameAtom';
import axios from 'axios';
import { getCookie } from '../common/cookie/cookie';
import { gameSocket, gameSocketConnect } from './socket/game.socket';

export enum UserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PLAYING = 'PLAYING',
}

const GamePage = () => {
  const { id } = useParams<{ id: string }>();
  const [userStatus, setUserStatus] = useState<UserStatus>();
  const [gameData, setGameData] = useRecoilState(GameAtom);

  const navigation = useNavigate();
  useEffect(() => {
    const setGameState = async () => {
      if (Object.keys(gameData).length === 0) {
        const token = getCookie('token');
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/games`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setUserStatus(response.data.__game_guest__.status);
        setGameData(response.data);
      }
    };

    gameSocket.on('error', (error) => {
      navigation('/login');
      console.error('Socket connection error:', error);
    });

    gameSocket.on('disconnect', () => {
      console.log('소켓이 연결이 끊겼습니다.');
    });

    try {
      gameSocketConnect();
      setGameState();
    } catch (error) {
      console.log(error);
    }

    return () => {
      gameSocket.off('error');
      gameSocket.off('disconnect');
      gameSocket.off('getGameInfo');
    };
  }, []);

  return (
    <>
      {userStatus === UserStatus.PLAYING ? (
        <GamePlayPage />
      ) : (
        <GameReadyPage
          gameMode={gameData.game_mode}
          setUserStatus={setUserStatus}
        />
      )}
    </>
  );
};

export default GamePage;
