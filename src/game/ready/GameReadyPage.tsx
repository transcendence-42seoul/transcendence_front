import { useState, useEffect, useRef } from 'react';
import UserReadyProfile from './UserReadyProfile';
import { useRecoilValue } from 'recoil';
import {
  GameHostInfoSelector,
  GameguestInfoSelector,
} from '../../recoil/gameAtom';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './styles.css';
import { UserStatus } from '../GamePage';
import { gameSocket } from '../socket/game.socket';

type GameReadyPageProps = {
  gameMode: GameModeType;
  setUserStatus: React.Dispatch<React.SetStateAction<UserStatus>>;
};

const GameModeType = {
  LADDER_NORMAL: 1,
  LADDER_HARD: 2,
  CHALLENGE_NORMAL: 3,
  CHALLENGE_HARD: 4,
} as const;

export type GameModeType = (typeof GameModeType)[keyof typeof GameModeType];

export interface IRecord {
  idx: number;
  total_game: number;
  total_win: number;
  ladder_game: number;
  ladder_win: number;
  general_game: number;
  general_win: number;
}

export interface IGame {
  end_time: string;
  start_time: string;
  game_mode: GameModeType;
  game_status: boolean;
  gameHost_score: number;
  gameGuest_score: number;
  __game_host__: UserDataType;
  __game_guest__: UserDataType;
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
    idx: number;
    image_data: {
      type: string;
      data: number[];
    };
  };
  record: IRecord;
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

// const READY_SECOND = 3000;

const renderTime = (props: { remainingTime: number }) => {
  const { remainingTime } = props;
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(0);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? 'up' : ''}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? 'down' : ''}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

function GameReadyPage(props: GameReadyPageProps) {
  const host = useRecoilValue(GameHostInfoSelector);
  const guest = useRecoilValue(GameguestInfoSelector);

  let gameTitle;
  if (props.gameMode === GameModeType.LADDER_HARD) gameTitle = 'LADDER HARD';
  else if (props.gameMode === GameModeType.LADDER_NORMAL)
    gameTitle = 'LADDER NORMAL';
  else if (props.gameMode === GameModeType.CHALLENGE_HARD)
    gameTitle = 'CHALLENGE HARD';
  else if (props.gameMode === GameModeType.CHALLENGE_NORMAL)
    gameTitle = 'CHALLENGE NORMAL';

  const [countDown, setCountDown] = useState(5);
  useEffect(() => {
    gameSocket.on('countDown', (data) => {
      setCountDown(data);
    });

    return () => {
      gameSocket.off('countDown');
    };
  }, []);

  useEffect(() => {
    if (countDown === 0) {
      props.setUserStatus(UserStatus.PLAYING);
    }
  }, [countDown]);

  return (
    <div className="bg-basic-color bg-sky-100 h-screen flex flex-col items-center justify-start align-middle pt-24">
      <h1 className="text-5xl font-bold mb-24">{`${gameTitle}`}</h1>
      <div className="w-screen flex justify-evenly items-center">
        <UserReadyProfile user={host} />
        <div className="flex flex-col justify-between items-center">
          <div className="flex flex-col justify-between items-center w-full relative">
            <div className="timer-wrapper">
              <CountdownCircleTimer
                isPlaying
                duration={5}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[5, 3, 1, 0]}
              >
                {() =>
                  renderTime({
                    remainingTime: countDown,
                  })
                }
              </CountdownCircleTimer>
            </div>
          </div>
        </div>
        <UserReadyProfile user={guest} />
      </div>
    </div>
  );
}

export default GameReadyPage;
