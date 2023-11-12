import { Avatar } from '@chakra-ui/react';

type UserRecordDataType = {
  idx: number;
  total_game: number;
  total_win: number;
  ladder_game: number;
  ladder_win: number;
  general_game: number;
  general_win: number;
};

type UserAvatarDataType = {
  idx: number;
  name: string;
  imageData: string;
};

type SmallUserProfileProps = {
  mode: 'Ladder' | 'Challenge';
  avatarData: UserAvatarDataType;
  recordData: UserRecordDataType;
};

function SmallUserProfile(props: SmallUserProfileProps) {
  const avatarData = props.avatarData;
  const recordData = props.recordData;

  let record;
  if (props.mode === 'Ladder') {
    record = recordData.ladder_game + '전 ' + recordData.ladder_win + '승';
  } else {
    record = recordData.general_game + '전 ' + recordData.general_win + '승';
  }
  return (
    <div className="flex items-center	">
      <Avatar size="lg" name="Segun Adebayo" src={avatarData.imageData} />
      <div className="ml-3">
        <h1 className="font-bold text-xl">{avatarData.name}</h1>
        <h2 className="font-medium text-base">{record}</h2>
      </div>
    </div>
  );
}

export default SmallUserProfile;
