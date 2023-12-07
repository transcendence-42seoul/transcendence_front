import { useNavigate } from 'react-router';
import { getCookie } from '../../common/cookie/cookie';
import axios from 'axios';
import { makeDmData } from './DmItem';
import { useEffect, useState } from 'react';
import { chatSocketConnect } from '../mini_chat/chat.socket';

export const DmNavigation = () => {
  const navigate = useNavigate();

  const token = getCookie('token');

  const [userIdx, setUserIdx] = useState(0);

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

  useEffect(() => {
    fetchUserIdx();
  }, []);

  const navigateToDm = async (otherUserIdx: number) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/chats/dm/${userIdx}/${otherUserIdx}`,
      );
      const dmData = makeDmData(response.data);

      if (dmData && dmData.idx) {
        chatSocketConnect();
        navigate(`/dm/${dmData.idx}`);
      }
    } catch (error) {
      console.error('DM 페이지 이동 중 에러:', error);
    }
  };

  return navigateToDm;
};
