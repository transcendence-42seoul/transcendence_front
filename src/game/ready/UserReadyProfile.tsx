import { Avatar } from '@chakra-ui/react';
import { UserDataType } from './GameReadyPage';
import ImageComponent from '../../common/ImageComponent/ImageComponent';

type UserReadyProfileProps = {
  user: UserDataType | undefined;
};
function UserReadyProfile(props: UserReadyProfileProps) {
  const user = props.user;

  const id = user ? user.id : 'guest';
  const ladder_total = user ? user.record.ladder_game : 0;
  const ladder_win = user ? user.record.ladder_win : 0;
  const ladder_lose = ladder_total - ladder_win;
  const challenge_total = user ? user.record.general_game : 0;
  const challenge_win = user ? user.record.general_win : 0;
  const challenge_lose = challenge_total - challenge_win;

  const imageDataArray = user?.avatar.image_data?.data;
  return (
    <div className="w-3/12 h-full bg-slate-100 ring-4 rounded-lg flex flex-col justify-between items-center py-8">
      {imageDataArray === undefined ? (
        <Avatar
          size="2xl"
          name="Segun Adebayo"
          src={'../../public/cuteyatta.png'}
        />
      ) : (
        <ImageComponent imageData={imageDataArray} />
      )}{' '}
      <h1 className="text-center font-bold text-2xl mb-2 mt-2">{`${id}`}</h1>
      <div className="">
        <div className="flex flex-col item-center">
          <h3 className="text-center font-bold text-3xl mb-4">{`래더`}</h3>
          <h3 className="text-center font-bold text-2xl mb-4">{`${ladder_total}전 ${ladder_win}승 ${ladder_lose}패`}</h3>
        </div>
        <div className="flex flex-col item-center mb-6">
          <h3 className="text-center font-bold text-3xl mb-4">{`일반`}</h3>
          <h3 className="text-center font-bold text-2xl mb-4">{`${challenge_total}전 ${challenge_win}승 ${challenge_lose}패`}</h3>
        </div>
      </div>
      <h3 className="text-center font-bold text-3xl">{`${user?.ranking.score} 점`}</h3>
      <div className="flex justify-center pb-8"></div>
    </div>
  );
}

export default UserReadyProfile;
