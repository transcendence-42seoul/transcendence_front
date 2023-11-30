import { useRecoilValue } from 'recoil';
import { ChallengModalAtom } from '../../recoil/challengemodalAtom';

interface UserItemProps {
  userNickname: string;
  userHighlighted: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const UserItem = (props: UserItemProps) => {
  // 온라인유저 + 채팅유저
  const {
    userNickname,
    userHighlighted,
    onClick,
    onDoubleClick,
    onContextMenu,
  } = props;
  return (
    <div
      className={`flex justify-between items-center p-4 my-2 mx-2
			  border border-gray-300 rounded-lg shadow-sm cursor-pointer ${
          userHighlighted ? 'bg-blue-100' : 'bg-white'
        } cursor-pointer`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <span>{userNickname}</span>
    </div>
  );
};

export interface UserContextMenuProps {
  userIdx: number;
  position: { x: number; y: number };
  onBlock: (id: number) => void;
  closeContextMenu: () => void;
}

export const UserContextMenu = (props: UserContextMenuProps) => {
  const { userIdx, position, onBlock, closeContextMenu } = props;

  const modalState = useRecoilValue(ChallengModalAtom);
  console.log('modalState', modalState);
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
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            modalState.onOpen();
          }}
        >
          챌린지
        </li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">DM보내기</li>
      </ul>
    </div>
  );
};
