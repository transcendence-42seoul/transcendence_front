interface ImageComponentProps {
  imageData: number[];
}

const ImageComponent = ({ imageData }: ImageComponentProps) => {
  // imageData는 이미지 데이터로 가정

  // ArrayBuffer를 이용하여 Blob 생성
  const arrayBufferView = new Uint8Array(imageData);
  const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });

  // Blob을 Data URL로 변환
  const imageUrl = URL.createObjectURL(blob);

  return (
    <div>
      <img src={imageUrl} alt="Image" />
    </div>
  );
};

export default ImageComponent;
