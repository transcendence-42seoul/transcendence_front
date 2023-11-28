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
import logo from '../assets/logo.jpg';
import { CreateLadderModal } from './modal/CreateLadderModal/CreateLadderModal';

function CreateChannelModal({ isOpen, onClose }) {
  const [channelType, setChannelType] = useState('public');
  const [password, setPassword] = useState('');

  const isPrivate = channelType === 'private';

  const handleTypeChange = (value) => {
    setChannelType(value);
    if (value === 'public') {
      setPassword('');
    }
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>채널 생성</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Input placeholder="채널명" mb={4} />
          <Input placeholder="최대 인원" mb={4} />
          <RadioGroup onChange={handleTypeChange} value={channelType}>
            <Stack direction="row">
              <Radio value="public">Public</Radio>
              <Radio value="private">Private</Radio>
            </Stack>
          </RadioGroup>
          {isPrivate && (
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              mt={4}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
import { useNavigate } from 'react-router';
import { UserContextMenu, UserItem } from './components/UserItem';
import { FriendContextMenu, FriendItem } from './components/FriendItem';
import UtilButton from './components/UtilButton';
import NotificationButton from './components/NotificationButton';

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
      <span>{`${chatRoom.currentPeople}/${chatRoom.maxPeople}`}</span>
      <span>{chatRoom.isPrivate ? 'Private' : 'Public'}</span>
    </div>
  );
}

function PasswordModal({ isOpen, onClose, onSubmit, chatRoom }) {
  const [password, setPassword] = useState('');

  const handlePasswordSubmit = () => {
    onSubmit(password, chatRoom); // 비밀번호와 채팅방 정보를 전달
    onClose(); // 모달 닫기
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

  const [chatRooms, setChatRooms] = useState([
    {
      name: '채팅방 1',
      maxPeople: 10,
      currentPeople: 3,
      isPrivate: false,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
  ]);
  const [activeTab, setActiveTab] = useState('lobby');

  const [selectedChat, setSelectedChat] = useState(null);

  const {
    isOpen: isPasswordModalOpen,
    onOpen: onOpenPasswordModal,
    onClose: onClosePasswordModal,
  } = useDisclosure();

  const [friendsList, setFriendsList] = useState([
    { id: 1, name: '친구 A', isHighlighted: false },
    { id: 2, name: '친구 B', isHighlighted: false },
  ]);

  const [onlineList, setOnlineList] = useState([
    { id: 1, name: '온라인 A', isHighlighted: false },
    { id: 2, name: '온라인 B', isHighlighted: false },
  ]);

  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);

  const showNotificationButton = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationResponse = (e, id) => {
    e.stopPropagation();
    removeNotification(id);
  };

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id),
    );
  };

  const handleChatClick = (chatRoom) => {
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((room) =>
        room.name === chatRoom.name
          ? { ...room, isHighlighted: !room.isHighlighted }
          : { ...room, isHighlighted: false },
      ),
    );
  };

  const handleChatDoubleClick = (chatRoom) => {
    if (chatRoom.isPrivate) {
      setSelectedChat(chatRoom);
      onOpenPasswordModal();
    }
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
        onSubmit={(password) => {
          console.log('Password for room', selectedChat.name, ':', password);
          // 비밀번호 검증 처리
        }}
        chatRoom={selectedChat}
      />
    );
  };

  const handleFriendClick = (clickedFriend) => {
    setFriendsList(
      friendsList.map((friend) =>
        friend.id === clickedFriend.id
          ? { ...friend, isHighlighted: !friend.isHighlighted }
          : { ...friend, isHighlighted: false },
      ),
    );
  };

  const handleOnlineClick = (clickedOnline) => {
    setOnlineList(
      onlineList.map((online) =>
        online.id === clickedOnline.id
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
        item.id === online.id
          ? { ...item, isHighlighted: !isAlreadyHighlighted }
          : { ...item, isHighlighted: false },
      ),
    );

    if (
      contextMenu &&
      contextMenu.type === 'online' &&
      contextMenu.user.id === online.id
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

  const handleBlockOnline = (onlineId) => {
    setOnlineList(onlineList.filter((online) => online.id !== onlineId));
  };

  const handleSettingsClick = () => {
    navigate('/setting');
  };

  return (
    <div className=" h-screen w-screen flex flex-row items-center justify-start align-middle">
      <div className="flex flex-col basis-3/5 h-screen">
        <div className="h-1/6 flex flex-row items-center align-middle justify-between">
          <CreateLadderModal />
          <Button
            colorScheme="teal"
            variant="outline"
            width={'full'}
            mx={2}
            onClick={onOpenCreateChannel}
          >
            채널 생성
          </Button>
          <CreateChannelModal
            isOpen={isCreateChannelOpen}
            onClose={onCloseCreateChannel}
          />
        </div>
        <UtilButton pageType={'main'} />
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
                      key={online.id}
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
                  (contextMenu.type === 'online' ? (
                    <UserContextMenu
                      user={contextMenu.user}
                      position={contextMenu.position}
                      onBlock={() => handleBlockOnline(contextMenu.user.id)}
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

export default MainPage;
