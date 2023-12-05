import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import {
  GameAtom,
  GameHostInfoSelector,
  GameguestInfoSelector,
} from '../../../recoil/gameAtom';

interface ResultComponentProps {
  winner: string;
  player: 'Host' | 'Guest';
}

const ResultComponent = (props: ResultComponentProps) => {
  const { winner, player } = props;
  const host = useRecoilValue(GameHostInfoSelector);
  const guest = useRecoilValue(GameguestInfoSelector);
  const game = useRecoilValue(GameAtom);
  const navigate = useNavigate();
  const myData = player === 'Host' ? host : guest;

  return (
    <div>
      <div className="flex flex-col items-center font-bold mb-10">
        <div className="text-8xl mb-10">
          {winner === player ? '승리!' : '패배!'}
        </div>
        <div className="text-6xl mb-10">
          {game.game_mode <= 2
            ? winner === player
              ? `${myData.ranking.score + 20}(+20)`
              : `${myData.ranking.score - 20}(-20)`
            : null}
        </div>
        <Button
          onClick={() => {
            navigate('/main');
          }}
        >
          메인으로 돌아가기
        </Button>
      </div>
      <div>새로고침을 하시면 메인 페이지로 이동합니다.</div>
    </div>
  );
};

export default ResultComponent;
