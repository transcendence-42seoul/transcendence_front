import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameReadyPage from './ready/GameReadyPage';
import GamePlayPage from './play/pong/GamePlayPage';
import { useRecoilState } from 'recoil';
import { GameAtom } from '../recoil/gameAtom';
import axios from 'axios';
import { getCookie } from '../common/cookie/cookie';
import {
  gameSocket,
  gameSocketConnect,
  gameSocketDisconnect,
} from './socket/game.socket';

export enum UserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PLAYING = 'PLAYING',
}

const GamePage = () => {
  const [userStatus, setUserStatus] = useState<UserStatus>(UserStatus.ONLINE);
  const [gameData, setGameData] = useRecoilState(GameAtom);

  const [myId, setMyId] = useState<string>('');
  const navigation = useNavigate();
  useEffect(() => {
    const getMyId = async () => {
      const token = getCookie('token');

      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      response.data.id && setMyId(response.data.id);
    };

    const setGameState = async () => {
      try {
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
      } catch (error) {
        navigation('/main');
        console.log(error);
      }
    };

    gameSocket.on('error', (error) => {
      navigation('/login');
      console.error('Socket connection error:', error);
    });

    gameSocket.on('disconnect', () => {
      console.error('게임 소켓이 연결이 끊겼습니다.');
    });

    try {
      gameSocketConnect();
      setGameState();
      getMyId();
    } catch (error) {
      console.log(error);
    }

    return () => {
      gameSocket.off('error');
      gameSocket.off('disconnect');
      gameSocket.off('getGameInfo');
      gameSocketDisconnect();
    };
  }, []);

  return (
    <>
      {userStatus === UserStatus.PLAYING ? (
        <GamePlayPage myId={myId} />
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
