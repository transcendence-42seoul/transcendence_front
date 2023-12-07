import { useNavigate, useParams } from 'react-router';
import { UtilButton } from './components/UtilButton';
import {
  chatSocket,
  chatSocketConnect,
  chatSocketLeave,
} from './mini_chat/chat.socket';
import MiniChatting from './mini_chat/MiniChatting';
import NotificationButton from './components/NotificationButton';
import setting from '../assets/setting.svg';
import { FetchUserData } from './components/FetchUserData';
import { useEffect, useRef, useState } from 'react';
import { UserContextMenu, UserItem } from './components/UserItem';
import axios from 'axios';
import { getCookie } from '../common/cookie/cookie';
import {
  DmContextMenu,
  DmMember,
  DmRoom,
  makeDmData,
  makeMemberData,
} from './components/DmItem';
import { FecthFriendList, Friends } from './components/FetchFriendList';
import { FriendContextMenu, FriendItem } from './components/FriendItem';
import { useDisclosure } from '@chakra-ui/react';
import { CreateChallengeModal } from './modal/CreateChallengeModal/CreateChallengeModal';
import { appSocket } from '../common/socket/app.socket';

function DmPage() {
  const navigate = useNavigate();

  const { idx } = useParams();

  const token = getCookie('token');

  const [userIdx, setUserIdx] = useState<number>(0);

  const [memberData, setMemberData] = useState<DmMember | null>(null);

  const [dmData, setDmData] = useState<DmRoom | null>(null);

  const [friendsList, setFriendsList] = useState<Friends[]>([]);

  const [activeTab, setActiveTab] = useState('chat');

  const [contextMenu, setContextMenu] = useState<DmContextMenu | null>(null);

  const [challengeUserIdx, setChallengeUserIdx] = useState<number>(0);

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

  const fetchOtherUserIdx = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/chats/participants/${idx}`,
      );

      setMemberData(makeMemberData(userIdx, response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDmData = async () => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/chats/dm/${userIdx}/${memberData?.idx}`,
      );

      setDmData(makeDmData(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserIdx();
    chatSocketConnect();

    return () => {
      chatSocketLeave();
    };
  }, []);

  useEffect(() => {
    if (!dmData) return;
    chatSocket.emit('joinChat', {
      room_id: dmData.idx,
    });
  }, [dmData]);

  useEffect(() => {
    if (userIdx === 0) return;
    fetchOtherUserIdx();
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

  useEffect(() => {
    if (!memberData) return;
    fetchDmData();
  }, [memberData]);

  const onClickChannelLeave = (room_id: string | undefined) => {
    chatSocket.emit('leaveDm', room_id);
    chatSocketLeave();
    navigate('/main');
  };

  const handleSettingsClick = () => {
    navigate('/setting');
  };

  const handleChatMemberClick = (clickChatMember: DmMember) => {
    if (memberData && memberData.idx === clickChatMember.idx) {
      setMemberData({
        ...memberData,
        isHighlighted: !memberData.isHighlighted,
      });
    }
  };

  const handleUserDoubleClick = (userIdx: number) => {
    navigate(`/profile/${userIdx}`);
  };

  const closeContextMenu = () => {
    if (contextMenu) {
      setContextMenu(null);
      setFriendsList(
        friendsList.map((item) => ({ ...item, isHighlighted: false })),
      );
      if (memberData) {
        setMemberData({ ...memberData, isHighlighted: false });
      }
    }
  };

  const handleChatMemberRightClick = (
    e: React.MouseEvent<Element, MouseEvent>,
    memberData: DmMember,
  ) => {
    e.preventDefault();
    const isAlreadyHighlighted = memberData?.isHighlighted;
    if (memberData && memberData.idx === memberData.idx) {
      setMemberData({
        ...memberData,
        isHighlighted: !isAlreadyHighlighted,
      });
    }

    if (memberData.idx === userIdx) {
      return;
    }

    if (
      contextMenu &&
      contextMenu.type === 'member' &&
      contextMenu.user.idx === memberData.idx
    ) {
      closeContextMenu();
    } else {
      setContextMenu({
        type: 'member',
        user: memberData,
        position: { x: e.clientX, y: e.clientY },
      });
      setChallengeUserIdx(memberData.idx);
    }
  };

  useEffect(() => {
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

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [contextMenuRef, closeContextMenu]);

  const handleFriendClick = (clickedFriend: Friends) => {
    setFriendsList(
      friendsList.map((friend) =>
        friend.idx === clickedFriend.idx
          ? { ...friend, isHighlighted: !friend.isHighlighted }
          : { ...friend, isHighlighted: false },
      ),
    );
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

  const handleBlockChatMember = (chatMemberIdx: number) => {
    appSocket.emit('block', {
      managedIdx: chatMemberIdx,
    });
    alert('차단했습니다.');
  };
  const handleDeleteFriend = (friendId: number) => {
    setFriendsList(friendsList.filter((friend) => friend.idx !== friendId));
  };

  const handleBlockFriend = (friendId: number) => {
    setFriendsList(friendsList.filter((friend) => friend.idx !== friendId));
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
        <UtilButton
          pageType={'chat'}
          onChatState={() => onClickChannelLeave(idx)}
        />
        <div className="flex flex-col h-5/6">
          <div className="flex flex-col justify-between h-full">
            <div className="border-double border-4 border-sky-500 mx-2 rounded-lg p-4 flex items-center justify-center">
              {userIdx > 0} {dmData?.name}
            </div>
            <div className="bg-sky-200 mx-2 my-2 rounded-lg flex flex-col overflow-auto h-full">
              <MiniChatting pageType={'dm'} />
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
                  {memberData && (
                    <UserItem
                      key={memberData.idx}
                      userNickname={memberData.nickname}
                      userHighlighted={memberData.isHighlighted}
                      onClick={() => handleChatMemberClick(memberData)}
                      onDoubleClick={() =>
                        handleUserDoubleClick(memberData.idx)
                      }
                      onContextMenu={(e) =>
                        handleChatMemberRightClick(e, memberData)
                      }
                    />
                  )}
                </div>
              )}
              {activeTab === 'friends' && (
                <div className="flex-grow">
                  {friendsList.map((friend) => (
                    <FriendItem
                      key={friend.idx}
                      friend={friend}
                      onClick={() => handleFriendClick(friend)}
                      onDoubleClick={() => handleUserDoubleClick(friend.idx)}
                      onContextMenu={(e: React.MouseEvent) =>
                        handleFriendRightClick(e, friend)
                      }
                    />
                  ))}
                </div>
              )}
              <div ref={contextMenuRef}>
                {contextMenu &&
                  (contextMenu.type === 'member'
                    ? memberData && (
                        <UserContextMenu
                          userIdx={contextMenu.user.idx}
                          currentDmUserIdx={memberData.idx}
                          position={contextMenu.position}
                          onBlock={handleBlockChatMember}
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
                      )
                    : memberData && (
                        <FriendContextMenu
                          friendIdx={contextMenu.user.idx}
                          currentDmUserIdx={memberData.idx}
                          position={contextMenu.position}
                          onDelete={() =>
                            handleDeleteFriend(contextMenu.user.idx)
                          }
                          onBlock={() =>
                            handleBlockFriend(contextMenu.user.idx)
                          }
                          closeContextMenu={() => closeContextMenu()}
                          challengModalState={{
                            isOpen: isCreateChallengeOpen,
                            onOpen: onOpenCreateChallenge,
                            onClose: onCloseCreateChallenge,
                          }}
                        />
                      ))}
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
    </div>
  );
}

export default DmPage;
