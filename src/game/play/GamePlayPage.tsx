import { useState } from 'react';
import SmallUserProfile from './SmallUserProfile';
import MiniChatting from './MiniChatting';

function GamePlayPage() {
  const userA_avatar = {
    idx: 1,
    name: 'sanghan',
    imageData: './jiwoo.jpeg',
  };

  const userA_record_ = {
    idx: 1,
    total_game: 10,
    total_win: 7,
    ladder_game: 5,
    ladder_win: 3,
    general_game: 5,
    general_win: 2,
  };

  const userB_avatar = {
    idx: 1,
    name: 'sanghan',
    imageData: './jiwoo.jpeg',
  };

  const userB_record_ = {
    idx: 1,
    total_game: 10,
    total_win: 7,
    ladder_game: 5,
    ladder_win: 3,
    general_game: 5,
    general_win: 2,
  };

  const [userASetScore, setserASetScore] = useState(0);
  const [userBSetScore, setserBSetScore] = useState(0);

  const [userAScore, setUserAScore] = useState(0);
  const [userBScore, setUserBScore] = useState(0);

  // const gamePlaying = (userASetScore === 2 || userBSetScore === 2);

  return (
    // {(userASetScore === 2 || userBSetScore === 2) ? (
    //result
      <div className="flex flex-col items-center h-screen max-h-screen w-screen max-w-screen pt-12">
      <h1 className="text-3xl h-[5%] font-bold mb-10">Game Result</h1>
      <div className="w-full h-[85%] flex justify-center">
        <div className="w-full lg:w-8/12 h-full mx-5">
          <div className="flex bg-red-200 h-full justify-evenly">
            <SmallUserProfile
              mode="Ladder"
              avatarData={userA_avatar}
              recordData={userA_record_}
            />
            <div className="flex w-1/6 items-center">
            <div>
              <h1 className="text-3xl h-[5%] font-bold mb-10">You Win</h1>
            </div>
              <div className="flex flex-col items-center justify-center">
              </div>
            </div>
              <div>
                score
              </div>
          </div>
        </div>
        <MiniChatting />
      </div>
    </div>
    // ) : (
      // <div>Game Over</div>
    // )}
  // );




    // <div className="flex flex-col items-center h-screen max-h-screen w-screen max-w-screen pt-12">
    //   <h1 className="text-3xl h-[5%] font-bold mb-10">GamePlayPage</h1>
    //   <div className="w-full h-[85%] flex justify-center">
    //     <div className="w-full lg:w-8/12 h-full mx-5">
    //       <div className="flex bg-slate-200 h-[8rem] justify-evenly">
    //         <SmallUserProfile
    //           mode="Ladder"
    //           avatarData={userA_avatar}
    //           recordData={userA_record_}
    //         />
    //         <div className="flex w-1/6 items-center">
    //           <h1 className="text-4xl">{`${userASetScore}`}</h1>
    //           <div className="flex flex-col items-center justify-center">
    //             <h1 className="text-2xl">Set</h1>
    //             <h3 className="mx-12 whitespace-nowrap text-2xl">{`${userAScore}   :   ${userBScore}`}</h3>
    //           </div>
    //           <h1 className="text-4xl">{`${userBSetScore}`}</h1>
    //         </div>
    //         <SmallUserProfile
    //           mode="Ladder"
    //           avatarData={userB_avatar}
    //           recordData={userB_record_}
    //         />
    //       </div>
    //       <div
    //         className={`w-full aspect-[4/2.2] bg-yellow-300 rounded-md`}
    //       ></div>
    //     </div>
    //     <MiniChatting />
    //   </div>
    // </div>
  );
}

export default GamePlayPage;
