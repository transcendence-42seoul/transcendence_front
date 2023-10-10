import { Button } from '@chakra-ui/react';
import UserReadyProfile from './UserReadyProfile';

type GameReadyPageProps = {
  gameType: 'Ladder' | 'Challenge';
  gameMode: 'Normal' | 'Hard';
};

function LadderTypeReadyPage(props: GameReadyPageProps) {
  return (
    <div className="bg-basic-color h-screen flex flex-col items-center justify-start align-middle mt-24">
      <h1 className="text-3xl font-bold mb-10">{`${props.gameType} ${props.gameMode}`}</h1>
      <div className="w-screen h-3/5  flex justify-evenly items-center">
        <UserReadyProfile url={`./jiwoo.jpeg`} />
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
        <h1 className="text-4xl font-bold">VS</h1>
        <UserReadyProfile url={`./jiwoo.jpeg`} />
      </div>
    </div>
  );
}

export default LadderTypeReadyPage;