import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후에 로그인 페이지로 이동
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    // 컴포넌트가 언마운트될 때 타이머를 정리
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-basic-color h-screen flex flex-col items-center justify-start align-middle mt-24 bg-green-200">
      <div className="w-screen h-4/5  flex justify-evenly items-center">
        <img src={logo} alt="logo" style={{ width: '100px', height: 'auto' }} />
      </div>
    </div>
  );
}

export default WelcomePage;
