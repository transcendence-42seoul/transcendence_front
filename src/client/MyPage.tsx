import { useEffect, useState } from 'react';
import { useDisclosure, Input } from '@chakra-ui/react';
import ProfilePictureChangeModal from './components/ProfilePictureChange';
import edit from '../assets/edit.svg';
import check from '../assets/check.svg';
import axios from 'axios';
import { getCookie } from '../common/cookie/cookie';
import { v4 as uuidv4 } from 'uuid';

/* FetchUserData.tsx */
interface User {
  idx: number;
  nickname: string;
  avatar: {
    image_data: Buffer;
  };
  record: {
    total_game: number;
    total_win: number;
    total_lose: number;
    win_rate: number;
  };
  ranking: {
    score: number;
  };
}

const makeUserDataFormat = (data: any): User => {
  return {
    idx: data.idx,
    nickname: data.nickname,
    avatar: {
      image_data: data.avatar.image_data,
    },
    record: {
      total_game: data.record.total_game,
      total_win: data.record.total_win,
      total_lose: data.record.total_game - data.record.total_win,
      win_rate: (data.record.total_win / data.record.total_game) * 100,
    },
    ranking: {
      score: data.ranking.score,
    },
  };
};

const convertToBase64Image = (imageBuffer: any) => {
  const binary = imageBuffer.data.reduce(
    (acc: any, byte: any) => acc + String.fromCharCode(byte),
    '',
  );
  return `data:image/jpeg;base64,${window.btoa(binary)}`;
};
/* FetchUserData.tsx */

function MyProfile() {
  const token = getCookie('token');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [activeTab, setActiveTab] = useState('all');

  const [profileImage, setProfileImage] = useState();

  const [userData, setUserData] = useState<User>();

  const [userIdx, setUserIdx] = useState<number>(0);

  const [isEditingNickname, setIsEditingNickname] = useState(false);

  const [newNickname, setNewNickname] = useState(userData?.nickname);

  useEffect(() => {
    fetchUserIdx();
  }, []);

  useEffect(() => {
    if (userIdx > 0) {
      fetchUserData();
    }
  }, [userIdx]);

  useEffect(() => {
    if (userIdx > 0 && userData?.avatar) {
      setProfileImage(convertToBase64Image(userData.avatar.image_data));
    }
  }, [userIdx, userData]);

  const handleAvatarChange = (newAvatar) => {
    setProfileImage(newAvatar);
    onClose();
  };

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
  const createDummyData = (type: string) => {
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

  // 승률을 나타내는 원의 둘레 계산
  const radius = 45; // 반지름
  const circumference = 2 * Math.PI * radius;
  const winRate = userData?.record.win_rate || 0;
  const offset = winRate ? circumference - (winRate / 100) * circumference : 0;

  // update username
  const handleUsernameUpdateClick = () => {
    // 사용자 이름을 수정 모드로 전환
    setIsEditingNickname(true);
  };

  const fetchUserIdx = async () => {
    try {
      const userData = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUserIdx(userData.data.user_idx);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/users/idx/${userIdx}`,
    );

    setUserData(makeUserDataFormat(response.data));
  };

  const handleSaveUsername = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/users/${userIdx}/nickname`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname: newNickname }),
    })
      .then((response) => {
        if (response.ok) {
          // 요청이 성공한 경우에만 사용자 이름 변경 및 수정 모드 종료
          setIsEditingNickname(false);
          setUserData((prevUserData) => {
            console.log('prevUserData:', prevUserData); // prevUserData 출력
            return {
              ...prevUserData,
              nickname: newNickname,
            };
          });
        } else {
          console.error('요청이 실패했습니다.');
        }
      })
      .catch((error) => {
        console.error('에러 발생:', error);
      });
  };

  return (
    <div className="h-screen w-screen bg-gray-100">
      <div className="h-full w-full bg-white rounded-lg shadow-xl">
        {/* screen */}
        <div className="flex flex-col p-8">
          <div className="flex flex-row justify-between items-center pt-8 pl-8 pr-8">
            {/* user */}

            <div className="flex flex-col">
              <div className="flex flex-row">
                {isEditingNickname ? (
                  <Input
                    className="text-2xl font-bold"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{userData?.nickname}</h2>
                )}
                <button
                  onClick={
                    isEditingNickname
                      ? handleSaveUsername
                      : handleUsernameUpdateClick
                  }
                >
                  {/* 수정 모드인 경우 '확인' 아이콘, 아닌 경우 '수정' 아이콘 */}
                  <img
                    className="object-scale-down h-12 w-12"
                    src={isEditingNickname ? check : edit}
                    alt={isEditingNickname ? '확인' : '수정'}
                  />
                </button>
              </div>
              <p className="text-xl">랭킹: {userData?.ranking.score}등</p>
              <p className="text-xl">
                전적: {userData?.record.total_game}전{' '}
                {userData?.record.total_win}승 {userData?.record.total_lose}패
              </p>
              <p className="text-xl">승률: {userData?.record.win_rate}%</p>
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
                  {userData?.record.win_rate}%
                </text>
              </svg>
            </div>
            {/* rate */}

            {/* profile image */}
            <div className="shrink-0">
              <img
                className="w-24 h-24 rounded-full object-cover"
                src={profileImage}
                alt="Profile"
              />
            </div>
            {/* profile image */}
          </div>

          {/* profile button */}
          <div className="flex justify-end pr-8">
            <button
              className="bg-blue-500 text-white px-4 rounded text-sm p-0.5"
              onClick={onOpen}
            >
              프로필 수정
            </button>
          </div>
          {/* profile button */}
        </div>
        <ProfilePictureChangeModal
          isOpen={isOpen}
          onClose={onClose}
          onAvatarChange={handleAvatarChange}
        />
        {/* screen */}

        <div className="border-t">
          <nav className="flex p-1">
            {['all', 'rank', 'normal'].map((tabName) => (
              <button
                key={uuidv4()}
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
              key={uuidv4()}
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

export default MyProfile;
