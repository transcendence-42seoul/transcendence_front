import { UserContextMenuProps } from './UserItem';
import { DmNavigation } from './DmNavigation';

interface OwnerContextMenuProps extends UserContextMenuProps {
  // userIdx: number;
  // position: { x: number; y: number };
  // onBlock: (id: number) => void;
  // closeContextMenu: () => void;
  role: string;
  onKick: (id: number) => void;
  onMute: (id: number) => void;
  onBan: (id: number) => void;
  onGrant: (id: number) => void;
  onRevoke: (id: number) => void;
}

export const OwnerContextMenu = (props: OwnerContextMenuProps) => {
  const {
    userIdx,
    currentDmUserIdx,
    position,
    role,
    onBlock,
    onFriendRequest,
    onKick,
    onMute,
    onBan,
    onGrant,
    onRevoke,
    closeContextMenu,
    challengModalState,
  } = props;

  const getDm = DmNavigation();

  const showDmOption =
    typeof currentDmUserIdx === 'undefined' || currentDmUserIdx !== userIdx;

  return (
    <div
      className="absolute z-50 w-40 bg-white shadow-lg rounded-md"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 메뉴 내용 */}
      <ul className="divide-y divide-gray-100">
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            onFriendRequest(userIdx);
          }}
        >
          친구신청
        </li>
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
            challengModalState.onOpen();
          }}
        >
          챌린지
        </li>
        {showDmOption && (
          <li
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => getDm(userIdx)}
          >
            DM보내기
          </li>
        )}
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            onKick(userIdx);
          }}
        >
          강퇴하기
        </li>
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            onBan(userIdx);
          }}
        >
          밴하기
        </li>
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            onMute(userIdx);
          }}
        >
          채팅금지
        </li>
        <li
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            closeContextMenu();
            if (role === 'ADMIN') onRevoke(userIdx);
            else onGrant(userIdx);
          }}
        >
          {role === 'ADMIN' ? '권한회수' : '권한부여'}
        </li>
      </ul>
    </div>
  );
};
