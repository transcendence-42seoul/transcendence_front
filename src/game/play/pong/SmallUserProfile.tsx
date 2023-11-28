import { Avatar } from '@chakra-ui/react';
import { IRecord } from '../../ready/GameReadyPage';

type UserAvatarDataType = {
  idx: number;
  name: string;
  imageData: number[];
};

type SmallUserProfileProps = {
  mode: 'Ladder' | 'Challenge';
  avatarData: UserAvatarDataType;
  recordData: IRecord;
};

function SmallUserProfile(props: SmallUserProfileProps) {
  const avatarData = props.avatarData;
  const recordData = props.recordData;

  let record;
  if (props.mode === 'Ladder') {
    record =
      recordData.ladder_game +
      '전 ' +
      recordData.ladder_win +
      '승 ' +
      (recordData.ladder_game - recordData.ladder_win) +
      '패';
  } else {
    record =
      recordData.general_game +
      '전 ' +
      recordData.general_win +
      '승 ' +
      (recordData.general_game - recordData.general_win) +
      '패';
  }

  // ArrayBuffer를 이용하여 Blob 생성
  const arrayBufferView = new Uint8Array(props.avatarData.imageData);
  const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });

  // Blob을 Data URL로 변환
  const imageUrl = URL.createObjectURL(blob);

  return (
    <div className="flex items-center	">
      <Avatar
        size="lg"
        name="Segun Adebayo"
        src={
          props.avatarData.imageData.length === 0 ? './cuteyatta.png' : imageUrl
        }
      />
      <div className="ml-3">
        <h1 className="font-bold text-xl">{avatarData.name}</h1>
        <h2 className="font-medium text-base">{record}</h2>
      </div>
    </div>
  );
}

export default SmallUserProfile;
