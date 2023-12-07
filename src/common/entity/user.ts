export interface IUser {
  avatar: {
    idx: number;
    image_data: ArrayBuffer;
  };
  banned: [];
  blocker: [];
  email: string;
  guest: null;
  host: null;
  id: string;
  idx: number;
  messages: [];
  muted: [];
  nickname: string;
  participants: {}[];
  ranking: {
    idx: number;
    score: number;
  };
  record: {
    idx: number;
    total_game: number;
    total_win: number;
    ladder_game: number;
    ladder_win: number;
    general_game: number;
    general_win: number;
  };
  requested: [];
  requester: [];
  status: string;
  tfa_enabled: boolean;
  tfa_secret: null;
}

export interface IProfileUser {
  idx: number;
  nickname: string | undefined;
  avatar: {
    image_data: Buffer;
  };
  record: {
    total_game: number;
    ladder_game: number;
    challenge_game: number;
    total_win: number;
    ladder_win: number;
    challenge_win: number;
    total_lose: number;
    ladder_lose: number;
    challenge_lose: number;
    total_rate: number;
    ladder_rate: number;
    challenge_rate: number;
  };
  ranking: {
    score: number;
  };
}
