import { Avatar, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { UserDataType } from './GameReadyPage';
import React, { useEffect, useRef } from 'react';
import ImageComponent from '../../common/ImageComponent/ImageComponent';

type UserReadyProfileProps = {
  user: UserDataType | undefined;
};

function UserReadyProfile(props: UserReadyProfileProps) {
  console.log('props.user ' + props.user);
  // const [readyState, setReadyState] = useState(false);
  const user = props.user;
  console.log('abasdfasdfababa = ' + user);

  const id = user ? user.id : 'guest';
  const total = user ? user.record.total_game : 0;
  const win = user ? user.record.total_win : 0;
  const lose = total - win;
  const idx = user ? user.idx : 0;
  const image_data = user?.avatar.image_data;

  console.log(idx);
  let imageDataArray;
  if (image_data && Object.keys(image_data).length === 0) {
    imageDataArray = undefined;
    console.log('dfalsdjfasdfdsf');
  } else {
    imageDataArray = user?.avatar.image_data?.data;
  }
  console.log('imageDataArray ' + imageDataArray);
  console.log('user' + JSON.stringify(user, null, 2));
  // const onClickButton = () => {
  //   setReadyState(!readyState);
  // };
  return (
    <div className="w-3/12 h-full bg-slate-100 ring-4 rounded-lg flex flex-col justify-between items-center py-8">
      {imageDataArray === undefined ? (
        <Avatar
          size="2xl"
          name="Segun Adebayo"
          src={'../../public/cuteyatta.png'}
        />
      ) : (
        <ImageComponent imageData={imageDataArray} />
      )}{' '}
      <h1 className="text-center font-bold text-2xl">{`${id}`}</h1>
      <h3 className="text-center font-bold text-2xl">{`${total}전 ${win}승 ${lose}패`}</h3>
      <h3 className="text-center font-bold text-2xl">{`${user?.ranking.score} 점`}</h3>
      <div className="flex justify-center pb-8"></div>
    </div>
  );
}

export default UserReadyProfile;
