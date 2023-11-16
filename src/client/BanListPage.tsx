import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Image,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';

function BannedUser({ ban, onClick, onDoubleClick, handleUnban }) {
  const total_lose = ban.total_game - ban.total_win;

  return (
    <Flex
      key={ban.id}
      alignItems="center"
      justifyContent="space-between"
      p="4"
      my="2"
      mx="2"
      border="1px"
      borderColor="gray.300"
      rounded="lg"
      boxShadow="sm"
      bg={ban.isHighlighted ? 'blue.100' : 'white'}
      onClick={() => onClick(ban)}
      onDoubleClick={() => onDoubleClick(ban)}
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
        <Text fontSize="xl" fontWeight="medium" isTruncated>
          {ban.name}
        </Text>
      </Flex>
      <Text fontSize="xl" fontWeight="medium" flex="1">
        {`${ban.total_game}전 ${ban.total_win}승 ${total_lose}패`}
      </Text>
      <Button
        colorScheme="red"
        fontSize="xl"
        onClick={(e) => {
          e.stopPropagation();
          handleUnban(ban.id);
        }}
      >
        차단 해제
      </Button>
    </Flex>
  );
}

function BanListPage() {
  const navigate = useNavigate();

  const initialBannedUsers = [
    {
      id: 1,
      name: 'user123',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 10,
      isHighlighted: false,
    },
    {
      id: 2,
      name: 'exampleUser',
      avatar: '../assets/logo.jpg',
      total_game: 8,
      total_win: 3,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
    {
      id: 3,
      name: 'testAccount',
      avatar: '../assets/logo.jpg',
      total_game: 12,
      total_win: 7,
      isHighlighted: false,
    },
  ];

  const [bannedUsers, setBannedUsers] = useState(initialBannedUsers);

  const handleUnban = (userId) => {
    setBannedUsers(bannedUsers.filter((user) => user.id !== userId));
  };

  const handleBanUserClick = (bannedUser) => {
    setBannedUsers((prevBannedUsers) =>
      prevBannedUsers.map((ban) =>
        ban.name == bannedUser.name
          ? { ...ban, isHighlighted: !ban.isHighlighted }
          : { ...ban, isHighlighted: false },
      ),
    );
  };

  const handleUserDoubleClick = (bannedUser) => {
    navigate(`/profile/${bannedUser.id}`);
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="border-double border-4 border-sky-500 mx-2 rounded-lg p-4 flex items-center justify-center mt-3">
        <h1 className="text-2xl font-semibold">채팅 목록</h1>
      </div>
      <div className="bg-blue-200 m-2 rounded-lg flex flex-col overflow-auto h-full">
        {bannedUsers.length > 0 ? (
          bannedUsers.map((user) => (
            <BannedUser
              key={user.id}
              ban={user}
              onClick={handleBanUserClick}
              onDoubleClick={handleUserDoubleClick} // Pass the new function as a prop
              handleUnban={handleUnban}
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

export default BanListPage;
