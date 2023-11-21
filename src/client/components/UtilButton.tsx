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
import { useState } from 'react';
import { useNavigate } from 'react-router';

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

function UtilButton({ pageType }) {
  const navigate = useNavigate();

  const [normalMode, setNormalMode] = useState(false);
  const [ladderMode, setLadderMode] = useState(false);

  const {
    isOpen: isCreateChannelOpen,
    onOpen: onOpenCreateChannel,
    onClose: onCloseCreateChannel,
  } = useDisclosure();

  const normalModeButton = () => {
    setNormalMode(!normalMode);
  };

  const ladderModeButton = () => {
    setLadderMode(!ladderMode);
  };

  const onClickChannelList = () => {
    navigate('/main');
  };

  const utilButtonData = [
    { label: '노말 경쟁전', onClick: normalModeButton },
    { label: '하드 경쟁전', onClick: ladderModeButton },
    ...(pageType === 'main'
      ? [{ label: '채널 생성', onClick: onOpenCreateChannel }]
      : []),
    ...(pageType === 'chat'
      ? [{ label: '채널 목록', onClick: onClickChannelList }]
      : []),
  ];

  const UtilButton = ({ label, onClick }) => {
    return (
      <Button
        colorScheme="teal"
        variant="outline"
        width={'full'}
        mx={2}
        onClick={onClick}
      >
        {label}
      </Button>
    );
  };

  return (
    <div className="h-1/6 flex flex-row items-center align-middle justify-between">
      {utilButtonData.map((button, index) => (
        <UtilButton key={index} label={button.label} onClick={button.onClick} />
      ))}
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={onCloseCreateChannel}
      />
    </div>
  );
}

export default UtilButton;
