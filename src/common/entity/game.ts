import { GameModeType } from '../../game/ready/GameReadyPage';
import { IUser } from './user';

export interface IGame {
  end_time: Date;
  gameGuest_score: number;
  gameHost_score: number;
  game_mode: GameModeType;
  game_status: boolean;
  idx: number;
  room_id: string;
  start_time: Date;
  game_host: IUser;
  game_guest: IUser;
}
