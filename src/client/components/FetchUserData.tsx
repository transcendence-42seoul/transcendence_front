import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

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
  };
  ranking: {
    score: number;
  };
}

type FetchUserDataProp = {
  idx: number;
};

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

export const FetchUserData = (props: FetchUserDataProp) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<User>();

  const fetchUserData = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/users/idx/${props.idx}`,
    );

    setUserData(makeUserDataFormat(response.data));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onClickUser = () => {
    navigate(`/profile/${props.idx}`);
  };

  return (
    <div
      className="h-2/6 flex flex-row border-dashed border-4 border-sky-500 rounded-lg mx-2 cursor-pointer"
      onClick={onClickUser}
    >
      <div className="w-2/5 flex justify-center items-center">
        <div className="w-full aspect-square mx-1 flex justify-center items-center">
          <div className="rounded-full border-2 border-black w-full h-full aspect-square overflow-hidden">
            {userData?.avatar && (
              <img
                className="object-cover w-full h-full"
                src={convertToBase64Image(userData.avatar.image_data)}
                alt="User Avatar"
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-3/5 flex flex-col justify-center items-center p-4 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          {userData?.nickname}
        </h1>
        <h2 className="text-2xl text-gray-700 mb-1">{`${userData?.record.total_win}승 ${userData?.record.total_lose}패`}</h2>
        <h3 className="text-xl text-gray-600">{userData?.ranking.score}점</h3>
      </div>
    </div>
  );
};
