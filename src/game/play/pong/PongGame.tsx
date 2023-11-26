import { useEffect, useRef, useState } from 'react';
import { gameSocket } from '../../socket/game.socket';
import { GameRoomIdSelector } from '../../../recoil/gameAtom';
import { useRecoilValue } from 'recoil';

export interface BallType {
  width: number;
  height: number;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
  speed: number;
}

export enum DIRECTION {
  IDLE = 0,
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4,
}

export interface PlayerType {
  width: number;
  height: number;
  x: number;
  y: number;
  score: number;
  move: DIRECTION;
  speed: number;
}

export interface GameType {
  host: PlayerType;
  guest: PlayerType;
  ball: BallType;
  running: boolean;
  turn: PlayerType | undefined;
  timer: number;
  color: string;
  over: boolean;
  round: number;
}

export const ROUNDS: number[] = [7];
export const canvasWidth = 1400;
export const canvasHeight = 1000;

interface PongGameProps {
  player: 'Host' | 'Guest';
  setGameEndState: React.Dispatch<React.SetStateAction<boolean>>;
  setWinner: React.Dispatch<React.SetStateAction<'Host' | 'Guest'>>;
}

const PongGame = (props: PongGameProps) => {
  const [pongData, setPongData] = useState<GameType>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const GameDataHandle = (gameData: GameType) => {
    setPongData(gameData);
  };

  const _turnDelayIsOver = () => {
    if (pongData === undefined) return false;
    return new Date().getTime() - pongData.timer >= 1000;
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

  const keydownfunction = (key: KeyboardEvent) => {
    // Handle up arrow and w key events

    if (key.key === 'ArrowUp')
      gameSocket.emit('keyEvent', {
        key: 'keyUp',
        room_id: roomId,
        identity: props.player,
      });

    // Handle down arrow and s key events
    if (key.key === 'ArrowDown')
      gameSocket.emit('keyEvent', {
        key: 'keyDown',
        room_id: roomId,
        identity: props.player,
      });
  };

  const keyupfunction = () => {
    gameSocket.emit('keyEvent', {
      key: 'keyIdle',
      room_id: roomId,
      identity: props.player,
    });
  };

  const listen = () => {
    document.addEventListener('keydown', keydownfunction);

    // Stop the player from moving when there are no keys being pressed.
    document.addEventListener('keyup', keyupfunction);
  };

  const endGameMenu = (text: string) => {
    if (canvasRef.current === null) return;
    if (pongData === undefined) return;
    const context = canvasRef.current.getContext('2d');
    if (context) {
      // Change the canvas font size and color
      context.font = '45px Courier New';
      context.fillStyle = pongData.color;

      // Draw the rectangle behind the 'Press any key to begin' text.
      context.fillRect(canvasWidth / 2 - 350, canvasHeight / 2 - 48, 700, 100);

      // Change the canvas color;
      context.fillStyle = '#ffffff';

      // Draw the end game menu text ('Game Over' and 'Winner')
      context.fillText(text, canvasWidth / 2, canvasHeight / 2 + 15);
    } else {
      console.error('context is null');
    }
  };

  const roomId = useRecoilValue(GameRoomIdSelector);

  //게임 이벤트 등록
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas === null || context === null) return;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = canvasWidth / 2 + 'px';
    canvas.style.height = canvasHeight / 2 + 'px';

    gameSocket.on('getGameData', (gameData: GameType) => {
      GameDataHandle(gameData);
    });
    listen();
    return () => {
      document.removeEventListener('keydown', keydownfunction);
      document.removeEventListener('keyup', keyupfunction);
    };
  }, []);

  useEffect(() => {
    if (pongData?.over) {
      endGameMenu('Game Over');
      gameSocket.off('getGameData');
      props.setWinner(
        pongData.host.score > pongData.guest.score ? 'Host' : 'Guest',
      );
    }
    draw();
  }, [pongData]);

  return <canvas ref={canvasRef}></canvas>;
};

export default PongGame;
