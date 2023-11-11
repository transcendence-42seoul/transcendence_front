import { atom } from 'recoil';
// import { atom, selector } from 'recoil';

export interface GameReadyType {
  user_idx: number;
  // gameStart : boolean;
  // game이 시작할 때 or game이 끝날 때 false로 초기화
}

export const GameUserAtom = atom({
  key: 'GameUserAtom',
  default: {
    host_idx: 0,
    guest_idx: 0,
  },
});

export interface GameScoreType {
  score: number;
}
