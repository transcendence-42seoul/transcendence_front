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
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import bell from '../assets/bell.svg';
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

function ChatItem({ chatRoom, onClick, onDoubleClick }) {
  const handleSingleClick = () => {
    onClick(chatRoom);
  };

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

function FriendItem({ friend, onClick, onContextMenu }) {
  return (
    <div
      className={`flex justify-between items-center p-4 my-2 mx-2
		  border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
        friend.isHighlighted ? 'bg-blue-100' : 'bg-white'
      }`}
      onClick={onClick}
      onContextMenu={(e) => onContextMenu(e, friend)}
    >
      <span>{friend.name}</span>
    </div>
  );
}

function OnlineItem({ online, onClick, onContextMenu }) {
  return (
    <div
      className={`flex justify-between items-center p-4 my-2 mx-2
			border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
        online.isHighlighted ? 'bg-blue-100' : 'bg-white'
      } cursor-pointer`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <span>{online.name}</span>
    </div>
  );
}

function OnlineUserContextMenu({ user, position, onClose }) {
  // useEffect를 제거하고, position을 직접 스타일로 사용
  return (
    <div
      className="absolute z-50 w-40 bg-white shadow-lg rounded-md"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 메뉴 내용 */}
      <ul className="divide-y divide-gray-100">
        <li className="p-2 hover:bg-gray-100 cursor-pointer">친구신청</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">차단</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">노말 챌린지</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">하드 챌린지</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">DM보내기</li>
      </ul>
    </div>
  );
}

function FriendContextMenu({ friend, position, onClose }) {
  return (
    <div
      className="absolute z-50 w-40 bg-white shadow-lg rounded-md"
      style={{ top: position.y, left: position.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul className="divide-y divide-gray-100">
        <li className="p-2 hover:bg-gray-100 cursor-pointer">친구 삭제</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">차단</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">노말 챌린지</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">하드 챌린지</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">DM 보내기</li>
      </ul>
    </div>
  );
}

function MainPage() {
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
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    {
      name: '채팅방 2',
      maxPeople: 5,
      currentPeople: 5,
      isPrivate: true,
      isHighlighted: false,
    },
    // 다른 채팅방 항목들...
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
    { id: 2, name: '친구 B', isHighlighted: false },
    { id: 2, name: '친구 B', isHighlighted: false },
    { id: 2, name: '친구 B', isHighlighted: false },
    { id: 2, name: '친구 B', isHighlighted: false },
    { id: 2, name: '친구 B', isHighlighted: false },
    { id: 2, name: '친구 B', isHighlighted: false },
    { id: 2, name: '친구 B', isHighlighted: false },
    // 추가적인 친구 데이터...
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
      return null; // selectedChat이 없으면 PasswordModal을 렌더링하지 않음
    }

    return (
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          onClosePasswordModal();
          setSelectedChat(null); // 모달을 닫을 때 selectedChat을 초기화
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
    // 컨텍스트 메뉴가 이미 열려 있고, 같은 사용자를 다시 우클릭하면 메뉴를 닫음
    if (
      contextMenu &&
      contextMenu.type === 'online' &&
      contextMenu.user.id === online.id
    ) {
      closeContextMenu();
    } else {
      setContextMenu({
        type: 'online', // 타입을 추가하여 친구인지 온라인 유저인지 구분
        user: online,
        position: { x: e.clientX, y: e.clientY },
      });
    }
  };

  useEffect(() => {
    // 메뉴 외부 클릭 감지를 위한 이벤트 리스너
    const handleOutsideClick = (event) => {
      if (contextMenu) {
        closeContextMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [contextMenu]);

  const closeContextMenu = () => {
    setContextMenu(null);
    setFriendsList(
      friendsList.map((item) => ({ ...item, isHighlighted: false })),
    );
    setOnlineList(
      onlineList.map((item) => ({ ...item, isHighlighted: false })),
    );
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
        type: 'friend', // 타입을 추가하여 친구인지 온라인 유저인지 구분
        user: friend,
        position: { x: e.clientX, y: e.clientY },
      });
    }
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
            <div className="relative">
              <img
                className="object-scale-down h-12 w-12"
                src={setting}
                alt="setting"
              />
            </div>
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
            {/* Tab Headers */}
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

            {/* Tab Content */}
            <div className="flex flex-col p-4 bg-blue-200 h-full overflow-auto">
              {activeTab === 'lobby' && (
                <div className="flex-grow">
                  {onlineList.map((online) => (
                    <OnlineItem
                      key={online.id}
                      online={online}
                      onClick={() => handleOnlineClick(online)}
                      onContextMenu={(e) => handleOnlineRightClick(e, online)}
                    />
                  ))}
                </div>
              )}
              {activeTab === 'friends' && (
                <div className="flex-grow">
                  {/* 친구 목록을 렌더링합니다. */}
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

              {contextMenu &&
                (contextMenu.type === 'online' ? (
                  <OnlineUserContextMenu
                    user={contextMenu.user}
                    position={contextMenu.position}
                    onClose={closeContextMenu}
                  />
                ) : (
                  <FriendContextMenu
                    friend={contextMenu.user}
                    position={contextMenu.position}
                    onClose={closeContextMenu}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
