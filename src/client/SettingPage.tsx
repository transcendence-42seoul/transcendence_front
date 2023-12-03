import { useNavigate } from 'react-router-dom';
import authentication from '../assets/authentication.svg';
import block from '../assets/block.svg';
import logout from '../assets/logout.svg';
import withdrawal from '../assets/withdrawal.svg';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { appSocket } from '../common/socket/app.socket';
import Cookies from 'js-cookie';

function LogoutConfirmationModal({ isOpen, onClose, onLogoutConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>로그아웃 확인</ModalHeader>
        <ModalCloseButton />
        <ModalBody>로그아웃 하시겠습니까?</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onLogoutConfirm}>
            로그아웃
          </Button>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function WithdrawalConfirmationModal({ isOpen, onClose, onWithdrawalConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>회원 탈퇴 확인</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          회원 탈퇴 시 모든 기록이 사라지며, 이를 되돌릴 수 없습니다. 정말
          탈퇴하시겠습니까?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onWithdrawalConfirm}>
            탈퇴하기
          </Button>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function SettingPage() {
  const navigate = useNavigate();
  const {
    isOpen: isLogoutModalOpen,
    onOpen: onOpenLogoutModal,
    onClose: onCloseLogoutModal,
  } = useDisclosure();
  const {
    isOpen: isWithdrawalModalOpen,
    onOpen: onOpenWithdrawalModal,
    onClose: onCloseWithdrawalModal,
  } = useDisclosure();

  // 각 설정 항목에 대한 클릭 이벤트 핸들러
  const handleAuthenticationClick = () => {
    navigate('/authentication');
  };

  const handleBlockClick = () => {
    navigate('/ban-list');
  };

  const handleLogoutClick = () => {
    onOpenLogoutModal();
  };

  const handleWithdrawalClick = () => {
    onOpenWithdrawalModal();
  };

  const handleLogoutConfirm = () => {
    appSocket.emit('logout');
    appSocket.disconnect();
    Cookies.remove('token');
    navigate('/login');
    onCloseLogoutModal();
  };

  const handleWithdrawalConfirm = () => {
    appSocket.emit('withdrawal');
    Cookies.remove('token');
    navigate('/login');
    onCloseWithdrawalModal();
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
      {/* 로그아웃 확인 모달 */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={onCloseLogoutModal}
        onLogoutConfirm={handleLogoutConfirm}
      />

      {/* 회원 탈퇴 확인 모달 */}
      <WithdrawalConfirmationModal
        isOpen={isWithdrawalModalOpen}
        onClose={onCloseWithdrawalModal}
        onWithdrawalConfirm={handleWithdrawalConfirm}
      />
    </div>
  );
}

export default SettingPage;
