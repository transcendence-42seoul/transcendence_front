import { DmNavigation } from './DmNavigation';
import { UserContextMenuProps } from './UserItem';

export const ChatParticipantContextMenu = (props: UserContextMenuProps) => {
  const { userIdx, currentDmUserIdx, position, onBlock, closeContextMenu } =
    props;

  const navigateToDm = DmNavigation();

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
        {showDmOption && (
          <li
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => navigateToDm(userIdx)}
          >
            DM보내기
          </li>
        )}
        <li className="p-2 hover:bg-gray-100 cursor-pointer">강퇴하기</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">밴하기</li>
        <li className="p-2 hover:bg-gray-100 cursor-pointer">채팅금지</li>
      </ul>
    </div>
  );
};
