export interface User {
  idx: number;
  id: string;
  nickname: string;
  email: string;
  status: string;
  tfa_enabled: false;
  tfa_secret: null;
  avatar: {
    idx: 1;
    image_data: {
      type: string;
      data: number[];
    };
  };
  record: {
    idx: number;
    total_game: number;
    total_win: number;
    ladder_game: number;
    ladder_win: number;
    general_game: number;
    general_win: number;
  };
  ranking: {
    idx: number;
    score: number;
  };
  requester: number[];
  requested: number[];
  banner: number[];
}

export interface Chat {
  idx: number;
  name: string;
  type: string;
  password: string;
  create_time: string;
  messages: number[];
  participants: number[];
}

function MainPage() {
  return (
    <div className="Group70 w-96 h-96 relative">
      <div className="Rectangle83 w-96 h-96 left-0 top-0 absolute bg-white border border-black" />
      <img
        className="Image6 w-28 h-32 left-[1693px] top-[62px] absolute"
        src="https://via.placeholder.com/117x124"
      />
      <img
        className="Image7 w-36 h-32 left-[1423px] top-[61px] absolute"
        src="https://via.placeholder.com/143x134"
      />
      <div className="Rectangle86 w-96 h-96 left-[96px] top-[306px] absolute bg-zinc-300" />
      <div className=" left-[134px] top-[350px] absolute text-black text-8xl font-normal font-['Inter']">
        채널 목록
      </div>
      <div className="Rectangle93 w-80 h-36 left-[73px] top-[81px] absolute bg-zinc-300" />
      <div className="Group23 w-96 h-36 left-[164px] top-[81px] absolute">
        <div className="Rectangle93 w-80 h-36 left-[354px] top-0 absolute bg-zinc-300" />
        <div className="Group8 w-96 h-32 left-0 top-[14px] absolute">
          <div className="HardLadder left-[445px] top-0 absolute text-center text-black text-5xl font-normal font-['Inter']">
            Hard
            <br />
            Ladder
          </div>
          <div className="HardLadder left-0 top-0 absolute text-center text-black text-5xl font-normal font-['Inter']">
            Hard
            <br />
            Ladder
          </div>
        </div>
      </div>
      <div className=" w-96 h-36 left-[1391px] top-[558px] absolute text-center text-black text-4xl font-normal font-['Inter']">
        채팅 참여 목록 | 친구 목록
        <br />
        ------------------------
      </div>
      <div className=" w-96 h-36 left-[1371px] top-[558px] absolute text-center text-black text-4xl font-normal font-['Inter']">
        대기실 참여 목록 | 친구 목록
        <br />
        ------------------------
      </div>
      <div className="Group15 w-80 h-36 left-[946px] top-[81px] absolute">
        <div className="Rectangle91 w-80 h-36 left-0 top-0 absolute bg-zinc-300" />
        <div className="CreateChannel left-[78px] top-[14px] absolute text-center text-black text-5xl font-normal font-['Inter']">
          Create
          <br />
          Channel
        </div>
      </div>
      <div className="Group21 w-96 h-64 left-[1371px] top-[225px] absolute">
        <div className="Ellipse11 w-32 h-32 left-[40px] top-[33px] absolute bg-black rounded-full" />
        <div className="Sanghan1151295 w-64 h-16 left-[220px] top-[33px] absolute text-black text-5xl font-normal font-['Inter']">
          sanghan
          <br />
          1승 15패
          <br />
          1295점
        </div>
      </div>
      <div className=" w-96 h-96 left-[165px] top-[531px] absolute text-black text-5xl font-normal font-['Inter']">
        방 제목 | 방 소유자 | 참여인원
        <br />방 제목 | 방 소유자 | 참여인원
        <br />방 제목 | 방 소유자 | 참여인원
        <br />방 제목 | 방 소유자 | 참여인원
        <br />방 제목 | 방 소유자 | 참여인원
        <br />방 제목 | 방 소유자 | 참여인원
        <br />
      </div>
      <div className="Ellipse28 w-7 h-7 left-[1551px] top-[45px] absolute bg-red-600 rounded-full" />
    </div>
  );
}

export default MainPage;
