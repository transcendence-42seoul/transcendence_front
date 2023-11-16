import { UserDataType } from '../../game/ready/GameReadyPage';
import { GameMock } from '../game/game.mock';

export const HostMock: UserDataType = {
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
      data: [],
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
  host: GameMock,
  guest: GameMock,
  ranking: {
    idx: 2000,
    score: 2,
  },
  requester: [],
  requested: [],
  banner: [],
};

export const GuestMock: UserDataType = {
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
  host: GameMock,
  guest: GameMock,
  ranking: {
    idx: 1,
    score: 3000,
  },
  requester: [],
  requested: [],
  banner: [],
};
