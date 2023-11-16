import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AuthenticationPage() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(Array(6).fill(''));
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoging] = useState(false);
  const inputRefs = useRef(new Array(6).fill(null));

  const tfaCode = inputs.join('');

  // Fetch QR code on component mount
  useEffect(() => {
    const fetchQRCode = async () => {
      if (!qrCodeUrl) {
        setLoging(true);
        try {
          const response = await fetch(
            'http://localhost:3000/auth/tfa/12/switch',
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          if (!response.ok) {
            throw new Error('Failed to fetch QR code');
          }
          const data = await response.json();
          setQrCodeUrl(data.qrCode);
          console.log(data.qrCode);
        } catch (error) {
          console.error('Error fetching QR code:', error);
        } finally {
          setLoging(false);
        }
      }
    };

    fetchQRCode();
  }, [qrCodeUrl]);

  // verify with tfa code
  useEffect(() => {
    const verifyTFA = async () => {
      if (inputs.every((input) => input.length === 1)) {
        try {
          console.log('Code:', tfaCode);

          const response = await axios.post(
            `http://localhost:3000/auth/tfa/12/verify`,
            { token: tfaCode },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          console.log('TFA Verified:', response.data.message);
          navigate('/main'); // 이동할 페이지 수정하기
        } catch (error) {
          if (error.response) {
            console.error('Error Response:', error.response.data);
          } else if (error.request) {
            console.error('No response received:', error.request);
          } else {
            console.error('Error:', error.message);
          }
        }
      }
    };

    verifyTFA();
  }, [inputs, navigate, tfaCode]);

  const moveToNextInput = (index, value) => {
    if (index < inputRefs.current.length - 1 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index, value) => {
    if (index > 0 && !value) {
      setInputs(inputs.map((input, i) => (i === index - 1 ? '' : input)));
      inputRefs.current[index - 1].focus();
    }
  };

  const handleChange = (index) => (e) => {
    const value = e.target.value;
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    moveToNextInput(index, value);
  };

  const handleKeyDown = (index) => (e) => {
    if (e.key === 'Backspace') {
      handleBackspace(index, inputs[index]);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        {/* QR code */}
        <div className="p-20 bg-gray-200 rounded-lg">
          {loading ? (
            <p>Loading QR Code</p> // 로딩 중일 때 문구 표시
          ) : qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code" />
          ) : null}{' '}
          {/* // QR 코드 URL이 있을 때 이미지 표시, QR 코드 URL이 없고 로딩 중도 아닐 때는 아무것도 표시하지 않음 */}
        </div>
        {/* 인증번호 입력 */}
        <div className="mt-20 flex space-x-3">
          {inputs.map((input, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className="border-2 border-gray-300 rounded-lg p-4 text-center"
              style={{ width: '5rem' }}
              value={input}
              onChange={handleChange(index)}
              onKeyDown={handleKeyDown(index)}
              maxLength={1}
              pattern="\d*"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthenticationPage;
