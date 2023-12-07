import axios from 'axios';
import { UserStatus } from '../../game/GamePage';

export interface Friends {
  idx: number;
  nickname: string;
  status: UserStatus;
  isHighlighted: boolean;
}

const makeToFriends = (data: any): Friends[] => {
  return data.map((friend: any) => {
    return {
      idx: friend.idx,
      nickname: friend.nickname,
      status: friend.status,
      isHighlighted: false,
    };
  });
};

export const FecthFriendList = async (idx: number) => {
  const response = await axios.get(
    `${import.meta.env.VITE_SERVER_URL}/friends/${idx}`,
  );

  const friendList = makeToFriends(response.data);

  return friendList;
};
