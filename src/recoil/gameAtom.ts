import { IGame } from '../game/ready/GameReadyPage';
import { atom, selector } from 'recoil';

export const GameAtom = atom<IGame>({
  key: 'GameAtom',
  default: {} as IGame,
});

export const GameHostInfoSelector = selector({
  key: 'GameHostInfo',
  get: ({ get }) => {
    const { __game_host__ } = get(GameAtom);
    return __game_host__;
  },
});

export const GameguestInfoSelector = selector({
  key: 'GameGuestInfo',
  get: ({ get }) => {
    const { __game_guest__ } = get(GameAtom);
    return __game_guest__;
  },
});

export const GameRoomIdSelector = selector({
  key: 'GameRoomIdInfo',
  get: ({ get }) => {
    const { room_id } = get(GameAtom);
    return room_id;
  },
});
