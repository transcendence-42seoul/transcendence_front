export const FriendItem = ({
  friend,
  onClick,
  onDoubleClick,
  onContextMenu,
}) => {
  return (
    <div
      className={`flex justify-between items-center p-4 my-2 mx-2
			border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
        friend.isHighlighted ? 'bg-blue-100' : 'bg-white'
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={(e) => onContextMenu(e, friend)}
    >
      <span>{friend.nickname}</span>
    </div>
  );
};

export const FriendContextMenu = ({
  friend,
  position,
  onDelete,
  onBlock,
  closeContextMenu,
}) => {
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
            onDelete(friend.idx);
          }}
        >
          친구 삭제
        </li>
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            onBlock(friend.idx);
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