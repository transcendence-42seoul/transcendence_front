import { IChatMember } from '../chat';
import { CreateChallengeModal } from '../modal/CreateChallengeModal/CreateChallengeModal';

interface UserItemProps {
  // online member type 추가
  user: IChatMember;
  onClick: () => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const UserItem = (props: UserItemProps) => {
  // 온라인유저 + 채팅유저
  const { user, onClick, onDoubleClick, onContextMenu } = props;
  console.log('user', user);
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
      {/* <span>{user.user.nickname}</span> */}
    </div>
  );
};

interface UserContextMenuProps {
  userIdx: number;
  position: { x: number; y: number };
  onBlock: (id: number) => void;
  closeContextMenu: () => void;
}

export const UserContextMenu = (props: UserContextMenuProps) => {
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
        {/* <li className="p-2 hover:bg-gray-100 cursor-pointer">챌린지</li> */}
        <CreateChallengeModal requestedIdx={userIdx} />
        <li className="p-2 hover:bg-gray-100 cursor-pointer">DM보내기</li>
      </ul>
    </div>
  );
};
