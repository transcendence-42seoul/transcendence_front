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
  Radio,
  RadioGroup,
  Select,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import bell from '../assets/bell.svg';
import setting from '../assets/setting.svg';
import logo from '../assets/logo.jpg';
import { useNavigate } from 'react-router';
import { UserContextMenu, UserItem } from './components/UserItem';
import { FriendContextMenu, FriendItem } from './components/FriendItem';
import CustomButton from './components/CustomButton';

function CreateChannelModal({ isOpen, onClose }) {
  const [channelType, setChannelType] = useState('public');
  const [password, setPassword] = useState('');
  const [maxPeople, setMaxPeople] = useState('');
  const maxPeopleOptions = Array.from({ length: 9 }, (_, i) => i + 2);

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
          <Select
            placeholder="최대 인원 선택"
            mb={4}
            value={maxPeople}
            onChange={(e) => setMaxPeople(e.target.value)}
          >
            {maxPeopleOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </Select>
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

  const [normalMode, setNormalMode] = useState(false);
  const [ladderMode, setLadderMode] = useState(false);
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'friend_request',
      message: 'seokchoi가 친구 요청을 했습니다.',
      status: 'unread',
    },
    {
      id: 2,
      type: 'game_request',
      message: 'jungchoi이 게임 요청을 했습니다.',
      status: 'unread',
    },
    {
      id: 3,
      type: 'message',
      message: 'doykim이 메시지를 보냈습니다.',
      status: 'unread',
    },
    {
      id: 4,
      type: 'game_request',
      message: 'soopark이 게임 요청을 했습니다.',
      status: 'unread',
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);

  const {
    isOpen: isCreateChannelOpen,
    onOpen: onOpenCreateChannel,
    onClose: onCloseCreateChannel,
  } = useDisclosure();

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

  const normalModeButton = () => {
    setNormalMode(!normalMode);
  };

  const ladderModeButton = () => {
    setLadderMode(!ladderMode);
  };

  const buttonData = [
    { label: '노말 경쟁전', onClick: normalModeButton },
    { label: '하드 경쟁전', onClick: ladderModeButton },
    { label: '채널 생성', onClick: onOpenCreateChannel },
  ];

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
          {buttonData.map((button, index) => (
            <CustomButton
              key={index}
              label={button.label}
              onClick={button.onClick}
            />
          ))}
          <CreateChannelModal
            isOpen={isCreateChannelOpen}
            onClose={onCloseCreateChannel}
          />
        </div>
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
          <div className="w-1/2 flex justify-center items-center">
            <div
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <img
                className="object-scale-down h-12 w-12"
                src={bell}
                alt="bell"
              />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              )}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 min-h-60 max-h-60 bg-white border rounded-lg shadow-lg overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex flex-col justify-between items-start p-3 border-b"
                      >
                        <span className="text-sm mb-2">
                          {notification.message}
                        </span>
                        {notification.type === 'friend_request' ||
                        notification.type === 'game_request' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              colorScheme="green"
                              onClick={(e) =>
                                handleNotificationResponse(e, notification.id)
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={(e) =>
                                handleNotificationResponse(e, notification.id)
                              }
                            >
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            colorScheme="gray"
                            onClick={(e) =>
                              handleNotificationResponse(e, notification.id)
                            }
                          >
                            Close
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <span>No notifications</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
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
