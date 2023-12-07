import { Friends } from './FetchFriendList';

export interface DmRoom {
  idx: number;
  name: string;
  type: string;
}

export interface DmMember {
  idx: number;
  nickname: string;
  isHighlighted: boolean;
}

export interface DmContextMenu {
  type: 'friend' | 'member';
  user: Friends | DmMember;
  position: { x: number; y: number };
}

export const makeMemberData = (myIdx: number, data: any) => {
  const otherUser = data.find(
    (participant: any) => participant.user.idx !== myIdx,
  );

  if (!otherUser) {
    return null;
  }

  return {
    idx: otherUser.user.idx,
    nickname: otherUser.user.nickname,
    isHighlighted: false,
  };
};

export const makeDmData = (data: any) => {
  return {
    idx: data.idx,
    name: data.name,
    type: data.type,
  };
};
