import { useNavigate } from 'react-router-dom';
import left from '../assets/welcome-left.png';
import right from '../assets/welcome-right.png';
import check from '../assets/check.svg';

function TestWelcomePage() {
  const navigate = useNavigate();

  const handleCheckButtonClick = () => {
    navigate('/login');
  };

  return (
    <div className="bg-basic-color h-screen flex flex-row items-stretch justify-center bg-green-200">
      <img
        src={left}
        alt="left"
        style={{ width: '50%', height: '100%', objectFit: 'cover' }}
      />
      <img
        src={right}
        alt="right"
        style={{ width: '50%', height: '100%', objectFit: 'cover' }}
      />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-70 px-12 py-6 rounded flex flex-col items-center"
        style={{ width: '20%', height: '20%' }}
      >
        <h1 className="text-4xl font-bold mb-4">ENTER</h1>
        <img
          className="object-scale-down h-20 w-20 hover:opacity-70 cursor-pointer"
          src={check}
          alt="check"
          onClick={handleCheckButtonClick}
        />
      </div>
    </div>
  );
}

export default TestWelcomePage;
