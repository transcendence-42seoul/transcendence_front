import { useNavigate } from 'react-router-dom';
import authentication from '../assets/authentication.svg';
import block from '../assets/block.svg';
import friend from '../assets/friend.svg';
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
import { getCookie } from '../common/cookie/cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface TfaEnableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTfaEnableConfirm: () => void;
}

interface TfaDisavleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTfaDisableConfirm: () => void;
}

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutConfirm: () => void;
}

interface WithdrawalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawalConfirm: () => void;
}

function TfaEnableModal(props: TfaEnableModalProps) {
  const { isOpen, onClose, onTfaEnableConfirm } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>2차 인증 확인</ModalHeader>
        <ModalCloseButton />
        <ModalBody>2차 인증을 활성화 하시겠습니까?</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onTfaEnableConfirm}>
            네
          </Button>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function TfaDisableModal(props: TfaDisavleModalProps) {
  const { isOpen, onClose, onTfaDisableConfirm } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>2차 인증 확인</ModalHeader>
        <ModalCloseButton />
        <ModalBody>2차 인증 활성화를 해제하시겠습니까?</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onTfaDisableConfirm}>
            네
          </Button>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function LogoutConfirmationModal(props: LogoutConfirmationModalProps) {
  const { isOpen, onClose, onLogoutConfirm } = props;

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

function WithdrawalConfirmationModal(props: WithdrawalConfirmationModalProps) {
  const { isOpen, onClose, onWithdrawalConfirm } = props;

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

  const token = getCookie('token');

  const [userIdx, setUserIdx] = useState<number>(0);

  const [tfaEnabled, setTfaEnabled] = useState<boolean>(false);

  const {
    isOpen: isTfaModalOpen,
    onOpen: onOpenTfaModal,
    onClose: onCloseTfaModal,
  } = useDisclosure();
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

  const fetchUserIdx = async () => {
    try {
      const userData = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/auth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUserIdx(userData.data.user_idx);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/users/idx/${userIdx}`,
    );

    setTfaEnabled(response.data.tfa_enabled);
  };

  useEffect(() => {
    fetchUserIdx();
  }, []);

  useEffect(() => {
    if (userIdx > 0) fetchUserData();
  }, [userIdx]);

  // 각 설정 항목에 대한 클릭 이벤트 핸들러
  const handleAuthenticationClick = () => {
    onOpenTfaModal();
  };

  const handleBlockClick = () => {
    navigate('/block-list');
  };

  const handleFriendClick = () => {
    navigate('/friend-list');
  };

  const handleLogoutClick = () => {
    onOpenLogoutModal();
  };

  const handleWithdrawalClick = () => {
    onOpenWithdrawalModal();
  };

  const updateTfaEnabled = async (tfa_enabled: boolean) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/users/${userIdx}/tfa-enabled`,
        { tfa_enabled: tfa_enabled },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleTfaEnableConfirm = async () => {
    // add socket logic
    await updateTfaEnabled(true);
    setTfaEnabled(true);
    onCloseTfaModal();
  };

  const handleTfaDisableConfirm = async () => {
    // add socket logic
    await updateTfaEnabled(false);
    setTfaEnabled(false);
    onCloseTfaModal();
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
        {/* 친구목록 */}
        <div
          className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
          onClick={handleFriendClick}
        >
          <img
            src={friend}
            alt="친구목록"
            className="flex-item-logo"
            style={{ width: '100px', height: 'auto' }}
          />
          <span className="flex-grow">친구목록</span>
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
      {/* 2차 인증 확인 모달 */}
      {tfaEnabled ? (
        <TfaDisableModal
          isOpen={isTfaModalOpen}
          onClose={onCloseTfaModal}
          onTfaDisableConfirm={handleTfaDisableConfirm}
        />
      ) : (
        <TfaEnableModal
          isOpen={isTfaModalOpen}
          onClose={onCloseTfaModal}
          onTfaEnableConfirm={handleTfaEnableConfirm}
        />
      )}

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
