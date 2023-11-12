import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

type ChatDataType = {
  isMe: boolean;
  message: string;
};

function OtherChat(props: ChatDataType) {
  return (
    <li className="text-left flex mb-2">
      <div className="font-bold rounded-lg p-2 max-w-1/2 bg-amber-400">
        {props.message}
      </div>
    </li>
  );
}

function MyChat(props: ChatDataType) {
  return (
    <li className="text-right flex justify-end mb-2">
      <div className="font-bold rounded-lg p-2 max-w-1/2 bg-cyan-400">
        {props.message}
      </div>
    </li>
  );
}

function MiniChatting() {
  const navigation = useNavigate();

  // 서버 주소 설정
  const serverUrl: string = import.meta.env.VITE_SERVER_URL + '/gameChat';

  const sockerRef = useRef(
    io(serverUrl, {
      // withCredentials: true, // 요청할때 쿠키를 포함안시킬지 정하는 옵션인데 필요할지 의문이다.
      transports: ['websocket'], // CORS 에러 일단 안발생하게 만듬. 배포할 때는 특정 사이트를 등록해줘야함.
    }),
  );

  const [chatList, setChatList] = useState<ChatDataType[]>([
    { isMe: false, message: '오하요~' },
    { isMe: true, message: '안녕하세요' },
  ]);
  4;
  const handleReceiveChat = (chat: string) => {
    if (chat === '') return;
    setChatList((prev) => [
      ...prev,
      { id: prev.length + 1, isMe: false, message: chat },
    ]);
  };

  const handleSubmit = (chat: string) => {
    if (chat === '') return;
    setChatList((prev) => [
      ...prev,
      { id: prev.length + 1, isMe: true, message: chat },
    ]);
    sockerRef.current.emit('new_chat', chat);
  };

  // const joinRoom = (chat: string) => {
  //   if (chat === '') return;
  //   setChatList((prev) => [
  //     ...prev,
  //     { id: prev.length + 1, isMe: true, message: chat },
  //   ]);
  //   sockerRef.current.emit('new_chat', roomid);
  // };

  const chatListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    // chatList가 업데이트될 때마다 마지막 li 엘리먼트로 스크롤 이동
    if (chatListRef.current) {
      const lastLi = chatListRef.current.lastElementChild;
      if (lastLi) {
        lastLi.scrollIntoView();
      }
    }

    sockerRef.current.on('error', (error) => {
      navigation('/');
      console.error('Socket connection error:', error);
    });

    sockerRef.current.on('disconnect', () => {
      console.log('소켓이 연결이 끊겼습니다.');
    });

    sockerRef.current.on('receiveMessage', (message: string) => {
      handleReceiveChat(message);
    });

    return () => {
      sockerRef.current.off('error');
      sockerRef.current.off('disconnect');
      sockerRef.current.off('receiveMessage');
    };
  }, [chatList]);

  return (
    <div className="bg-lime-600 w-3/12 max-h-full h-full rounded-lg p-3 flex-col justify-between lg:visual lg:flex hidden">
      <ul
        ref={chatListRef}
        key={uuidv4()}
        className="overflow-y-scroll grow pr-2"
      >
        {chatList.map((chat: ChatDataType) => {
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
