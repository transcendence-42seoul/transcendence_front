import { useEffect, useState } from 'react';
import SmallUserProfile from './SmallUserProfile';
import MiniChatting from '../mini_chat/MiniChatting';
import PongGame from './PongGame';
import { useRecoilValue } from 'recoil';
import {
  GameHostInfoSelector,
  GameRoomIdSelector,
  GameguestInfoSelector,
} from '../../../recoil/gameAtom';
import { gameSocket, gameSocketConnect } from '../../socket/game.socket';
import { useNavigate } from 'react-router';

function GamePlayPage() {
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

  const [userASetScore, setserASetScore] = useState(0);
  const [userBSetScore, setserBSetScore] = useState(0);

  const roomId = useRecoilValue(GameRoomIdSelector);
  const navigation = useNavigate();

  useEffect(() => {
    gameSocket.on('error', (error) => {
      navigation('/');
      console.error('Socket connection error:', error);
    });

    gameSocket.on('disconnect', () => {
      console.log('소켓이 연결이 끊겼습니다.');
    });

    gameSocketConnect();

    return () => {
      gameSocket.off('error');
      gameSocket.off('disconnect');
    };
  }, []);

  return (
    <div className="flex flex-col items-center h-screen max-h-screen w-screen max-w-screen pt-12">
      <h1 className="text-3xl h-[5%] font-bold mb-10">GamePlayPage</h1>
      <div className="w-full h-[85%] flex justify-center">
        <div className="w-full lg:w-8/12 h-full mx-5">
          <div className="flex bg-sky-200 h-[8rem] justify-evenly rounded-tl-md rounded-tr-md">
            <SmallUserProfile
              mode="Ladder"
              avatarData={userA_avatar}
              recordData={host.record}
            />
            <div className="flex w-1/6 items-center">
              <h1 className="text-5xl">{`${userASetScore}`}</h1>
              <div className="flex flex-col items-center justify-center">
                <h3 className="mx-12 whitespace-nowrap text-2xl font-bold">
                  VS
                </h3>
              </div>
              <h1 className="text-5xl">{`${userBSetScore}`}</h1>
            </div>
            <SmallUserProfile
              mode="Ladder"
              avatarData={userB_avatar}
              recordData={guest.record}
            />
          </div>
          <div
            className={`w-full aspect-[4/2.2] bg-yellow-300 rounded-bl-md rounded-br-md flex justify-center items-center`}
          >
            <PongGame />
          </div>
        </div>
        <MiniChatting />
      </div>
    </div>
  );
}

export default GamePlayPage;
