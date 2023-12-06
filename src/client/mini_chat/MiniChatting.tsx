import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import { chatSocket, chatSocketConnect } from './chat.socket';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getCookie } from '../../common/cookie/cookie';
import { appSocket } from '../../common/socket/app.socket';

interface IChat {
  idx: number;
  content: string;
  send_at: Date;
  user: {
    idx: number;
    nickname: string;
  };
}

interface IChatMessage extends IChat {
  isMe: boolean;
}

function OtherChat(chat: IChat) {
  return (
    <div>
      <div>{chat.user.nickname}</div>
      <li className="text-left flex mb-2">
        <div className="max-w-1/2 font-bold rounded-lg p-2 bg-amber-400 break-words">
          {chat.content}
        </div>
      </li>
    </div>
  );
}

function MyChat(chat: IChat) {
  return (
    <li className="text-right flex justify-end mb-2">
      <div className="max-w-1/2 font-bold rounded-lg p-2 bg-cyan-400 break-words">
        {chat.content}
      </div>
    </li>
  );
}

interface MiniChattingProps {
  pageType: string;
}

function MiniChatting(props: MiniChattingProps) {
  const { idx } = useParams();

  const token = getCookie('token');

  const [chatList, setChatList] = useState<IChatMessage[]>([]);
  const [userIdx, setUserIdx] = useState();

  const fetchUserData = async () => {
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

  const fetchMessageList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/chats/message/${idx}/${userIdx}`,
      );

      const messagesData = response.data.map((message: IChat) => {
        return makeIChatMessage(message);
      });

      setChatList(messagesData);
    } catch (error) {
      console.error('채팅방 메시지를 가져오는데 실패했습니다:', error);
    }
  };

  const makeIChatMessage = (message: IChat): IChatMessage => {
    return {
      ...message,
      isMe: message.user.idx === userIdx,
    };
  };

  const handleReceiveChat = (chat: IChat) => {
    if (chat.content === '') return;
    const message = makeIChatMessage(chat);
    setChatList((prev: IChatMessage[]) => [...prev, message]);
  };

  const handleSubmit = (content: string) => {
    if (content == '') return;
    chatSocket.emit('sendMessage', { room_id: idx, message: content });
    if (props.pageType === 'dm') {
      appSocket.emit('dmNotification', idx);
    }
  };

  const chatListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (chatListRef.current) {
      const lastLi = chatListRef.current.lastElementChild;
      if (lastLi) {
        lastLi.scrollIntoView();
      }
    }
  }, [chatList]);

  useEffect(() => {
    if (!userIdx) return;
    fetchMessageList();
    chatSocket.on('receiveMessage', (chat: IChat) => {
      console.log('here receive callback', userIdx);
      handleReceiveChat(chat);
    });

    chatSocket.on('handleSubmit', (content: string) => {
      handleSubmit(content);
    });

    chatSocketConnect();
    return () => {
      chatSocket.off('receiveMessage');
      chatSocket.off('handleSubmit');
    };
  }, [userIdx]);

  return (
    <div className="bg-sky-200 w-full max-h-full h-full rounded-lg p-3 flex flex-col justify-between lg:visual lg:flex">
      <ul
        ref={chatListRef}
        key={uuidv4()}
        className="overflow-y-scroll grow pr-2"
      >
        {chatList &&
          chatList.map((chat: IChatMessage) => {
            return chat.isMe ? (
              <MyChat key={uuidv4()} {...chat} />
            ) : (
              <OtherChat key={uuidv4()} {...chat} />
            );
          })}
      </ul>
      <div className="bg-slate-100">
        <ChatInput handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default MiniChatting;
