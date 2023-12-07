import { HitoryType } from './MyPage';

interface IRateCircle {
  radius: number;
  circumference: number;
  offset: number;
  userData: {
    rate: number | undefined;
    total: number | undefined;
    win: number | undefined;
    lose: number | undefined;
  };
  type: HitoryType;
}
const RateCircle = (props: IRateCircle) => {
  const { radius, circumference, offset, userData, type } = props;

  const typeToText =
    type === 'all' ? 'TOTAL' : type === 'ladder' ? 'LADDER' : 'CHALLENGE';
  return (
    <div className="shrink-0">
      <svg width="100" height="100">
        <g transform="rotate(-90, 50, 50)">
          <circle
            className="text-red-300"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {userData.rate && (
            <circle
              className="text-blue-600"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
          )}
        </g>
        <text
          x="50"
          y="55"
          className="text-lg font-semibold text-blue-800"
          textAnchor="middle"
        >
          {userData.rate}%
        </text>
      </svg>
      <p className="text-m text-center">{typeToText}</p>
      <p className="text-m text-center">
        {userData.total}전 {userData.win}승 {userData.lose}패
      </p>
    </div>
  );
};

export default RateCircle;
