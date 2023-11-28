import { useEffect, useRef, useState } from 'react';
import setting from '../assets/setting.svg';
import { useNavigate, useParams } from 'react-router';
import { UserContextMenu, UserItem } from './components/UserItem';
import { FriendContextMenu, FriendItem } from './components/FriendItem';
import UtilButton from './components/UtilButton';
import NotificationButton from './components/NotificationButton';
import MiniChatting from './mini_chat/MiniChatting';
import { chatSocket } from './mini_chat/chat.socket';
import { chatSocketLeave } from './mini_chat/chat.socket';
import { FetchUserData } from './components/FetchUserData';
import { getCookie } from '../common/cookie/cookie';
import axios from 'axios';
import { FecthFriendList, Friends } from './components/FetchFriendList';

function ChatPage() {
  const { idx } = useParams();

  const navigate = useNavigate();

  const token = getCookie('token');

  const [userIdx, setUserIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState('chat');

  const [friendsList, setFriendsList] = useState<Friends[]>([]);

  const [chatMemberList, setChatMemberList] = useState([
    { idx: 1, name: '채팅 참여자 A', isHighlighted: false },
    { idx: 2, name: '채팅 참여자 B', isHighlighted: false },
  ]);

  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);

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

  useEffect(() => {
    const fetchFriendList = async () => {
      if (userIdx > 0) {
        try {
          const friendsData = await FecthFriendList(userIdx);
          setFriendsList(friendsData);
        } catch (error) {
          console.error('Error fetching friends list:', error);
        }
      }
    };

    fetchFriendList();
  }, [userIdx]);

  const handleFriendClick = (clickedFriend) => {
    setFriendsList(
      friendsList.map((friend) =>
        friend.idx === clickedFriend.idx
          ? { ...friend, isHighlighted: !friend.isHighlighted }
          : { ...friend, isHighlighted: false },
      ),
    );
  };

  const handleChatMemberClick = (clickChatMember) => {
    setChatMemberList(
      chatMemberList.map((chatMember) =>
        chatMember.idx === clickChatMember.idx
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
        item.idx === chatMember.idx
          ? { ...item, isHighlighted: !isAlreadyHighlighted }
          : { ...item, isHighlighted: false },
      ),
    );

    if (
      contextMenu &&
      contextMenu.type === 'chatMember' &&
      contextMenu.user.idx === chatMember.idx
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
        item.idx === friend.idx
          ? { ...item, isHighlighted: !isAlreadyHighlighted }
          : { ...item, isHighlighted: false },
      ),
    );
    if (
      contextMenu &&
      contextMenu.type === 'friend' &&
      contextMenu.user.idx === friend.idx
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
    navigate(`/profile/${user.idx}`);
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
  }, [navigate, contextMenuRef, closeContextMenu]);

  const onClickChannelLeave = (room_id) => {
    console.log('room_id:', room_id);
    chatSocket.emit('leaveChat', room_id);
    chatSocketLeave();

    navigate('/main');
  };

  const handleDeleteFriend = (friendId) => {
    setFriendsList(friendsList.filter((friend) => friend.idx !== friendId));
  };

  const handleBlockFriend = (friendId) => {
    setFriendsList(friendsList.filter((friend) => friend.idx !== friendId));
  };

  const handleBlockChatMember = (chatMemberId) => {
    setChatMemberList(
      chatMemberList.filter((chatMember) => chatMember.idx !== chatMemberId),
    );
  };

  const handleSettingsClick = () => {
    navigate('/setting');
  };

  return (
    <div className=" h-screen w-screen flex flex-row items-center justify-start align-middle">
      <div className="flex flex-col basis-3/5 h-screen">
        <UtilButton
          pageType={'chat'}
          onChatState={() => onClickChannelLeave(idx)}
        />
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
        {userIdx > 0 && <FetchUserData idx={userIdx} />}
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
                      key={chatMember.idx}
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
                      key={friend.idx}
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
                      onBlock={() =>
                        handleBlockChatMember(contextMenu.user.idx)
                      }
                      closeContextMenu={() => closeContextMenu()}
                    />
                  ) : (
                    <FriendContextMenu
                      friend={contextMenu.user}
                      position={contextMenu.position}
                      onDelete={() => handleDeleteFriend(contextMenu.user.idx)}
                      onBlock={() => handleBlockFriend(contextMenu.user.idx)}
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
