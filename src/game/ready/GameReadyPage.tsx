// import { Button } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import UserReadyProfile from './UserReadyProfile';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
// import { GameReadyAtom } from '../../recoil/readystate';
// import { useSetRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { GameUsersAtom } from '../../recoil/gameAtom';

type GameReadyPageProps = {
  gameMode: GameModeType;
};

const GameModeType = {
  LADDER_NORMAL: 1,
  LADDER_HARD: 2,
  CHALLENGE_NORMAL: 3,
  CHALLENGE_HARD: 4,
} as const;

export type GameModeType = (typeof GameModeType)[keyof typeof GameModeType];

export interface IGame {
  end_time: string;
  start_time: string;
  game_mode: GameModeType;
  game_status: boolean;
  gameHost_score: number;
  gameGuest_score: number;
  room_id: string;
  idx: number;
}

export interface UserDataType {
  idx: number;
  id: string;
  nickname: string;
  email: string;
  status: string;
  tfa_enabled: false;
  tfa_secret: null;
  avatar: {
    idx: 1;
    image_data: {
      type: string;
      data: number[];
    };
  };
  record: {
    idx: number;
    total_game: number;
    total_win: number;
    ladder_game: number;
    ladder_win: number;
    general_game: number;
    general_win: number;
  };
  host: IGame | null;
  guest: IGame | null;
  ranking: {
    idx: number;
    score: number;
  };
  requester: number[];
  requested: number[];
  banner: number[];
}

// const READY_SECOND = 50000000;
const READY_SECOND = 3000;

function GameReadyPage(props: GameReadyPageProps) {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate('/game-play');
    }, READY_SECOND + 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(id);
    };
  }, [navigate]);
  const [users, setUsers] = useRecoilState(GameUsersAtom);

  useEffect(() => {
    const getPlayers = async () => {
      // game 정보 가져오고
      // const currentGame = await axios.get();

      // host guest의 정보를 가지고 전적 띄워주고

      // 다음 넘어가기

      const hostData = await axios
        .get('http://localhost:3000/users/idx/3')
        .then((res) => res.data);
      const guestData = await axios
        .get('http://localhost:3000/users/idx/4')
        .then((res) => res.data);

      setUsers({
        host: hostData,
        guest: guestData,
      });
      // setHost(hostData.data);
      // setGuest(guestData.data);
    };
    getPlayers();
  }, []);

  let gameTitle;
  if (props.gameMode === GameModeType.LADDER_HARD) gameTitle = 'Ladder Hard';
  else if (props.gameMode === GameModeType.LADDER_NORMAL)
    gameTitle = 'Ladder Normal';
  else if (props.gameMode === GameModeType.CHALLENGE_HARD)
    gameTitle = 'Challenge Hard';
  else if (props.gameMode === GameModeType.CHALLENGE_NORMAL)
    gameTitle = 'Challenge Normal';

  return (
    <div className="bg-basic-color h-screen flex flex-col items-center justify-start align-middle mt-24">
      <h1 className="text-3xl font-bold mb-10">{`${gameTitle}`}</h1>
      <div className="w-screen h-3/5  flex justify-evenly items-center">
        <UserReadyProfile user={users.host} />

        <div className="flex flex-col justify-between items-center">
          <div className="flex flex-col justify-between items-center w-full">
            <div>
              {/* <p>{`${5 - count} seconds`}</p> */}
              <p>{`${3 - count} seconds`}</p>
            </div>
            <div className="">Ranking</div>
            <div className="flex flex-row justify-between w-full">
              <div className="w-20 h-10 bg-blue-200 rounded-md flex justify-center items-center mr-1">
                #1
                {/* 호스트 랭킹 */}
              </div>
              <div className="w-20 h-10 bg-blue-200 rounded-md flex justify-center items-center ml-1">
                #2
                {/* 게스트 랭킹 */}
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mt-3 mb-3">VS</h1>
        </div>
        <UserReadyProfile user={users.guest} />
      </div>
    </div>
  );
}

export default GameReadyPage;

// 플레이어 1 플레이어 2 같은 페이지
// ready button에 각자의 것만 권한을 가짐
// 다른 플레이어의 ready 상태가 화면에 보여짐 (상태 변화 가져오기)
// 내가 ready를 누르면 상대방에게 ready 표시가 됨 (상태 변화 보내기)
// 둘 중에 늦게 ready button을 누르는 사람이 누르는 순간 게임이 시작됨
