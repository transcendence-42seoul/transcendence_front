import { atom } from 'recoil';

interface IToken {
  id: string;
  idx: number;
}

export const TokenAtom = atom<IToken>({
  key: 'TokenAtom',
  default: {} as IToken,
});
