import { useEffect, useRef, useState } from 'react';
import setting from '../assets/setting.svg';
import password from '../assets/password.svg';
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
import { AdminContextMenu } from './components/AdminItem';
import UpdateChatStateModal from './components/UpdateChatState';
import { useDisclosure } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { appSocket } from '../common/socket/app.socket';
import { CreateChallengeModal } from './modal/CreateChallengeModal/CreateChallengeModal';
import { OwnerContextMenu } from './components/OwnerItem';
// import { handleShowError, navigateSocket } from './components/ErrorHandler';

interface ChatData {
  name: string;
  type: 'PUBLIC' | 'PRIVATE';
  password: string;
}

export interface IChatMember {
  idx: number;
  role: string;
  user: {
    idx: number;
    nickname: string;
  };
  isHighlighted: boolean;
}

interface IContextMenu {
  type: 'friend' | 'chatMember';
  user: Friends | IChatMember;
  position: { x: number; y: number };
}

function ChatPage() {
  const { idx } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const {
    isOpen: isUpdateChatStateOpen,
    onOpen: onOpenUpdateChatState,
    onClose: onCloseUpdateChatState,
  } = useDisclosure();

  const token = getCookie('token');

  const [userIdx, setUserIdx] = useState<number>(0);

  const [chatData, setChatData] = useState<ChatData>();

  const [activeTab, setActiveTab] = useState('chat');

  const [friendsList, setFriendsList] = useState<Friends[]>([]);

  const [chatMemberList, setChatMemberList] = useState<IChatMember[]>([]);

  const [challengeUserIdx, setChallengeUserIdx] = useState<number>(0);

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

  const fetchChatData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/chats/data/${idx}`,
      );
      setChatData(makeChatData(response.data));
    } catch (error: any) {
      if (error && error.response.status === 404) {
        navigate('/main');
        alert('존재하지 않는 채팅방입니다.');
      }
    }
  };

  const makeChatData = (data: any) => {
    return {
      name: data.name,
      type: data.type,
      password: data.password,
    };
  };

  const CurrentUserRole = () => {
    const currentUserParticipant = chatMemberList.find(
      (participant) => participant.user.idx === userIdx,
    );

    return currentUserParticipant ? currentUserParticipant.role : 'Guest';
  };

  useEffect(() => {
    fetchUserIdx();
    fetchChatData();
  }, []);

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

  const handleFriendClick = (clickedFriend: Friends) => {
    setFriendsList(
      friendsList.map((friend) =>
        friend.idx === clickedFriend.idx
          ? { ...friend, isHighlighted: !friend.isHighlighted }
          : { ...friend, isHighlighted: false },
      ),
    );
  };

  const handleChatMemberClick = (clickChatMember: IChatMember) => {
    setChatMemberList(
      chatMemberList.map((chatMember) =>
        chatMember.idx === clickChatMember.idx
          ? { ...chatMember, isHighlighted: !chatMember.isHighlighted }
          : { ...chatMember, isHighlighted: false },
      ),
    );
  };

  const handleChatMemberRightClick = (
    e: React.MouseEvent<Element, MouseEvent>,
    chatMember: IChatMember,
  ) => {
    e.preventDefault();
    const isAlreadyHighlighted = chatMember.isHighlighted;
    setChatMemberList(
      chatMemberList.map((item) =>
        item.idx === chatMember.idx
          ? { ...item, isHighlighted: !isAlreadyHighlighted }
          : { ...item, isHighlighted: false },
      ),
    );

    if (chatMember.user.idx === userIdx) {
      return;
    }

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
      setChallengeUserIdx(chatMember.user.idx);
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

  const handleUserDoubleClick = (userIdx: number) => {
    navigate(`/profile/${userIdx}`);
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
  }, [navigate, contextMenuRef, closeContextMenu]);

  const handleReceiveChatParticipants = (participant: IChatMember[]) => {
    setChatMemberList(participant);
  };

  const handleShowError = (data: any) => {
    alert(data.message);
    navigate('/main');
  };

  const handleShowMuteError = (data: any) => {
    alert(data.message);
  };

  const handleKicked = (data: any) => {
    alert(`you are kicked from ${data}`);
    if (location.pathname === `/chat/${data}`) {
      navigate('/main');
    }
  };

  const handleBanned = (data: any) => {
    alert(`you are banned from ${data}`);
    if (location.pathname === `/chat/${data}`) {
      navigate('/main');
    }
  };

  const handleIsBanUser = (msg: string) => {
    alert(msg);
    navigate('/main');
  };

  const handleOwnerLeave = (data: any) => {
    alert(`owner is out from ${data}`);
    if (location.pathname === `/chat/${data}`) {
      navigate('/main');
    }
  };

  useEffect(() => {
    const fetchChatMembers = async () => {
      try {
        // 데이터베이스에서 채팅 참여자 데이터를 가져오는 URL
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/chats/participants/${idx}`,
        );
        const chatMembers = response.data.map((member: IChatMember) => {
          return {
            ...member,
            isHighlighted: false,
          };
        });
        setChatMemberList(chatMembers);
      } catch (error) {
        console.error('채팅 참여자 데이터를 가져오는데 실패했습니다:', error);
      }
    };

    fetchChatMembers();
  }, [idx]);

  useEffect(() => {
    const getBanStatus = async () => {
      const status = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/chats/ban/${idx}/${userIdx}`,
      );
      if (status.data) {
        handleIsBanUser('차단된 유저입니다.');
      }
    };

    const checkParticipant = async () => {
      const status = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/chats/participant/${idx}/${userIdx}`,
      );
      if (!status.data) {
        handleIsBanUser('참여자가 아닙니다.');
      }
    };
    if (userIdx > 0) {
      getBanStatus();
      checkParticipant();
    }
  }, [userIdx]);

  useEffect(() => {
    // chatSocket.on('leaveChat', onClickChannelLeave);
    chatSocket.on('receiveChatParticipants', handleReceiveChatParticipants);
    chatSocket.on('showError', handleShowError);
    // chatSocket.on('navigateMain', navigateSocket);
    chatSocket.on('showMuteError', handleShowMuteError);
    chatSocket.on('ownerLeaveChat', handleOwnerLeave);

    return () => {
      // chatSocket.off('leaveChat', onClickChannelLeave);
      chatSocket.off(
        'receiveCxehatParticipants',
        handleReceiveChatParticipants,
      );
      chatSocket.off('showError', handleShowError);
      // chatSocket.off('navigateMain', navigateSocket);
      chatSocket.off('showMuteError', handleShowMuteError);
      chatSocket.off('ownerLeaveChat', handleOwnerLeave);
    };
  }, [chatSocket]);

  useEffect(() => {
    appSocket.on('kicked', handleKicked);
    appSocket.on('banned', handleBanned);

    return () => {
      appSocket.off('kicked', handleKicked);
      appSocket.off('banned', handleBanned);
    };
  }, [appSocket]);

  const onClickChannelLeave = (room_id: string | undefined) => {
    chatSocket.emit('leaveChat', room_id, (response: any) => {
      if (response.status) {
        chatSocketLeave();
        navigate('/main');
      } else alert(response.message);
    });
  };

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

  const handleBlockChatMember = (chatMemberIdx: number) => {
    appSocket.emit('block', {
      managedIdx: chatMemberIdx,
    });
    alert('차단했습니다.');
  };

  const handleFriendRequest = (receiverIdx: number) => {
    appSocket.emit('friendRequest', receiverIdx);
  };

  const handleSettingsClick = () => {
    navigate('/setting');
  };

  const handleKickChatMember = (kickedIdx: number) => {
    chatSocket.emit('kick', {
      chatIdx: idx,
      managedIdx: kickedIdx,
    });
  };

  const handleMuteChatMember = (mutedIdx: number) => {
    chatSocket.emit('mute', {
      chatIdx: idx,
      managedIdx: mutedIdx,
    });
  };

  const handleBanChatMember = (bannedIdx: number) => {
    chatSocket.emit('ban', {
      chatIdx: idx,
      managedIdx: bannedIdx,
    });
  };

  const handleGrantChatMember = (grantedIdx: number) => {
    chatSocket.emit('grant', {
      chatIdx: idx,
      managedIdx: grantedIdx,
    });
  };

  const handleRevokeChatMember = (revokedIdx: number) => {
    chatSocket.emit('revoke', {
      chatIdx: idx,
      managedIdx: revokedIdx,
    });
  };

  const {
    isOpen: isCreateChallengeOpen,
    onOpen: onOpenCreateChallenge,
    onClose: onCloseCreateChallenge,
  } = useDisclosure();

  return (
    <div className=" h-screen w-screen flex flex-row items-center justify-start align-middle">
      <div className="flex flex-col basis-3/5 h-screen">
        {chatData && (
          <UtilButton
            pageType={'chat'}
            onChatState={() => onClickChannelLeave(idx)}
          />
        )}
        <div className="flex flex-col h-5/6">
          <div className="flex flex-col justify-between h-full">
            <div className="border-double border-4 border-sky-500 mx-2 rounded-lg p-4 flex items-center justify-center">
              {userIdx > 0} {chatData?.name}
              {/* Check if the current user role is admin */}
              {CurrentUserRole() === 'OWNER' ? (
                <div
                  className="w-12 h-12 rounded-full"
                  onClick={onOpenUpdateChatState}
                >
                  <img
                    className="flex-item-logo"
                    src={password}
                    alt="password"
                    style={{ width: '100px', height: 'auto' }}
                  />
                </div>
              ) : null}
              <UpdateChatStateModal
                isOpen={isUpdateChatStateOpen}
                onOpen={onOpenUpdateChatState}
                onClose={onCloseUpdateChatState}
                chatIdx={idx}
                type={chatData?.type}
              />
            </div>
            <div className="bg-sky-200 mx-2 my-2 rounded-lg flex flex-col overflow-auto h-full">
              <MiniChatting pageType={'chat'} />
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
                  {chatMemberList.map((chatMember: IChatMember) => {
                    return (
                      <UserItem
                        key={chatMember.idx}
                        userNickname={chatMember.user.nickname}
                        userHighlighted={chatMember.isHighlighted}
                        onClick={() => handleChatMemberClick(chatMember)}
                        onDoubleClick={() =>
                          handleUserDoubleClick(chatMember.user.idx)
                        }
                        onContextMenu={(e) =>
                          handleChatMemberRightClick(e, chatMember)
                        }
                      />
                    );
                  })}
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
                  (contextMenu.type === 'chatMember' ? (
                    (() => {
                      const chatMember = contextMenu.user as IChatMember;
                      return CurrentUserRole() === 'OWNER' ? (
                        <OwnerContextMenu
                          userIdx={chatMember.user.idx}
                          position={contextMenu.position}
                          role={chatMember.role}
                          onBlock={() =>
                            handleBlockChatMember(chatMember.user.idx)
                          }
                          onFriendRequest={() =>
                            handleFriendRequest(chatMember.user.idx)
                          }
                          onKick={() => {
                            handleKickChatMember(chatMember.user.idx);
                          }}
                          onMute={() => {
                            handleMuteChatMember(chatMember.user.idx);
                          }}
                          onBan={() => {
                            handleBanChatMember(chatMember.user.idx);
                          }}
                          onGrant={() => {
                            handleGrantChatMember(chatMember.user.idx);
                          }}
                          onRevoke={() => {
                            handleRevokeChatMember(chatMember.user.idx);
                          }}
                          closeContextMenu={() => closeContextMenu()}
                          challengModalState={{
                            isOpen: isCreateChallengeOpen,
                            onOpen: onOpenCreateChallenge,
                            onClose: onCloseCreateChallenge,
                          }}
                        />
                      ) : CurrentUserRole() === 'ADMIN' ? (
                        <AdminContextMenu
                          userIdx={chatMember.user.idx}
                          position={contextMenu.position}
                          role={chatMember.role}
                          onBlock={() =>
                            handleBlockChatMember(chatMember.user.idx)
                          }
                          onFriendRequest={() =>
                            handleFriendRequest(chatMember.user.idx)
                          }
                          onKick={() => {
                            handleKickChatMember(chatMember.user.idx);
                          }}
                          onMute={() => {
                            handleMuteChatMember(chatMember.user.idx);
                          }}
                          onBan={() => {
                            handleBanChatMember(chatMember.user.idx);
                          }}
                          closeContextMenu={() => closeContextMenu()}
                          challengModalState={{
                            isOpen: isCreateChallengeOpen,
                            onOpen: onOpenCreateChallenge,
                            onClose: onCloseCreateChallenge,
                          }}
                        />
                      ) : (
                        <UserContextMenu
                          userIdx={chatMember.user.idx}
                          position={contextMenu.position}
                          onBlock={() =>
                            handleBlockChatMember(chatMember.user.idx)
                          }
                          onFriendRequest={() =>
                            handleFriendRequest(chatMember.user.idx)
                          }
                          closeContextMenu={() => closeContextMenu()}
                          challengModalState={{
                            isOpen: isCreateChallengeOpen,
                            onOpen: onOpenCreateChallenge,
                            onClose: onCloseCreateChallenge,
                          }}
                        />
                      );
                    })()
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
                {/* {contextMenu && ( */}
                <CreateChallengeModal
                  requestedIdx={challengeUserIdx}
                  modalState={{
                    isOpen: isCreateChallengeOpen,
                    onOpen: onOpenCreateChallenge,
                    onClose: onCloseCreateChallenge,
                  }}
                />
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
