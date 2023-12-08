import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import setting from '../assets/setting.svg';
import { useNavigate } from 'react-router';
import { UserContextMenu, UserItem } from './components/UserItem';
import { FriendContextMenu, FriendItem } from './components/FriendItem';
import UtilButton from './components/UtilButton';
import NotificationButton from './components/NotificationButton';
import {
  chatSocket,
  chatSocketConnect,
  chatSocketLeave,
} from './mini_chat/chat.socket';
import axios from 'axios';
import { FetchUserData } from './components/FetchUserData';
import { getCookie } from '../common/cookie/cookie';
import { FecthFriendList, Friends } from './components/FetchFriendList';
import { ChatItem, IChatRoom, PasswordModal } from './components/ChatItem';
import { appSocket } from '../common/socket/app.socket';
import { CreateChallengeModal } from './modal/CreateChallengeModal/CreateChallengeModal';

interface IContextMenu {
  type: 'online' | 'friend';
  user: IOnlineItem | Friends;
  position: { x: number; y: number };
}

function MainPage() {
  const navigate = useNavigate();

  const token = getCookie('token');

  const [userIdx, setUserIdx] = useState<number>(0);
  const [chatRooms, setChatRooms] = useState<IChatRoom[]>([]);
  const [chatRoomAdded, setChatRoomAdded] = useState(true);
  const [activeTab, setActiveTab] = useState('lobby');
  const [challengeUserIdx, setChallengeUserIdx] = useState<number>(0);
  const [selectedChat, setSelectedChat] = useState<IChatRoom | null>(null);

  const {
    isOpen: isPasswordModalOpen,
    onOpen: onOpenPasswordModal,
    onClose: onClosePasswordModal,
  } = useDisclosure();

  const [friendsList, setFriendsList] = useState<Friends[]>([]);

  const [onlineList, setOnlineList] = useState<IOnlineItem[]>([]);

  const [contextMenu, setContextMenu] = useState<IContextMenu | null>(null);
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

  const fetchOnlineList = async () => {
    try {
      const onlineUsers = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/users/online`,
      );

      const formattedUsers = onlineUsers.data.map((user: IOnlineItem) => ({
        idx: user.idx,
        nickname: user.nickname,
        isHighlighted: false,
      }));
      setOnlineList(formattedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserIdx();
  }, []);

  useEffect(() => {
    if (userIdx > 0) {
      fetchOnlineList();
    }
  }, [userIdx]);

  useEffect(() => {
    const fetchFriendList = async () => {
      if (userIdx <= 0) return;
      try {
        const friendsData = await FecthFriendList(userIdx);
        setFriendsList(friendsData);
      } catch (error) {
        console.error('Error fetching friends list:', error);
      }
    };

    fetchFriendList();

    appSocket.on('updateFriendList', (friends) => {
      const formattedFriends = friends.map((friend: Friends) => {
        return {
          ...friend,
          isHighlighted: false,
        };
      });
      setFriendsList(formattedFriends);
    });

    return () => {
      appSocket.off('updateFriendList');
    };
  }, [userIdx]);

  useEffect(() => {
    appSocket.on('onlineUsers', (users) => {
      const formattedUsers = users.map((user: IOnlineItem) => ({
        idx: user.idx,
        nickname: user.nickname,
        isHighlighted: false,
      }));
      setOnlineList(formattedUsers);
    });

    return () => {
      appSocket.off('onlineUsers');
    };
  }, [appSocket]);

  const onChatRoomAdded = () => {
    setChatRoomAdded(true);
  };

  const handleChatClick = (chatRoom: IChatRoom) => {
    setChatRooms((prevChatRooms: IChatRoom[]) =>
      prevChatRooms.map((room: IChatRoom) =>
        room.idx === chatRoom.idx
          ? { ...room, isHighlighted: !room.isHighlighted }
          : { ...room, isHighlighted: false },
      ),
    );
  };

  const handleChatDoubleClick = (chatRoom: IChatRoom) => {
    if (chatRoom.type === 'PRIVATE') {
      setSelectedChat(chatRoom);
      onOpenPasswordModal();
    } else {
      chatSocketConnect();
      chatSocket.emit(
        'joinChat',
        {
          room_id: chatRoom.idx,
        },
        (response: any) => {
          if (response.status === 'success') {
            navigate(`/chat/${chatRoom.idx}`);
          }
        },
      );
    }
  };

  const handleJoinPrivateChat = (chatRoom: IChatRoom, password: string) => {
    chatSocketConnect();
    chatSocket.emit(
      'joinChat',
      {
        room_id: chatRoom.idx,
        password,
      },
      (response: any) => {
        if (response.status === 'success') {
          navigate(`/chat/${chatRoom.idx}`);
        } else if (response.message === 'Password is incorrect') {
          alert(response.message);
          chatSocketLeave();
        }
      },
    );
  };

  const renderPasswordModal = () => {
    if (!selectedChat) {
      return null;
    }

    return (
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          onClosePasswordModal();
          setSelectedChat(null);
        }}
        onSubmit={(password) => handleJoinPrivateChat(selectedChat, password)}
        chatRoom={selectedChat}
      />
    );
  };

  const handleFriendClick = (clickedFriend: Friends) => {
    setFriendsList(
      friendsList.map((friend) =>
        friend.idx === clickedFriend.idx
          ? { ...friend, isHighlighted: !friend.isHighlighted }
          : { ...friend, isHighlighted: false },
      ),
    );
  };

  const handleOnlineClick = (clickedOnline: IOnlineItem) => {
    setOnlineList(
      onlineList.map((online) =>
        online.idx === clickedOnline.idx
          ? { ...online, isHighlighted: !online.isHighlighted }
          : { ...online, isHighlighted: false },
      ),
    );
  };

  const handleOnlineRightClick = (
    e: React.MouseEvent<Element, MouseEvent>,
    online: IOnlineItem,
  ) => {
    e.preventDefault();
    const isAlreadyHighlighted = online.isHighlighted;
    setOnlineList(
      onlineList.map((item) =>
        item.idx === online.idx
          ? { ...item, isHighlighted: !isAlreadyHighlighted }
          : { ...item, isHighlighted: false },
      ),
    );

    if (online.idx === userIdx) {
      return;
    }

    if (
      contextMenu &&
      contextMenu.type === 'online' &&
      contextMenu.user.idx === online.idx
    ) {
      closeContextMenu();
    } else {
      setContextMenu({
        type: 'online',
        user: online,
        position: { x: e.clientX, y: e.clientY },
      });
      setChallengeUserIdx(online.idx);
    }
  };

  const closeContextMenu = () => {
    if (contextMenu) {
      setContextMenu(null);
      setFriendsList(
        friendsList.map((item) => ({ ...item, isHighlighted: false })),
      );
      setOnlineList(
        onlineList.map((item) => ({ ...item, isHighlighted: false })),
      );
    }
  };

  const handleFriendRightClick = (e: React.MouseEvent, friend: Friends) => {
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
      setChallengeUserIdx(friend.idx);
    }
  };

  const handleUserDoubleClick = (user: IOnlineItem | Friends) => {
    navigate(`/profile/${user.idx}`);
  };

  useEffect(() => {
    const fetchChatRooms = async () => {
      console.log('fetchChatRooms');
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/chats/private-public`,
        );
        const chatRoomsData = response.data.map((chatRoom: IChatRoom) => ({
          ...chatRoom,
          isHighlighted: false,
        }));
        console.log('chatRoomsData', chatRoomsData);
        setChatRooms(chatRoomsData);
      } catch (error) {
        console.error('채팅방 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    if (chatRoomAdded) {
      fetchChatRooms();
      setChatRoomAdded(false);
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        event.target instanceof Node &&
        !(contextMenuRef.current as HTMLDivElement).contains(event.target)
      ) {
        closeContextMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    appSocket.on('chatRoomCreated', (newChatRoom) => {
      setChatRooms((prevChatRooms) => [...prevChatRooms, newChatRoom]);
    });

    appSocket.on('chatRoomUpdated', (updatedChatRoom) => {
      setChatRooms((prevChatRooms) =>
        prevChatRooms.map((chatRoom) =>
          chatRoom.idx === updatedChatRoom.idx ? updatedChatRoom : chatRoom,
        ),
      );
    });

    appSocket.on('chatRoomDeleted', (deletedChatIdx: string) => {
      let tmp = [...chatRooms];
      tmp = tmp.filter((chatRoom) => chatRoom.idx !== parseInt(deletedChatIdx));
      setChatRooms(tmp);
    });

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);

      chatSocket.off('acceptPrivateChat');
      chatSocket.off('showPasswordError');
      appSocket.off('chatRoomCreated');
      appSocket.off('chatRoomUpdated');
      appSocket.off('chatRoomDeleted');
    };
  }, [chatRoomAdded, contextMenuRef, closeContextMenu]);

  const handleDeleteFriend = (friendIdx: number) => {
    appSocket.emit('deleteFriend', {
      managedIdx: friendIdx,
    });
  };

  const handleBlockFriend = (friendIdx: number) => {
    appSocket.emit('block', {
      managedIdx: friendIdx,
    });
  };

  const handleBlockOnline = (onlineIdx: number) => {
    appSocket.emit('block', {
      managedIdx: onlineIdx,
    });
  };

  const handleSettingsClick = () => {
    navigate('/setting');
  };

  const handleFriendRequest = (receiverIdx: number) => {
    appSocket.emit('friendRequest', receiverIdx);
  };

  const {
    isOpen: isCreateChallengeOpen,
    onOpen: onOpenCreateChallenge,
    onClose: onCloseCreateChallenge,
  } = useDisclosure();

  return (
    <div className=" h-screen w-screen flex flex-row items-center justify-start align-middle">
      <div className="flex flex-col basis-3/5 h-screen">
        <UtilButton pageType={'main'} onChatState={onChatRoomAdded} />
        <div className="flex flex-col h-5/6">
          <div className="flex flex-col justify-between h-full">
            <div className="border-double border-4 border-sky-500 mx-2 rounded-lg p-4 flex items-center justify-center">
              <h1>채팅 목록</h1>
            </div>
            <div className="bg-sky-200 mx-2 my-2 rounded-lg flex flex-col overflow-auto h-full">
              <ul>
                {chatRooms.map((chatRoom, index) => (
                  <ChatItem
                    key={index}
                    chatRoom={chatRoom}
                    onClick={handleChatClick}
                    onDoubleClick={handleChatDoubleClick}
                  />
                ))}
              </ul>
              {renderPasswordModal()}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col basis-2/5 h-screen">
        <div className="h-1/6 flex flex-row justify-evenly">
          {userIdx > 0 && <NotificationButton userIdx={userIdx} />}
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
                  activeTab === 'lobby' ? 'bg-blue-200' : 'bg-blue-100'
                }`}
                onClick={() => setActiveTab('lobby')}
              >
                온라인 목록
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
              {activeTab === 'lobby' && (
                <div className="flex-grow">
                  {onlineList.map((online) => (
                    <UserItem
                      key={online.idx}
                      userNickname={online.nickname}
                      userHighlighted={online.isHighlighted}
                      onClick={() => handleOnlineClick(online)}
                      onDoubleClick={() => handleUserDoubleClick(online)}
                      onContextMenu={(e) => handleOnlineRightClick(e, online)}
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
                      onContextMenu={(e: React.MouseEvent) =>
                        handleFriendRightClick(e, friend)
                      }
                    />
                  ))}
                </div>
              )}
              <div ref={contextMenuRef}>
                {contextMenu &&
                  (contextMenu.type === 'online' ? (
                    <UserContextMenu
                      userIdx={contextMenu.user.idx}
                      position={contextMenu.position}
                      onBlock={() => handleBlockOnline(contextMenu.user.idx)}
                      onFriendRequest={() =>
                        handleFriendRequest(contextMenu.user.idx)
                      }
                      closeContextMenu={() => closeContextMenu()}
                      challengModalState={{
                        isOpen: isCreateChallengeOpen,
                        onOpen: onOpenCreateChallenge,
                        onClose: onCloseCreateChallenge,
                      }}
                    />
                  ) : (
                    <FriendContextMenu
                      friendIdx={contextMenu.user.idx}
                      position={contextMenu.position}
                      onDelete={() => handleDeleteFriend(contextMenu.user.idx)}
                      onBlock={() => handleBlockFriend(contextMenu.user.idx)}
                      closeContextMenu={() => closeContextMenu()}
                      challengModalState={{
                        isOpen: isCreateChallengeOpen,
                        onOpen: onOpenCreateChallenge,
                        onClose: onCloseCreateChallenge,
                      }}
                    />
                  ))}
              </div>
              <CreateChallengeModal
                requestedIdx={challengeUserIdx}
                modalState={{
                  isOpen: isCreateChallengeOpen,
                  onOpen: onOpenCreateChallenge,
                  onClose: onCloseCreateChallenge,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
