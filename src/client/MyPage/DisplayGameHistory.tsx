import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HitoryType, IGameHistory } from './MyPage';
import GameTable from './GameTable';

interface IDisplayGameHistory {
  gameHistory: IGameHistory[];
}
const DisplayGameHistory = (props: IDisplayGameHistory) => {
  const { gameHistory } = props;
  const [activeTab, setActiveTab] = useState<HitoryType>('all');

  return (
    <div className="border-t">
      <nav className="flex p-1">
        {['all', 'ladder', 'challenge'].map((tabName) => (
          <button
            key={uuidv4()}
            className={`flex-1 p-2 text-center ${
              activeTab === tabName
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab(tabName as HitoryType)}
          >
            {tabName === 'all'
              ? '전체'
              : tabName === 'ladder'
              ? '랭크전'
              : '일반전'}
          </button>
        ))}
      </nav>
      <div className="p-4">
        <GameTable histories={gameHistory} type={activeTab} />
      </div>
    </div>
  );
};

export default DisplayGameHistory;
