import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import setting from '../assets/setting.svg';
import { useNavigate } from 'react-router';
import { UserContextMenu, UserItem } from './components/UserItem';
import { FriendContextMenu, FriendItem } from './components/FriendItem';
import UtilButton from './components/UtilButton';
import NotificationButton from './components/NotificationButton';
import { chatSocket, chatSocketConnect } from './mini_chat/chat.socket';
import axios from 'axios';
import { FetchUserData } from './components/FetchUserData';
import { getCookie } from '../common/cookie/cookie';
import { FecthFriendList, Friends } from './components/FetchFriendList';

function ChatItem({ chatRoom, onClick, onDoubleClick }) {
  return (
    <div
      className={`flex justify-between items-center p-4 my-2 mx-2
		border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
      chatRoom.isHighlighted ? 'bg-blue-100' : 'bg-white'
    }`}
      onClick={() => onClick(chatRoom)}
      onDoubleClick={() => onDoubleClick(chatRoom)}
    >
      <span>{chatRoom.name}</span>
      {/* <span>{`${chatRoom.currentPeople}/${chatRoom.maxPeople}`}</span> */}
      <span>{`${chatRoom.currentParticipant}/${chatRoom.limit}`}</span>
      <span>{chatRoom.type === 'PRIVATE' ? 'Private' : 'Public'}</span>
    </div>
  );
}

function PasswordModal({ isOpen, onClose, onSubmit, chatRoom }) {
  const [password, setPassword] = useState('');

  const handlePasswordSubmit = () => {
    onSubmit(password, chatRoom);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{chatRoom.name} - Enter Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handlePasswordSubmit}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function MainPage() {
  const navigate = useNavigate();

  const token = getCookie('token');

  const [userIdx, setUserIdx] = useState<number>(0);
  const [chatRooms, setChatRooms] = useState([]);
  const [chatRoomAdded, setChatRoomAdded] = useState(true);
  const [activeTab, setActiveTab] = useState('lobby');

  const [selectedChat, setSelectedChat] = useState(null);

  const {
    isOpen: isPasswordModalOpen,
    onOpen: onOpenPasswordModal,
    onClose: onClosePasswordModal,
  } = useDisclosure();

  const [friendsList, setFriendsList] = useState<Friends[]>([]);

  const [onlineList, setOnlineList] = useState([
    { idx: 1, name: '온라인 A', isHighlighted: false },
    { idx: 2, name: '온라인 B', isHighlighted: false },
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

  const onChatRoomAdded = () => {
    setChatRoomAdded(true);
  };

  const handleChatClick = (chatRoom) => {
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((room) =>
        room.idx === chatRoom.idx
          ? { ...room, isHighlighted: !room.isHighlighted }
          : { ...room, isHighlighted: false },
      ),
    );
  };

  const handleChatDoubleClick = (chatRoom) => {
    if (chatRoom.isPrivate) {
      setSelectedChat(chatRoom);
      onOpenPasswordModal();
    } else {
      chatSocketConnect();

      // joinChat 이벤트 보내기
      chatSocket.emit('joinChat', {
        room_id: chatRoom.idx,
        password: chatRoom.password,
      });

      console.log('chatRoom.idx', chatRoom.idx);

      navigate(`/chat/${chatRoom.idx}`);
    }
  };

  const handleJoinPrivateChat = (chatRoom, password) => {
    chatSocketConnect();

    chatSocket.emit('joinChat', {
      room_id: chatRoom.idx,
      password: password,
    });

    navigate(`/chat/${chatRoom.idx}`);
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

  const handleFriendClick = (clickedFriend) => {
    setFriendsList(
      friendsList.map((friend) =>
        friend.idx === clickedFriend.idx
          ? { ...friend, isHighlighted: !friend.isHighlighted }
          : { ...friend, isHighlighted: false },
      ),
    );
  };

  const handleOnlineClick = (clickedOnline) => {
    setOnlineList(
      onlineList.map((online) =>
        online.idx === clickedOnline.idx
          ? { ...online, isHighlighted: !online.isHighlighted }
          : { ...online, isHighlighted: false },
      ),
    );
  };

  const handleOnlineRightClick = (e, online) => {
    e.preventDefault();
    const isAlreadyHighlighted = online.isHighlighted;
    setOnlineList(
      onlineList.map((item) =>
        item.idx === online.idx
          ? { ...item, isHighlighted: !isAlreadyHighlighted }
          : { ...item, isHighlighted: false },
      ),
    );

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

  const handleFriendRightClick = (e, friend: Friends) => {
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
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/chats/private-public',
        );
        const chatRoomsData = response.data.map((chatRoom) => ({
          ...chatRoom,
          isHighlighted: false,
        }));
        setChatRooms(chatRoomsData);
      } catch (error) {
        console.error('채팅방 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    if (chatRoomAdded) {
      fetchChatRooms();
      setChatRoomAdded(false);
    }

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
  }, [chatRoomAdded, contextMenuRef, closeContextMenu]);

  const handleDeleteFriend = (friendId) => {
    setFriendsList(friendsList.filter((friend) => friend.idx !== friendId));
  };

  const handleBlockFriend = (friendId) => {
    setFriendsList(friendsList.filter((friend) => friend.idx !== friendId));
  };

  const handleBlockOnline = (onlineId) => {
    setOnlineList(onlineList.filter((online) => online.idx !== onlineId));
  };

  const handleSettingsClick = () => {
    navigate('/setting');
  };

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
                      user={online}
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
                      onContextMenu={(e) => handleFriendRightClick(e, friend)}
                    />
                  ))}
                </div>
              )}

              <div ref={contextMenuRef}>
                {contextMenu &&
                  (contextMenu.type === 'online' ? (
                    <UserContextMenu
                      user={contextMenu.user}
                      position={contextMenu.position}
                      onBlock={() => handleBlockOnline(contextMenu.user.idx)}
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

export default MainPage;
