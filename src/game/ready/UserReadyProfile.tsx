import { Avatar, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { UserDataType } from './GameReadyPage';
import React, { useEffect, useRef } from 'react';

type UserReadyProfileProps = {
  user: UserDataType | undefined;
};

interface ImageComponentProps {
  imageData: number[];
}

const ImageComponent = ({ imageData }: ImageComponentProps) => {
  // imageData는 이미지 데이터로 가정

  // ArrayBuffer를 이용하여 Blob 생성
  const arrayBufferView = new Uint8Array(imageData);
  const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });

  // Blob을 Data URL로 변환
  const imageUrl = URL.createObjectURL(blob);

  return (
    <div>
      <img src={imageUrl} alt="Image" />
    </div>
  );
};

// export default ImageComponent;

function UserReadyProfile(props: UserReadyProfileProps) {
  // const [readyState, setReadyState] = useState(false);
  const user = props.user;

  const id = user ? user.id : 'guest';
  const total = user ? user.record.total_game : 0;
  const win = user ? user.record.total_win : 0;
  const lose = total - win;

  const imageDataArray = user?.avatar.image_data.data;
  console.log(imageDataArray);

  // const onClickButton = () => {
  //   setReadyState(!readyState);
  // };
  return (
    <div className="w-3/12 h-full bg-slate-100 ring-4 rounded-lg flex flex-col justify-between items-center py-8">
      {imageDataArray ? (
        <ImageComponent imageData={imageDataArray} />
      ) : (
        <Avatar size="2xl" name="Segun Adebayo" src={'./cuteyatta.png'} />
      )}
      <h1 className="text-center font-bold text-2xl">{`${id}`}</h1>
      <h3 className="text-center font-bold text-2xl">{`${total}전 ${win}승 ${lose}패`}</h3>
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
