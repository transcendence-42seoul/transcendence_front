import { Avatar, Button } from '@chakra-ui/react';
import { useState } from 'react';

type UserReadyProfileProps = {
  url: string;
};

function UserReadyProfile(props: UserReadyProfileProps) {
  const [readyState, setReadyState] = useState(false);

  const onClickButton = () => {
    setReadyState(!readyState);
  };
  return (
    <div className="w-3/12 h-full bg-slate-100 ring-4 rounded-lg flex flex-col justify-between items-center py-8">
      <Avatar size="2xl" name="Segun Adebayo" src={props.url} />
      <h1 className="text-center font-bold text-2xl">sanghan</h1>
      <h3 className="text-center font-bold text-2xl">0승 15패</h3>
      {/* <h3 className="text-center font-bold text-2xl">#1 1200점</h3> */}
      <div className="flex justify-center pb-8">
        {/* {readyState ? (
          <Button colorScheme="teal" variant="solid" onClick={onClickButton}>
            Ready
          </Button>
        ) : (
          <Button colorScheme="teal" variant="outline" onClick={onClickButton}>
            Ready
          </Button>
        )} */}
      </div>
    </div>
  );
}

export default UserReadyProfile;
