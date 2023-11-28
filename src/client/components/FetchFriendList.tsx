import axios from 'axios';

export interface Friends {
  idx: number;
  nickname: string;
  isHighlighted: boolean;
}

const makeToFriends = (data: any): Friends[] => {
  return data.map((friend: any) => {
    return {
      idx: friend.idx,
      nickname: friend.nickname,
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
