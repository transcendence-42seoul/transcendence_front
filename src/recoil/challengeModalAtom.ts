import { atom } from 'recoil';

export const ChallengModalAtom = atom<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}>({
  key: 'ChallengModalAtom',
  default: {
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  },
});
