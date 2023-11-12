import { GameModeType } from './../game/ready/GameReadyPage';
import { IGame, UserDataType } from '../game/ready/GameReadyPage';
import { Ai, Ball, GameType } from './../game/play/pong/pong_engin';
import { atom, selector } from 'recoil';

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

const gameMock: IGame = {
  end_time: '2021-08-31T14:00:00.000Z',
  start_time: '2021-08-31T14:00:00.000Z',
  game_mode: 1,
  game_status: true,
  gameHost_score: 1,
  gameGuest_score: 3,
  room_id: 'testRoomId',
  idx: 300,
};

const hostMock: UserDataType = {
  idx: 2000,
  id: 'kunee',
  nickname: 'anabada',
  email: 'seokchoi@naver.com',
  status: 'ONLINE',
  tfa_enabled: false,
  tfa_secret: null,
  avatar: {
    idx: 1,
    image_data: {
      type: 'string',
      data: [1, 2, 3, 4],
    },
  },
  record: {
    idx: 2000,
    total_game: 12,
    total_win: 8,
    ladder_game: 6,
    ladder_win: 4,
    general_game: 6,
    general_win: 4,
  },
  host: gameMock,
  guest: gameMock,
  ranking: {
    idx: 2000,
    score: 2,
  },
  requester: [],
  requested: [],
  banner: [],
};

const guestMock: UserDataType = {
  idx: 1000,
  id: 'gtd9511',
  nickname: 'iambluebird',
  email: 'iam@bluebird.com',
  status: 'ONLINE',
  tfa_enabled: false,
  tfa_secret: null,
  avatar: {
    idx: 1,
    image_data: {
      type: 'string',
      data: [],
    },
  },
  record: {
    idx: 1000,
    total_game: 1000,
    total_win: 1000,
    ladder_game: 500,
    ladder_win: 500,
    general_game: 500,
    general_win: 500,
  },
  host: gameMock,
  guest: gameMock,
  ranking: {
    idx: 1,
    score: 3000,
  },
  requester: [],
  requested: [],
  banner: [],
};
export const GameUsersAtom = atom<{
  host: UserDataType;
  guest: UserDataType;
}>({
  key: 'GameUsersInfoAtom',
  default: {
    host: hostMock,
    guest: guestMock,
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
