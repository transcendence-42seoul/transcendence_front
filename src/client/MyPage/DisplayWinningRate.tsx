import { IProfileUser } from '../../common/entity/user';
import RateCircle from './RateCircle';

interface IDisplayWinningRate {
  userData: IProfileUser | undefined;
  radius: number;
}

const DisplayWinningRate = (props: IDisplayWinningRate) => {
  const { userData, radius } = props;
  const circumference = 2 * Math.PI * radius;
  const totalRate = userData?.record.total_rate || 0;
  const total_offset = totalRate
    ? circumference - (totalRate / 100) * circumference
    : 0;
  const ladderRate = userData?.record.ladder_rate || 0;
  const ladder_offset = ladderRate
    ? circumference - (ladderRate / 100) * circumference
    : 0;
  const challengeRate = userData?.record.challenge_rate || 0;
  const challenge_offset = challengeRate
    ? circumference - (challengeRate / 100) * circumference
    : 0;

  return (
    <>
      <RateCircle
        radius={radius}
        circumference={circumference}
        offset={total_offset}
        userData={{
          rate: userData?.record.total_rate,
          total: userData?.record.total_game,
          win: userData?.record.total_win,
          lose: userData?.record.total_lose,
        }}
        type={'all'}
      />
      <RateCircle
        radius={radius}
        circumference={circumference}
        offset={ladder_offset}
        userData={{
          rate: userData?.record.ladder_rate,
          total: userData?.record.ladder_game,
          win: userData?.record.ladder_win,
          lose: userData?.record.ladder_lose,
        }}
        type={'ladder'}
      />
      <RateCircle
        radius={radius}
        circumference={circumference}
        offset={challenge_offset}
        userData={{
          rate: userData?.record.challenge_rate,
          total: userData?.record.challenge_game,
          win: userData?.record.challenge_win,
          lose: userData?.record.challenge_lose,
        }}
        type={'challenge'}
      />
    </>
  );
};

export default DisplayWinningRate;
