import { Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import UserReadyProfile from './UserReadyProfile';
import { useNavigate } from 'react-router';
// import { GameReadyAtom } from '../../recoil/readystate';
// import { useSetRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';

type GameReadyPageProps = {
  gameType: 'Ladder' | 'Challenge';
  gameMode: 'Normal' | 'Hard';
};

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
  ranking: {
    idx: number;
    score: number;
  };
  requester: number[];
  requested: number[];
  banner: number[];
}

const READY_SECOND = 500000;

function GameReadyPage(props: GameReadyPageProps) {
  const navigate = useNavigate();
  const [readyState, setReadyState] = useState(false);
  const [count, setCount] = useState(0);

  if (props.gameType === 'Ladder') {
    useEffect(() => {
      const id = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000); // 페이지 수정할 때 자꾸 넘어가서 임시로 큰 값 설정

      const timeout = setTimeout(() => {
        navigate('/game-play');
      }, READY_SECOND + 1000); // 5초 설정

      return () => {
        clearTimeout(timeout);
        clearInterval(id);
      };
      // }, [count, navigate]);
    }, [navigate]);

    // return (
    //   <div>
    //     <p>{`Redirecting in ${count} seconds`}</p>
    //   </div>
    // )
    // }
    // , [navigate]);
  }

  // const [readyState, setReadyState] = useState(false);
  // const [player1Ready, setPlayer1Ready] = useState(false);
  // const [reqContent1, setReqContent1] = useState({
  //   user_idx: 1, // find_by_idx
  //   ready: false,
  // });

  // const [reqContent2, setReqContent2] = useState({
  //   id: 2, // find_by_idx
  //   ready: false,
  // });

  // const setContent1 = useSetRecoilState(GameReadyAtom);
  // const Content1 = useRecoilValue(GameReadyAtom);

  // useEffect(() => {
  // setContent1(reqContent1);
  // }
  // , [reqContent1, setContent1]);

  const onClickButton = () => {
    setReadyState(!readyState);
  };
  // const onClickButton = () => {
  //   if (player1Ready == false)
  //     setPlayer1Ready(true)
  //   if (player2Ready == false)
  //     setPlayer2Ready(true)
  //   setPlayer1Ready(!player1Ready);
  //   setPlayer2Ready(!player2Ready);
  // };
  const startGame = () => {
    // if (player1Ready && player2Ready) {
    navigate('/game-play');
    // }
  };

  const [player1, setPlayer1] = useState<UserDataType>();
  const [player2, setPlayer2] = useState<UserDataType>();

  useEffect(() => {
    const getPlayers = async () => {
      const player1Data = await axios.get('http://localhost:3000/users/1');
      const player2Data = await axios.get('http://localhost:3000/users/2');

      setPlayer1(player1Data.data);
      setPlayer2(player2Data.data);

      console.log(player1Data.data);
      console.log(player2Data.data);
    };
    console.log('getPlayers');
    getPlayers();
  }, []);
  return (
    <div className="bg-basic-color h-screen flex flex-col items-center justify-start align-middle mt-24">
      <h1 className="text-3xl font-bold mb-10">{`${props.gameType} ${props.gameMode}`}</h1>
      <div className="w-screen h-3/5  flex justify-evenly items-center">
        <UserReadyProfile user={player1} url={`./jiwoo.jpeg`} />

        <div className="flex flex-col justify-between items-center">
          {props.gameType === 'Challenge' ? (
            <div className="flex flex-row justify-between w-full">
              {readyState ? (
                <Button
                  colorScheme="teal"
                  variant="solid"
                  onClick={onClickButton}
                >
                  Normal
                </Button>
              ) : (
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={onClickButton}
                >
                  Hard
                </Button>
              )}
              {/* <Button
                colorScheme="teal"
                variant="outline"
                onClick={onClickButton}
                mr={1} // add margin to the right of the button
              >
                Normal
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={onClickButton}
                ml={1} // add margin to the left of the button
              >
                Hard
              </Button> */}
            </div>
          ) : null}
          {props.gameType === 'Ladder' ? (
            <div className="flex flex-col justify-between items-center w-full">
              <div>
                {/* <p>{`${5 - count} seconds`}</p> */}
                <p>{`${5 - count} seconds`}</p>
              </div>
              <div className="">Ranking</div>
              <div className="flex flex-row justify-between w-full">
                <div className="w-20 h-10 bg-blue-200 rounded-md flex justify-center items-center mr-1">
                  #1
                </div>
                <div className="w-20 h-10 bg-blue-200 rounded-md flex justify-center items-center ml-1">
                  #2
                </div>
              </div>
            </div>
          ) : null}
          <h1 className="text-4xl font-bold mt-3 mb-3">VS</h1>
          {/* <button onClick={() => setPlayer1Ready(true)}>Player 1 Ready</button> */}
          {/* <button onClick={() => setPlayer2Ready(true)}>Player 2 Ready</button> */}
          {props.gameType === 'Challenge' ? (
            <button onClick={startGame}>Start Game</button>
          ) : null}
        </div>
        <UserReadyProfile user={player2} url={`./jiwoo.jpeg`} />
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
