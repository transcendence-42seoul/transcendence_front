import { useEffect, useRef, useState } from 'react';
import setting from '../assets/setting.svg';
import logo from '../assets/logo.jpg';
import { useNavigate } from 'react-router';
import { UserContextMenu, UserItem } from './components/UserItem';
import { FriendContextMenu, FriendItem } from './components/FriendItem';
import UtilButton from './components/UtilButton';
import NotificationButton from './components/NotificationButton';
import MiniChatting from './mini_chat/MiniChatting';

function ChatPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('chat');

  const [friendsList, setFriendsList] = useState([
    { id: 1, name: '친구 A', isHighlighted: false },
    { id: 2, name: '친구 B', isHighlighted: false },
  ]);

  const [chatMemberList, setChatMemberList] = useState([
    { id: 1, name: '채팅 참여자 A', isHighlighted: false },
    { id: 2, name: '채팅 참여자 B', isHighlighted: false },
  ]);

  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);

  const handleFriendClick = (clickedFriend) => {
    setFriendsList(
      friendsList.map((friend) =>
        friend.id === clickedFriend.id
          ? { ...friend, isHighlighted: !friend.isHighlighted }
          : { ...friend, isHighlighted: false },
      ),
    );
  };

  const handleChatMemberClick = (clickChatMember) => {
    setChatMemberList(
      chatMemberList.map((chatMember) =>
        chatMember.id === clickChatMember.id
          ? { ...chatMember, isHighlighted: !chatMember.isHighlighted }
          : { ...chatMember, isHighlighted: false },
      ),
    );
  };

  const handleChatMemberRightClick = (e, chatMember) => {
    e.preventDefault();
    const isAlreadyHighlighted = chatMember.isHighlighted;
    setChatMemberList(
      chatMemberList.map((item) =>
        item.id === chatMember.id
          ? { ...item, isHighlighted: !isAlreadyHighlighted }
          : { ...item, isHighlighted: false },
      ),
    );

    if (
      contextMenu &&
      contextMenu.type === 'chatMember' &&
      contextMenu.user.id === chatMember.id
    ) {
      closeContextMenu();
    } else {
      setContextMenu({
        type: 'chatMember',
        user: chatMember,
        position: { x: e.clientX, y: e.clientY },
      });
    }
  };

  const closeContextMenu = () => {
    if (contextMenu) {
      setContextMenu(null);
      setFriendsList(
        friendsList.map((item) => ({ ...item, isHighlighted: false })),
      );
      setChatMemberList(
        chatMemberList.map((item) => ({ ...item, isHighlighted: false })),
      );
    }
  };

  const handleFriendRightClick = (e, friend) => {
    e.preventDefault();
    const isAlreadyHighlighted = friend.isHighlighted;
    setFriendsList(
      friendsList.map((item) =>
        item.id === friend.id
          ? { ...item, isHighlighted: !isAlreadyHighlighted }
          : { ...item, isHighlighted: false },
      ),
    );
    if (
      contextMenu &&
      contextMenu.type === 'friend' &&
      contextMenu.user.id === friend.id
    ) {
      closeContextMenu();
    } else {
      setContextMenu({
        type: 'friend',
        user: friend,
        position: { x: e.clientX, y: e.clientY },
      });
    }
  };

  const handleUserDoubleClick = (user) => {
    navigate(`/profile/${user.id}`);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        closeContextMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [contextMenuRef, closeContextMenu]);

  const handleDeleteFriend = (friendId) => {
    setFriendsList(friendsList.filter((friend) => friend.id !== friendId));
  };

  const handleBlockFriend = (friendId) => {
    setFriendsList(friendsList.filter((friend) => friend.id !== friendId));
  };

  const handleBlockChatMember = (chatMemberId) => {
    setChatMemberList(
      chatMemberList.filter((chatMember) => chatMember.id !== chatMemberId),
    );
  };

  const handleSettingsClick = () => {
    navigate('/setting');
  };

  return (
    <div className=" h-screen w-screen flex flex-row items-center justify-start align-middle">
      <div className="flex flex-col basis-3/5 h-screen">
        <UtilButton pageType={'chat'} />
        <div className="flex flex-col h-5/6">
          <div className="flex flex-col justify-between h-full">
            <div className="border-double border-4 border-sky-500 mx-2 rounded-lg p-4 flex items-center justify-center">
              {/*채팅방 이름 들어갈 곳*/}
            </div>
            <div className="bg-sky-200 mx-2 my-2 rounded-lg flex flex-col overflow-auto h-full">
              {/*채팅 들어갈 곳*/}
              <MiniChatting />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col basis-2/5 h-screen">
        <div className="h-1/6 flex flex-row justify-evenly">
          <NotificationButton />
          <div className="w-1/2 flex justify-center items-center">
            <button onClick={handleSettingsClick} aria-label="Settings">
              <img
                className="object-scale-down h-12 w-12"
                src={setting}
                alt="Settings"
              />
            </button>
          </div>
        </div>
        <div className="h-2/6 flex flex-row border-dashed border-4 border-sky-500 rounded-lg mx-2">
          <div className="w-2/5 flex justify-center items-center">
            <div className="w-full aspect-square mx-1 flex justify-center items-center">
              <div className="rounded-full border-2 border-black w-full h-full aspect-square overflow-hidden">
                <img
                  className="object-cover w-full h-full"
                  src={logo}
                  alt="logo"
                />
              </div>
            </div>
          </div>
          <div className="w-3/5 flex flex-col justify-center items-center p-4 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">sanghan</h1>
            <h2 className="text-2xl text-gray-700 mb-1">1승 15패</h2>
            <h3 className="text-xl text-gray-600">1295점</h3>
          </div>
        </div>
        <div className="h-3/6 flex flex-col border-2 border-sky-500 rounded-lg mx-2 my-2 min-h-0">
          <div className="h-full flex flex-col">
            <div className="flex border-b border-blue-200 overflow-auto">
              <div
                className={`flex-1 text-center p-2 cursor-pointer ${
                  activeTab === 'chat' ? 'bg-blue-200' : 'bg-blue-100'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                채팅 참여자 목록
              </div>
              <div
                className={`flex-1 text-center p-2 cursor-pointer ${
                  activeTab === 'friends' ? 'bg-blue-200' : 'bg-blue-100'
                }`}
                onClick={() => setActiveTab('friends')}
              >
                친구 목록
              </div>
            </div>
            <div className="flex flex-col p-4 bg-blue-200 h-full overflow-auto">
              {activeTab === 'chat' && (
                <div className="flex-grow">
                  {chatMemberList.map((chatMember) => (
                    <UserItem
                      key={chatMember.id}
                      user={chatMember}
                      onClick={() => handleChatMemberClick(chatMember)}
                      onDoubleClick={() => handleUserDoubleClick(chatMember)}
                      onContextMenu={(e) =>
                        handleChatMemberRightClick(e, chatMember)
                      }
                    />
                  ))}
                </div>
              )}
              {activeTab === 'friends' && (
                <div className="flex-grow">
                  {friendsList.map((friend) => (
                    <FriendItem
                      key={friend.id}
                      friend={friend}
                      onClick={() => handleFriendClick(friend)}
                      onDoubleClick={() => handleUserDoubleClick(friend)}
                      onContextMenu={(e) => handleFriendRightClick(e, friend)}
                    />
                  ))}
                </div>
              )}

              <div ref={contextMenuRef}>
                {contextMenu &&
                  (contextMenu.type === 'chatMember' ? (
                    <UserContextMenu
                      user={contextMenu.user}
                      position={contextMenu.position}
                      onBlock={() => handleBlockChatMember(contextMenu.user.id)}
                      closeContextMenu={() => closeContextMenu()}
                    />
                  ) : (
                    <FriendContextMenu
                      friend={contextMenu.user}
                      position={contextMenu.position}
                      onDelete={() => handleDeleteFriend(contextMenu.user.id)}
                      onBlock={() => handleBlockFriend(contextMenu.user.id)}
                      closeContextMenu={() => closeContextMenu()}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
