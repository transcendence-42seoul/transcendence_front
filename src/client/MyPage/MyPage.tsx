import { useEffect, useState } from 'react';
import { useDisclosure, Input } from '@chakra-ui/react';
import ProfilePictureChangeModal from '../components/ProfilePictureChange';
import edit from '../../assets/edit.svg';
import check from '../../assets/check.svg';
import axios from 'axios';
import { getCookie } from '../../common/cookie/cookie';
import { GameModeType } from '../../game/ready/GameReadyPage';
import { IProfileUser } from '../../common/entity/user';
import DisplayWinningRate from './DisplayWinningRate';
import DisplayGameHistory from './DisplayGameHistory';
import { useParams } from 'react-router-dom';

/* FetchUserData.tsx */

const makeUserDataFormat = (data: any): IProfileUser => {
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
      ladder_game: data.record.ladder_game,
      ladder_win: data.record.ladder_win,
      ladder_lose: data.record.ladder_game - data.record.ladder_win,
      challenge_game: data.record.general_game,
      challenge_win: data.record.general_win,
      challenge_lose: data.record.general_game - data.record.general_win,
      // total_rate: (data.record.total_win / data.record.total_game) * 100,
      total_rate:
        data.record.total_game === 0
          ? 0
          : Math.round((data.record.total_win / data.record.total_game) * 100),
      ladder_rate:
        data.record.ladder_game === 0
          ? 0
          : Math.round(
              (data.record.ladder_win / data.record.ladder_game) * 100,
            ),
      challenge_rate:
        data.record.general_game === 0
          ? 0
          : Math.round(
              (data.record.general_win / data.record.general_game) * 100,
            ),
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

export interface IGameHistory {
  win: boolean;
  game_type: GameModeType;
  my_score: number;
  opponent_score: number;
  time: string;
  opponent_id: string;
  opponent_nickname: string;
}

export type HitoryType = 'all' | 'ladder' | 'challenge';

function MyProfile() {
  const { idx } = useParams();

  const token = getCookie('token');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [profileImage, setProfileImage] = useState();

  const [userData, setUserData] = useState<IProfileUser>();

  const [userIdx, setUserIdx] = useState<number>(0);

  const [isEditingNickname, setIsEditingNickname] = useState(false);

  const [newNickname, setNewNickname] = useState(userData?.nickname);

  useEffect(() => {
    fetchUserIdx();
    getGameHistory();
  }, []);

  useEffect(() => {
    if (userIdx > 0) {
      fetchUserData();
    }
  }, [userIdx]);

  useEffect(() => {
    if (userIdx > 0 && userData?.avatar?.image_data) {
      setProfileImage(convertToBase64Image(userData.avatar.image_data));
    }
  }, [userIdx, userData]);

  const handleAvatarChange = (newAvatar) => {
    setProfileImage(newAvatar);
    onClose();
  };

  const [gameHistory, setGameHistory] = useState<IGameHistory[]>([]);

  //win, game_type, my_score, opponent_score, time, opponent_id, opponent_nickname
  const getGameHistory = async () => {
    const logs = await axios.get(`${import.meta.env.VITE_SERVER_URL}/records`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const histories = logs.data.user_game_log.map((log: string) => {
      return JSON.parse(log);
    });
    setGameHistory(histories);
  };

  // 승률을 나타내는 원의 둘레 계산
  const RADIUS = 45; // 반지름

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
      `${import.meta.env.VITE_SERVER_URL}/users/idx/${idx}`,
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
              <div className="flex flex-row justify-center items-center">
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
                {parseInt(idx!) === userIdx && (
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
                )}
              </div>
              <p className="text-l mt-8 font-bold">LADDER SCORE</p>
              <p className="text-l text-center font-bold text-2xl">
                {userData?.ranking.score}점
              </p>
            </div>
            {/* user */}
            <DisplayWinningRate userData={userData} radius={RADIUS} />
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
          {parseInt(idx!) === userIdx && (
            <div className="flex justify-end pr-8">
              <button
                className="bg-blue-500 text-white px-4 rounded text-sm p-0.5"
                onClick={onOpen}
              >
                프로필 수정
              </button>
            </div>
          )}
          {/* profile button */}
        </div>
        <ProfilePictureChangeModal
          isOpen={isOpen}
          onClose={onClose}
          onAvatarChange={handleAvatarChange}
        />
        <DisplayGameHistory gameHistory={gameHistory} />
      </div>
    </div>
  );
}

export default MyProfile;
