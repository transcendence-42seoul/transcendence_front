import { atom, selector } from 'recoil';

interface IToken => token {
  id: string;
  idx: number;
}

export const TokenAtom = atom<IUser>({
  key: 'UserAtom',
  default: {} as IUser,
});
