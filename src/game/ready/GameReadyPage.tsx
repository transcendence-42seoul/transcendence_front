import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import UserReadyProfile from './UserReadyProfile';
type GameReadyPageProps = {
  gameType: 'Ladder' | 'Challenge';
  gameMode: 'Normal' | 'Hard';
};

function GameReadyPage(props: GameReadyPageProps) {
  const [readyState, setReadyState] = useState(false);
  const onClickButton = () => {
    setReadyState(!readyState);
  };
  return (
    <div className="bg-basic-color h-screen flex flex-col items-center justify-start align-middle mt-24">
      <h1 className="text-3xl font-bold mb-10">{`${props.gameType} ${props.gameMode}`}</h1>
      <div className="w-screen h-3/5  flex justify-evenly items-center">
        <UserReadyProfile url={`./jiwoo.jpeg`} />

        <div className="flex flex-col justify-between items-center">
          {props.gameType === 'Challenge' ? (
            <div className="flex flex-row justify-between w-full">
              <Button
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
              </Button>
            </div>
          ) : null}
          {props.gameType === 'Ladder' ? (
            <div className="flex flex-col justify-between items-center w-full">
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
        </div>
        <UserReadyProfile url={`./jiwoo.jpeg`} />
      </div>
    </div>
  );
}

export default GameReadyPage;
