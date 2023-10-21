import { atom, selector } from 'recoil';

// recoil 사용법 가이드
export const ExampleAtom = atom({
  key: 'ExampleAtom', // 고유 키값
  default: [], // init value
});

const totalValueSelector = selector({
  key: 'totalValueSelector',
  get: ({ get }) => {
    const exam = get(ExampleAtom);
    return exam.reduce((누적값, 현재값) => 누적값 + 현재값, 0);
  },
});
/*

	const [exam, setExam] = useRecoilState(ExampleAtom);

	const value = useRecoilValue(ExampleAtom); // value 만 가져옴 
	const setValue = useSetRecoilState(ExampleAtom); // setState만 가져옴

*/
