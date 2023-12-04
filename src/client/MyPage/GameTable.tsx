import { v4 as uuidv4 } from 'uuid';
import { HitoryType, IGameHistory } from './MyPage';

interface IGameTable {
  histories: IGameHistory[];
  type: HitoryType;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const GameTable = (props: IGameTable) => {
  const { histories } = props;
  return (
    <div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              상대 유저
            </th>
            <th scope="col" className="px-6 py-3">
              승패
            </th>

            <th scope="col" className="px-6 py-3">
              게임타입
            </th>
            <th scope="col" className="px-6 py-3">
              점수
            </th>
            <th scope="col" className="px-6 py-3">
              타임스탬프
            </th>
          </tr>
        </thead>
        <tbody>
          {histories.map((history) => {
            if (props.type === 'ladder' && history.game_type > 2) return null;
            if (props.type === 'challenge' && history.game_type <= 2)
              return null;
            return (
              <tr
                key={uuidv4()}
                className={`${
                  history.win
                    ? 'bg-blue-100 hover:bg-blue-200'
                    : 'bg-red-100 hover:bg-red-200'
                } border-b m-2`}
              >
                <td className="px-6 py-4">{`${history.opponent_nickname}[${history.opponent_id}]`}</td>
                <td className="px-6 py-4">{history.win ? '승' : '패'}</td>
                <td className="px-6 py-4">
                  {history.game_type <= 2 ? 'LADDER' : 'CHALLENGE'}
                </td>
                <td className="px-6 py-4">{`${history.my_score} : ${history.opponent_score}`}</td>
                <td className="px-6 py-4">{formatDate(history.time)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GameTable;
