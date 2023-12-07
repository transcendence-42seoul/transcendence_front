import { useNavigate } from 'react-router';
import { getCookie } from '../common/cookie/cookie';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.jpg';
import axios from 'axios';
import { appSocket } from '../common/socket/app.socket';
import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { UserStatus } from '../game/GamePage';

interface FriendUser {
  idx: number;
  nickname: string;
  status: UserStatus;
  profileImage: string;
  isHighlighted: boolean;
}

interface FriendUserProps {
  friend: FriendUser;
  onClick: (friend: any) => void;
  onDoubleClick: (friend: any) => void;
  handleDeleteFriend: (userId: number) => void;
}
export const FriendUser = (props: FriendUserProps) => {
  const { friend, onClick, onDoubleClick, handleDeleteFriend } = props;

  return (
    <Flex
      key={friend.idx}
      alignItems="center"
      justifyContent="space-between"
      p="4"
      my="2"
      mx="2"
      border="1px"
      borderColor="gray.300"
      rounded="lg"
      boxShadow="sm"
      bg={friend.isHighlighted ? 'blue.100' : 'white'}
      onClick={() => onClick(friend)}
      onDoubleClick={() => onDoubleClick(friend)}
    >
      <Flex alignItems="center" flex="1">
        <Image
          borderRadius="full"
          border="2px solid"
          borderColor="black"
          boxSize="50px"
          src={logo}
          alt="avatar"
          mr="3"
        />
        <Text fontSize="xl" fontWeight="medium" flex="1" isTruncated>
          {friend.nickname}
        </Text>
        <Text fontSize="xl" fontWeight="medium" flex="1" isTruncated>
          {friend.status}
        </Text>
      </Flex>
      <Button
        colorScheme="red"
        fontSize="xl"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteFriend(friend.idx);
        }}
      >
        친구 삭제
      </Button>
    </Flex>
  );
};

function FriendListPage() {
  const navigate = useNavigate();

  const token = getCookie('token');

  const [userIdx, setUserIdx] = useState(0);

  const [friendUsers, setFriendUsers] = useState<FriendUser[]>([]);

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
    const fetchFriendUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/friends/${userIdx}`,
        );
        setFriendUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userIdx > 0) {
      fetchFriendUsers();
    }

    appSocket.on('receiveFriendUsers', handleReceiveFriendUsers);

    return () => {
      appSocket.off('receiveFriendUsers', handleReceiveFriendUsers);
    };
  }, [userIdx]);

  const handleDeleteFriend = (friendIdx: number) => {
    appSocket.emit('deleteFriend', { friendIdx });
  };

  const handleFriendUserClick = (friendUser: FriendUser) => {
    setFriendUsers((prevFriendUsers) =>
      prevFriendUsers.map((friend) =>
        friend.nickname == friendUser.nickname
          ? { ...friend, isHighlighted: !friend.isHighlighted }
          : { ...friend, isHighlighted: false },
      ),
    );
  };

  const handleUserDoubleClick = (friendUser: FriendUser) => {
    navigate(`/profile/${friendUser.idx}`);
  };

  const handleReceiveFriendUsers = (friendUsers: FriendUser[]) => {
    console.log('handleReceiveFriend', friendUsers);
    setFriendUsers(friendUsers);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="border-double border-4 border-sky-500 mx-2 rounded-lg p-4 flex items-center justify-center mt-3">
        <h1 className="text-2xl font-semibold">친구 목록</h1>
      </div>
      <div className="bg-blue-200 m-2 rounded-lg flex flex-col overflow-auto h-full">
        {friendUsers.length > 0 ? (
          friendUsers.map((user) => (
            <FriendUser
              key={user.idx}
              friend={user}
              onClick={handleFriendUserClick}
              onDoubleClick={handleUserDoubleClick}
              handleDeleteFriend={handleDeleteFriend}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <span className="text-5xl font-semibold italic font-serif text-slate-500">
              NOT FOUND
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendListPage;
