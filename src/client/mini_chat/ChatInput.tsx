import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useState } from 'react';

type ChatInputProps = {
  handleSubmit: Function;
};

function ChatInput(props: ChatInputProps) {
  const [chat, setChat] = useState('');

  const hadleInputData = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChat(event.target.value);
  };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   props.handleSubmit(props.room_id, chat);
  //   setChat('');
  // };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log('chatinput handleSubmit');
    event.preventDefault();
    props.handleSubmit(chat);
    setChat('');

    // console.log('room_id', idx);
    // console.log('chat', chat);

    // chatSocket.emit('sendMessage', { room_id: idx, message: chat });
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Enter Chat"
          value={chat}
          onChange={hadleInputData}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" type="submit">
            {'➤'}
          </Button>
        </InputRightElement>
      </InputGroup>
    </form>
  );
}

export default ChatInput;
