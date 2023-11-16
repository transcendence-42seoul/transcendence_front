import { useNavigate } from 'react-router-dom';
import authentication from '../assets/authentication.svg';
import block from '../assets/block.svg';
import logout from '../assets/logout.svg';
import withdrawal from '../assets/withdrawal.svg';

function SettingPage() {
  const navigate = useNavigate();

  // 각 설정 항목에 대한 클릭 이벤트 핸들러
  const handleAuthenticationClick = () => {
    navigate('/authentication');
  };

  const handleBlockClick = () => {};

  const handleLogoutClick = () => {
    navigate('/login');
  };

  const handleWithdrawalClick = () => {
    navigate('/login');
  };

  return (
    <div className="bg-basic-color w-screen h-screen flex flex-col justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* 2차인증 */}
        <div
          className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
          onClick={handleAuthenticationClick}
        >
          <img
            src={authentication}
            alt="2차 인증"
            className="flex-item-logo"
            style={{ width: '100px', height: 'auto' }}
          />
          <span className="flex-grow">2차 인증</span>
        </div>
        {/* 차단목록 */}
        <div
          className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
          onClick={handleBlockClick}
        >
          <img
            src={block}
            alt="차단목록"
            className="flex-item-logo"
            style={{ width: '100px', height: 'auto' }}
          />
          <span className="flex-grow">차단목록</span>
        </div>
        {/* 로그아웃 */}
        <div
          className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
          onClick={handleLogoutClick}
        >
          <img
            src={logout}
            alt="로그아웃"
            className="flex-item-logo"
            style={{ width: '100px', height: 'auto' }}
          />
          <span className="flex-grow">로그아웃</span>
        </div>
        {/* 회원탈퇴 */}
        <div
          className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
          onClick={handleWithdrawalClick}
        >
          <img
            src={withdrawal}
            alt="회원탈퇴"
            className="flex-item-logo"
            style={{ width: '100px', height: 'auto' }}
          />
          <span className="flex-grow">회원탈퇴</span>
        </div>
      </div>
    </div>
  );
}

export default SettingPage;
