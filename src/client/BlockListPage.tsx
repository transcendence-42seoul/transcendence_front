import { useEffect, useState } from 'react';
import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import axios from 'axios';
import { getCookie } from '../common/cookie/cookie';
import { appSocket } from '../common/socket/app.socket';

interface BlockedUser {
  idx: number;
  nickname: string;
  avatar: string;
  total_game: number;
  total_win: number;
  isHighlighted: boolean;
}

interface BlockedUserProps {
  block: BlockedUser;
  onClick: (blockedUser: any) => void;
  onDoubleClick: (blockedUser: any) => void;
  handleUnblock: (userId: number) => void;
}

export const BlockedUser = (props: BlockedUserProps) => {
  const { block, onClick, onDoubleClick, handleUnblock } = props;
  return (
    <Flex
      key={block.idx}
      alignItems="center"
      justifyContent="space-between"
      p="4"
      my="2"
      mx="2"
      border="1px"
      borderColor="gray.300"
      rounded="lg"
      boxShadow="sm"
      bg={block.isHighlighted ? 'blue.100' : 'white'}
      onClick={() => onClick(block)}
      onDoubleClick={() => onDoubleClick(block)}
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
          {block.nickname}
        </Text>
      </Flex>
      <Button
        colorScheme="red"
        fontSize="xl"
        onClick={(e) => {
          e.stopPropagation();
          handleUnblock(block.idx);
        }}
      >
        차단 해제
      </Button>
    </Flex>
  );
};

function BlockListPage() {
  const navigate = useNavigate();

  const token = getCookie('token');

  const [userIdx, setUserIdx] = useState<number>(0);

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

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
    const fetchBlockedUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blocks/${userIdx}`,
        );
        setBlockedUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (userIdx > 0) {
      fetchBlockedUsers();
    }

    appSocket.on('receiveblockedUsers', handleReceiveBlockedUsers);

    return () => {
      appSocket.off('receiveblockedUsers', handleReceiveBlockedUsers);
    };
  }, [userIdx]);

  const handleUnblock = (blockedIdx: number) => {
    appSocket.emit('unblock', { blockedIdx });
    // setBlockedUsers(blockedUsers.filter((user) => user.idx !== userIdx));
  };

  const handleBlockUserClick = (blockedUser: BlockedUser) => {
    setBlockedUsers((prevBlockedUsers) =>
      prevBlockedUsers.map((block) =>
        block.nickname == blockedUser.nickname
          ? { ...block, isHighlighted: !block.isHighlighted }
          : { ...block, isHighlighted: false },
      ),
    );
  };

  const handleUserDoubleClick = (blockedUser: BlockedUser) => {
    navigate(`/profile/${blockedUser.idx}`);
  };

  const handleReceiveBlockedUsers = (blockedUsers: BlockedUser[]) => {
    setBlockedUsers(blockedUsers);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="border-double border-4 border-sky-500 mx-2 rounded-lg p-4 flex items-center justify-center mt-3">
        <h1 className="text-2xl font-semibold">차단 목록</h1>
      </div>
      <div className="bg-blue-200 m-2 rounded-lg flex flex-col overflow-auto h-full">
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <BlockedUser
              key={user.idx}
              block={user}
              onClick={handleBlockUserClick}
              onDoubleClick={handleUserDoubleClick} // Pass the new function as a prop
              handleUnblock={handleUnblock}
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

export default BlockListPage;
