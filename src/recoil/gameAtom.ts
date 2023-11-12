import { GameModeType } from './../game/ready/GameReadyPage';
import { IGame, UserDataType } from '../game/ready/GameReadyPage';
import { Ai, Ball, GameType } from './../game/play/pong/pong_engin';
import { atom, selector } from 'recoil';
import { GuestMock, HostMock } from '../__mock__/user/user.mock';

// export const GameAtom = atom<GameType>({
//   key: 'GameAtom',
//   default: {
//     player: Ai.new('left'),
//     ai: Ai.new('right'),
//     ball: Ball.new(),
//     running: false,
//     turn: Ai.new('right'),
//     timer: 0,
//     color: '#8c52ff',
//     over: false,
//     round: 0,
//   },
// });

export const GameUsersAtom = atom<{
  host: UserDataType;
  guest: UserDataType;
}>({
  key: 'GameUsersInfoAtom',
  default: {
    host: HostMock,
    guest: GuestMock,
  },
});

export const GameHostInfoSelector = selector({
  key: 'GameHostInfo',
  get: ({ get }) => {
    const { guest } = get(GameUsersAtom);
    return guest;
  },
});

export const GameguestInfoSelector = selector({
  key: 'GameGuestInfo',
  get: ({ get }) => {
    const { host } = get(GameUsersAtom);
    return host;
  },
});

export const GameRoomIdSelector = selector({
  key: 'GameRoomIdInfo',
  get: ({ get }) => {
    const { host } = get(GameUsersAtom);
    if (host === null) return 'testRoomId';
    const game = host.host ? host.host : host.guest;
    const roomId = game ? game.room_id : 'testRoomId';
    return roomId;
  },
});
