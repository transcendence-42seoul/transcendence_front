import { Ai, Ball, GameType } from './../game/play/pong_engin';
import { atom, selector } from 'recoil';

export const GameAtom = atom<GameType>({
  key: 'GameAtom',
  default: {
    player: Ai.new('left'),
    ai: Ai.new('right'),
    ball: Ball.new(),
    running: false,
    turn: Ai.new('right'),
    timer: 0,
    color: '#8c52ff',
    over: false,
    round: 0,
  },
});
