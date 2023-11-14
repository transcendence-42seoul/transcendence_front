import { useEffect, useRef, useState } from 'react';
import { gameSocket } from '../../socket/game.socket';

type BallType = {
  width: number;
  height: number;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
  speed: number;
};

enum DIRECTION {
  IDLE = 0,
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4,
}

type PlayerType = {
  width: number;
  height: number;
  x: number;
  y: number;
  score: number;
  move: DIRECTION;
  speed: number;
};

type GameType = {
  host: PlayerType;
  guest: PlayerType;
  ball: BallType;
  running: boolean;
  turn: PlayerType | undefined;
  timer: number;
  color: string;
  over: boolean;
  round: number;
};

const ROUNDS: number[] = [7];

const PongGame = () => {
  const [pongData, setPongData] = useState<GameType>();

  // const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const GameDataHandle = (gameData: GameType) => {
    setPongData(gameData);
  };

  const _turnDelayIsOver = () => {
    if (pongData === undefined) return false;
    return new Date().getTime() - pongData.timer >= 1000;
  };

  const menu = () => {
    if (!canvasRef.current) return;
    if (pongData === undefined) return;
    const context = canvasRef.current?.getContext('2d');

    // Draw all the Pong objects in their current state
    draw(); // 현재 상태를 draw해준다.

    if (!context) return;
    // Change the canvas font size and color
    context.font = '50px Courier New';
    context.fillStyle = pongData.color;

    // Draw the rectangle behind the 'Press any key to begin' text.
    context.fillRect(
      canvasRef.current.width / 2 - 350,
      canvasRef.current.height / 2 - 48,
      700,
      100,
    );

    // Change the canvas color;
    context.fillStyle = '#ffffff';

    // Draw the 'press any key to begin' text
    context.fillText(
      'Press any key to begin',
      canvasRef.current.width / 2,
      canvasRef.current.height / 2 + 15,
    );
  };

  const draw = () => {
    if (!canvasRef.current) return;
    if (pongData === undefined) return;
    const context = canvasRef.current?.getContext('2d');

    if (!context) return;
    // Clear the Canvas
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Set the fill style to black
    context.fillStyle = pongData.color;

    // Draw the background
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Set the fill style to white (For the paddles and the ball)
    context.fillStyle = '#ffffff';

    // Draw the Player
    context.fillRect(
      pongData.host.x,
      pongData.host.y,
      pongData.host.width,
      pongData.host.height,
    );

    // Draw the Ai
    context.fillRect(
      pongData.guest.x,
      pongData.guest.y,
      pongData.guest.width,
      pongData.guest.height,
    );

    // Draw the Ball
    if (_turnDelayIsOver()) {
      context.fillRect(
        pongData.ball.x,
        pongData.ball.y,
        pongData.ball.width,
        pongData.ball.height,
      );
    }

    // Draw the net (Line in the middle)
    context.beginPath();
    context.setLineDash([7, 15]);
    context.moveTo(canvasRef.current.width / 2, canvasRef.current.height - 140);
    context.lineTo(canvasRef.current.width / 2, 140);
    context.lineWidth = 10;
    context.strokeStyle = '#ffffff';
    context.stroke();

    // Set the default canvas font and align it to the center
    context.font = '100px Courier New';
    context.textAlign = 'center';

    // Draw the players score (left)
    context.fillText(
      pongData.host.score.toString(),
      canvasRef.current.width / 2 - 300,
      200,
    );

    // Draw the paddles score (right)
    context.fillText(
      pongData.guest.score.toString(),
      canvasRef.current.width / 2 + 300,
      200,
    );

    // Change the font size for the center score text
    context.font = '30px Courier New';

    // Draw the winning score (center)
    context.fillText(
      'Round ' + (pongData.round + 1),
      canvasRef.current.width / 2,
      35,
    );

    // Change the font size for the center score value
    context.font = '40px Courier';

    // Draw the current round number
    const curRound = ROUNDS[pongData.round]
      ? ROUNDS[pongData.round]
      : ROUNDS[pongData.round - 1];

    context.fillText(curRound.toString(), canvasRef.current.width / 2, 100);
  };

  const animationIdRef = useRef<number>();

  const loop = () => {
    if (pongData === undefined) return;
    // pongData.update();
    draw();

    // If the game is not over, draw the next frame.
    if (!pongData.over) animationIdRef.current = requestAnimationFrame(loop);
    else console.log('game over');
  };

  const keydownfunction = (key: KeyboardEvent) => {
    gameSocket.emit('gameStart');

    if (pongData === undefined) return;
    // Handle up arrow and w key events
    if (key.keyCode === 38 || key.keyCode === 87)
      // pongData.player.move = DIRECTION.UP;
      gameSocket.emit('keyUp');

    // Handle down arrow and s key events
    if (key.keyCode === 40 || key.keyCode === 83) gameSocket.emit('keyDown');
    // pongData.player.move = DIRECTION.DOWN;
  };

  const keyupfunction = () => {
    gameSocket.emit('keyIdle');
    // pongData.player.move = DIRECTION.IDLE;
  };

  const listen = () => {
    document.addEventListener('keydown', keydownfunction);

    // Stop the player from moving when there are no keys being pressed.
    document.addEventListener('keyup', keyupfunction);
  };

  //게임 이벤트 등록
  useEffect(() => {
    gameSocket.emit('gameStart');
    gameSocket.on('getGameData', (gameData: GameType) => {
      GameDataHandle(gameData);
    });
    window.requestAnimationFrame(loop);
    listen();
    return () => {
      document.removeEventListener('keydown', keydownfunction);
      document.removeEventListener('keyup', keyupfunction);
      gameSocket.off('connection');
      cancelAnimationFrame(animationIdRef.current!);
      // gameSocket.emit('leaveGame', { room_id: roomId });
    };
  }, []);
  //pongData가 업데이트 될 시 실행할 함수 = 매 라운드 정보 업데이트
  useEffect(() => {
    // draw();
  }, [pongData]);

  return <canvas ref={canvasRef}></canvas>;
};

export default PongGame;
