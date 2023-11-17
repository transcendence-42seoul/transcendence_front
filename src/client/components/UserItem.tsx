export const UserItem = ({ user, onClick, onContextMenu }) => {
  return (
    <div
      className={`flex justify-between items-center p-4 my-2 mx-2
			  border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
          user.isHighlighted ? 'bg-blue-100' : 'bg-white'
        } cursor-pointer`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <span>{user.name}</span>
    </div>
  );
};

export const UserContextMenu = ({
  user,
  position,
  onBlock,
  closeContextMenu,
}) => {
  return (
    <div
      className="absolute z-50 w-40 bg-white shadow-lg rounded-md"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 메뉴 내용 */}
      <ul className="divide-y divide-gray-100">
        <li className="p-2 hover:bg-gray-100 cursor-pointer">친구신청</li>
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            onBlock(user.id);
          }}
        >
          차단
        </li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">노말 챌린지</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">하드 챌린지</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">DM보내기</li>
      </ul>
    </div>
  );
};
