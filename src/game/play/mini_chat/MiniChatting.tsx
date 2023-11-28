import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import { gameSocket, gameSocketConnect } from '../../socket/game.socket';

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
  const [chatList, setChatList] = useState<ChatDataType[]>([]);

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
    gameSocket.emit('new_chat', chat);
  };

  const chatListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    gameSocket.on('receiveMessage', (message: string) => {
      handleReceiveChat(message);
    });

    gameSocketConnect();
    return () => {
      gameSocket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    // chatList가 업데이트될 때마다 마지막 li 엘리먼트로 스크롤 이동
    if (chatListRef.current) {
      const lastLi = chatListRef.current.lastElementChild;
      if (lastLi) {
        lastLi.scrollIntoView();
      }
    }
  }, [chatList]);

  return (
    <div className="bg-sky-200 w-3/12 max-h-full h-full rounded-lg p-3 flex-col justify-between lg:visual lg:flex hidden">
      <ul
        ref={chatListRef}
        key={uuidv4()}
        className="overflow-y-scroll pr-2 grow"
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
