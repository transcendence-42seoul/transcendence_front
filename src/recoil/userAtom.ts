import { atom, selector } from 'recoil';

export const UserIdAtom = atom<string>({
  key: 'UserIdAtom',
  default: '',
});
