import { UserItemProps } from './UserItem';
import { UserContextMenuProps } from './UserItem';

export const ChatParticipantItem = (props: UserItemProps) => {
  const { user, onClick, onDoubleClick, onContextMenu } = props;
  return (
    <div
      className={`flex justify-between items-center p-4 my-2 mx-2
				border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
          user.isHighlighted ? 'bg-blue-100' : 'bg-white'
        } cursor-pointer`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      {/* 수정 해야함 */}
      <span>{user.user.nickname}</span>
      {/*  */}
    </div>
  );
};

export const ChatParticipantContextMenu = (props: UserContextMenuProps) => {
  const { userIdx, position, onBlock, closeContextMenu } = props;
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
            onBlock(userIdx);
          }}
        >
          차단
        </li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">챌린지</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">DM보내기</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">강퇴하기</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">밴하기</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">채팅금지</li>
      </ul>
    </div>
  );
};
