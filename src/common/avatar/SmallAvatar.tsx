type AvatarProps = {
  url: string;
  status?: TUserStatus;
};

export type TUserStatus = 'ONLINE' | 'OFFLINE' | 'PLAYING';

/**
 * 이미지를 url과 size를 넣어서 동그란 아바타를 생성할 수 있다.
 * @param {string} props.url - 이미지 url
 * @param {string} props.status - 유저의 현재 상태 : "online" | "offline" | "gaming"
 */
function SmallAvatar(props: AvatarProps) {
  let statusColor;
  if (props.status === 'ONLINE') {
    statusColor = 'bg-green-400';
  } else if (props.status === 'OFFLINE') {
    statusColor = 'bg-slate-500';
  } else if (props.status === 'PLAYING') {
    statusColor = 'bg-orange-400';
  }

  const statusSpan = props.status ? (
    <span
      className={`bottom-0 left-7 absolute w-3.5 h-3.5 ${statusColor} border-2 border-white dark:border-gray-800 rounded-full`}
    ></span>
  ) : null;

  return (
    <div className="relative">
      <img className="w-12 h-12 rounded-full" src={props.url} alt="profile" />
      {statusSpan}
    </div>
  );
}

export default SmallAvatar;
