import { Friends } from './FetchFriendList';

interface FriendItemProps {
  friend: Friends;
  onClick: (friend: Friends) => void;
  onDoubleClick: (friend: Friends) => void;
  onContextMenu: (e: React.MouseEvent, friend: Friends) => void;
}

export const FriendItem = (props: FriendItemProps) => {
  const { friend, onClick, onDoubleClick, onContextMenu } = props;
  return (
    <div
      className={`flex justify-between items-center p-4 my-2 mx-2
			border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
        friend.isHighlighted ? 'bg-blue-100' : 'bg-white'
      }`}
      onClick={() => onClick(friend)}
      onDoubleClick={() => onDoubleClick(friend)}
      onContextMenu={(e) => onContextMenu(e, friend)}
    >
      <span>{friend.nickname}</span>
    </div>
  );
};

interface FriendContextMenuProps {
  friendIdx: number;
  position: { x: number; y: number };
  onDelete: (idx: number) => void;
  onBlock: (idx: number) => void;
  closeContextMenu: () => void;
}

export const FriendContextMenu = (props: FriendContextMenuProps) => {
  const { friendIdx, position, onDelete, onBlock, closeContextMenu } = props;
  return (
    <div
      className="absolute z-50 w-40 bg-white shadow-lg rounded-md"
      style={{ top: position.y, left: position.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul className="divide-y divide-gray-100">
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            onDelete(friendIdx);
          }}
        >
          친구 삭제
        </li>
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            onBlock(friendIdx);
          }}
        >
          차단
        </li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">챌린지</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">DM 보내기</li>
      </ul>
    </div>
  );
};
