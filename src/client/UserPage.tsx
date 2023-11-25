import React, { useState } from 'react';
import logo from '../assets/logo.jpg';

function UserProfile() {
  const [activeTab, setActiveTab] = useState('all');

  const createRandomGame = () => {
    let score1 = 0;
    let score2 = 0;

    while (score1 < 7 && score2 < 7) {
      // 무작위로 스코어를 추가 (0 또는 1점)
      const randomScore = Math.floor(Math.random() * 2);
      if (randomScore === 0) {
        score1++;
      } else {
        score2++;
      }
    }

    const result = score1 === 7 ? '승' : '패';

    return {
      score: `${score1}:${score2}`,
      result: result,
    };
  };

  // 임시 데이터 생성
  const createDummyData = (type) => {
    return Array.from({ length: 5 }, (_, index) => ({
      id: index,
      type: type,
      title: `${type} #${index + 1}`,
      content: createRandomGame(),
      timestamp: new Date().toISOString().slice(0, 10),
    }));
  };

  const rankGames = createDummyData('랭크전');
  const normalGames = createDummyData('일반전');
  const allGames = [...rankGames, ...normalGames];

  const userData = {
    nickname: 'sanghan',
    rank: 2147483647,
    record: '100전 1승 99패',
    winRate: 1, // 1% 승률로 가정
    profileImage: logo, // 프로필 이미지 경로
  };

  // 승률을 나타내는 원의 둘레 계산
  const radius = 45; // 반지름
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (userData.winRate / 100) * circumference;

  return (
    <div className="h-screen w-screen bg-gray-100">
      <div className="h-full w-full bg-white rounded-lg shadow-xl">
        {/* screen */}
        <div className="flex flex-col p-8">
          <div className="flex flex-row justify-between items-center pt-8 pl-8 pr-8">
            {/* user */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{userData.nickname}</h2>
              <p className="text-xl">랭킹: {userData.rank}등</p>
              <p className="text-xl">전적: {userData.record}</p>
              <p className="text-xl">승률: {userData.winRate}%</p>
            </div>
            {/* user */}

            {/* rate */}
            <div className="shrink-0">
              <svg width="100" height="100">
                <g transform="rotate(-90, 50, 50)">
                  <circle
                    className="text-gray-300"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-blue-600"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50"
                    cy="50"
                  />
                </g>
                <text
                  x="50"
                  y="55"
                  className="text-lg font-semibold text-blue-800"
                  textAnchor="middle"
                >
                  {userData.winRate}%
                </text>
              </svg>
            </div>
            {/* rate */}

            {/* profile image */}
            <div className="shrink-0">
              <img
                className="w-24 h-24 rounded-full object-cover"
                src={userData.profileImage}
                alt="Profile"
              />
            </div>
            {/* profile image */}
          </div>

          {/* profile button */}
          <div className="flex justify-end pr-7">
            <div className="flex flex-row items-center">
              <button className="bg-blue-500 text-white rounded text-sm p-0.5 mr-1">
                친구신청
              </button>
              <button className="bg-blue-500 text-white rounded text-sm p-0.5 ml-1">
                차단하기
              </button>
            </div>
          </div>
          {/* profile button */}
        </div>
        {/* screen */}

        <div className="border-t">
          <nav className="flex p-1">
            {['all', 'rank', 'normal'].map((tabName) => (
              <button
                key={tabName}
                className={`flex-1 p-2 text-center ${
                  activeTab === tabName
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab(tabName)}
              >
                {tabName === 'all'
                  ? '전체'
                  : tabName === 'rank'
                  ? '랭크전'
                  : '일반전'}
              </button>
            ))}
          </nav>
          <div className="p-4">
            <GameTable
              games={
                activeTab === 'all'
                  ? allGames
                  : activeTab === 'rank'
                  ? rankGames
                  : normalGames
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GameTable({ games }) {
  return (
    <div>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              승패
            </th>
            <th scope="col" className="px-6 py-3">
              게임타입
            </th>
            <th scope="col" className="px-6 py-3">
              방제목
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
          {games.map((game) => (
            <tr
              key={game.id}
              className={`${
                game.content.result === '승'
                  ? 'bg-blue-100 hover:bg-blue-200'
                  : 'bg-red-100 hover:bg-red-200'
              } border-b m-2`}
            >
              <td className="px-6 py-4">{game.content.result}</td>
              <td className="px-6 py-4">{game.type}</td>
              <td className="px-6 py-4">{game.title}</td>
              <td className="px-6 py-4">{game.content.score}</td>
              <td className="px-6 py-4">{game.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserProfile;
