import { useEffect, useState } from 'react';
import SmallUserProfile from './SmallUserProfile';
import MiniChatting from '../mini_chat/MiniChatting';
import PongGame from './PongGame';
import { useRecoilValue } from 'recoil';
import {
  GameHostInfoSelector,
  GameguestInfoSelector,
} from '../../../recoil/gameAtom';
import { gameSocket } from '../../socket/game.socket';
import ResultComponent from './ResultComponent';

interface GamePlayPageProps {
  myId: string;
}

function GamePlayPage(props: GamePlayPageProps) {
  const host = useRecoilValue(GameHostInfoSelector);
  const guest = useRecoilValue(GameguestInfoSelector);

  const userA_avatar = {
    idx: host.idx,
    name: host.id,
    imageData: host.avatar.image_data.data,
  };

  const userB_avatar = {
    idx: guest.idx,
    name: guest.id,
    imageData: guest.avatar.image_data.data,
  };

  const [gameEndState, setGameEndState] = useState(false);
  const [winner, setWinner] = useState<'Host' | 'Guest'>('Host');

  useEffect(() => {
    gameSocket.on('endGame', () => {
      setGameEndState(true);
    });
    return () => {
      gameSocket.off('endGame');
    };
  }, []);
  return (
    <div className="flex flex-col items-center h-screen max-h-screen w-screen max-w-screen pt-12">
      <h1 className="text-3xl h-[5%] font-bold mb-10">GamePlayPage</h1>
      <div className="w-full flex h-[85%] justify-center">
        <div className="w-full lg:w-8/12 h-full mx-5">
          <div className="flex bg-sky-200 h-[8rem] justify-evenly rounded-tl-md rounded-tr-md">
            <SmallUserProfile
              mode="Ladder"
              avatarData={userA_avatar}
              recordData={host.record}
            />
            <SmallUserProfile
              mode="Ladder"
              avatarData={userB_avatar}
              recordData={guest.record}
            />
          </div>
          <div
            className={`w-ful h-[calc(100%-8rem)] bg-sky-100 rounded-bl-md rounded-br-md flex justify-center items-center`}
          >
            {!gameEndState ? (
              <PongGame
                player={props.myId === userA_avatar.name ? 'Host' : 'Guest'}
                setGameEndState={setGameEndState}
                setWinner={setWinner}
              />
            ) : (
              <ResultComponent
                player={props.myId === userA_avatar.name ? 'Host' : 'Guest'}
                winner={winner}
              />
            )}
          </div>
        </div>
        <MiniChatting />
      </div>
    </div>
  );
}

export default GamePlayPage;
