import UserReadyProfile from './UserReadyProfile';

type GameReadyPageProps = {
  mode: 'Ladder' | 'Normal';
};

function GameReadyPage(props: GameReadyPageProps) {
  return (
    <div className="bg-basic-color h-screen flex flex-col items-center justify-start align-middle mt-24">
      <h1 className="text-3xl font-bold mb-10">{props.mode}</h1>
      <div className="w-screen h-3/5  flex justify-evenly items-center">
        <UserReadyProfile url={`./jiwoo.jpeg`} />
        <h1 className="text-4xl font-bold">VS</h1>
        <UserReadyProfile url={`./jiwoo.jpeg`} />
      </div>
    </div>
  );
}

export default GameReadyPage;
