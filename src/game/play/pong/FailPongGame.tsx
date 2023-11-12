/*
** 이거는 실패한 코드인데 나중에 다시 살리고자 남겨둠 **

평가시에 지워도 되는 존재임.
*/

import React, { useState, useEffect, useRef } from 'react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  COLORS,
  DIRECTION,
  PlayerType,
  ROUNDS,
  Ai,
  Ball,
  Side,
  GameType,
} from './pong_engin';
// import { useRecoilState } from 'recoil';
// import { GameAtom } from '../../recoil/gameAtom';

const FailPongGame = () => {
  // const [game, setGame] = useRecoilState(GameAtom);

  const intervalRef = useRef<NodeJS.Timeout>();

  const animationRef = useRef<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // useRef와 dom element가 연결되는 시점은 useEffect가 실행된 이후이다.
  // const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const [, setForceUpdate] = useState<boolean>(false);

  const [game, setGame] = useState<GameType>({
    player: Ai.new('left'),
    ai: Ai.new('right'),
    ball: Ball.new(),
    running: false,
    turn: Ai.new('right'),
    timer: 0,
    color: '#8c52ff',
    over: false,
    round: 0,
  });

  const makeInit = () => {
    // console.log('makeInitasdfasdf\nasdfasdfsdf\nasdfasdf\nasdf\nasdfasdf\n');
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    canvas.style.width = canvas.width / 2 + 'px';
    canvas.style.height = canvas.height / 2 + 'px';

    setGame((prev) => ({
      ...prev,
      player: Ai.new('left'),
      ai: Ai.new('right'),
      ball: Ball.new(),
      running: false,
      turn: Ai.new('right'),
      timer: 0,
      color: '#8c52ff',
      over: false,
      round: 0,
    }));
  };

  const initialize = () => {
    menu();
    listen();
  };

  const endGameMenu = (text: string) => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;
    // Change the canvas font size and color
    context.font = '45px Courier New';
    context.fillStyle = game.color;

    // Draw the rectangle behind the 'Press any key to begin' text.
    context.fillRect(canvas.width / 2 - 350, canvas.height / 2 - 48, 700, 100);

    // Change the canvas color;
    context.fillStyle = '#ffffff';

    // Draw the end game menu text ('Game Over' and 'Winner')
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 15);

    // const thisMakeInit = makeInit;
    // const thisInitialize = initialize;
    if (intervalRef.current) {
      clearInterval(intervalRef.current!);
      intervalRef.current = undefined;
    }

    setTimeout(() => {
      // Pong = Object.assign({}, Game);
      makeInit();
      initialize();
      // Pong.initialize();
    }, 3000);

    setForceUpdate((prev) => !prev);
  };

  const menu = () => {
    // Draw all the Pong objects in their current state
    draw();
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;
    // Change the canvas font size and color
    context.font = '50px Courier New';
    context.fillStyle = game.color;

    // Draw the rectangle behind the 'Press any key to begin' text.
    context.fillRect(canvas.width / 2 - 350, canvas.height / 2 - 48, 700, 100);

    // Change the canvas color;
    context.fillStyle = '#ffffff';

    // Draw the 'press any key to begin' text
    context.fillText(
      'Press any key to begin',
      canvas.width / 2,
      canvas.height / 2 + 15,
    );

    setForceUpdate((prev) => !prev);
  };

  const update = () => {
    let tmpBall = { ...game.ball! };
    let tmpCanvas = canvasRef.current!;
    let tmpPlayer = { ...game.player! };
    let tmpAi = { ...game.ai! }!;

    let tmpColor = game.color;
    let tmpTurn: PlayerType | undefined = undefined;
    if (game.turn) tmpTurn = { ...game.turn };
    let tmpOver = game.over;
    let tmpRound = game.round;

    if (!tmpOver) {
      // If the ball collides with the bound limits - correct the x and y coords.
      if (tmpBall.x <= 0) _resetTurn(tmpAi, tmpPlayer, 'right');
      if (tmpBall.x >= tmpCanvas.width - tmpBall.width)
        _resetTurn(tmpPlayer, tmpAi, 'left');
      if (tmpBall.y <= 0) tmpBall.moveY = DIRECTION.DOWN;
      if (tmpBall.y >= tmpCanvas.height - tmpBall.height)
        tmpBall.moveY = DIRECTION.UP;

      // Move tmpPlayer if they tmpPlayer.move value was updated by a keyboard event
      if (tmpPlayer.move === DIRECTION.UP) tmpPlayer.y -= tmpPlayer.speed;
      else if (tmpPlayer.move === DIRECTION.DOWN)
        tmpPlayer.y += tmpPlayer.speed;

      // On new serve (start of each turn) move the tmpBall to the correct side
      // and randomize the direction to add some challenge.
      if (_turnDelayIsOver() && tmpTurn) {
        tmpBall.moveX =
          tmpTurn === tmpPlayer ? DIRECTION.LEFT : DIRECTION.RIGHT;
        tmpBall.moveY = [DIRECTION.UP, DIRECTION.DOWN][
          Math.round(Math.random())
        ];
        tmpBall.y = Math.floor(Math.random() * tmpCanvas.height - 200) + 200;
        tmpTurn = undefined;
      }

      // If the tmpPlayer collides with the bound limits, update the x and y coords.
      if (tmpPlayer.y <= 0) tmpPlayer.y = 0;
      else if (tmpPlayer.y >= tmpCanvas.height - tmpPlayer.height)
        tmpPlayer.y = tmpCanvas.height - tmpPlayer.height;

      // Move tmpBall in intended direction based on moveY and moveX values
      if (tmpBall.moveY === DIRECTION.UP) tmpBall.y -= tmpBall.speed / 1.5;
      else if (tmpBall.moveY === DIRECTION.DOWN)
        tmpBall.y += tmpBall.speed / 1.5;
      if (tmpBall.moveX === DIRECTION.LEFT) tmpBall.x -= tmpBall.speed;
      else if (tmpBall.moveX === DIRECTION.RIGHT) tmpBall.x += tmpBall.speed;

      // Handle tmpAi (AI) UP and DOWN movement
      if (tmpAi.y > tmpBall.y - tmpAi.height / 2) {
        if (tmpBall.moveX === DIRECTION.RIGHT) tmpAi.y -= tmpAi.speed / 1.5;
        else tmpAi.y -= tmpAi.speed / 4;
      }
      if (tmpAi.y < tmpBall.y - tmpAi.height / 2) {
        if (tmpBall.moveX === DIRECTION.RIGHT) tmpAi.y += tmpAi.speed / 1.5;
        else tmpAi.y += tmpAi.speed / 4;
      }

      // Handle ai (AI) wall collision
      if (tmpAi.y >= tmpCanvas.height - tmpAi.height)
        tmpAi.y = tmpCanvas.height - tmpAi.height;
      else if (tmpAi.y <= 0) tmpAi.y = 0;

      // Handle Player-Ball collisions
      if (
        tmpBall.x - tmpBall.width <= tmpPlayer.x &&
        tmpBall.x >= tmpPlayer.x - tmpPlayer.width
      ) {
        if (
          tmpBall.y <= tmpPlayer.y + tmpPlayer.height &&
          tmpBall.y + tmpBall.height >= tmpPlayer.y
        ) {
          tmpBall.x = tmpPlayer.x + tmpBall.width;
          tmpBall.moveX = DIRECTION.RIGHT;
        }
      }

      // Handle ai-tmpBall collision
      if (
        tmpBall.x - tmpBall.width <= tmpAi.x &&
        tmpBall.x >= tmpAi.x - tmpAi.width
      ) {
        if (
          tmpBall.y <= tmpAi.y + tmpAi.height &&
          tmpBall.y + tmpBall.height >= tmpAi.y
        ) {
          tmpBall.x = tmpAi.x - tmpBall.width;
          tmpBall.moveX = DIRECTION.LEFT;
        }
      }
    }

    // Handle the end of round transition
    // Check to see if the player won the round.
    if (tmpPlayer.score === ROUNDS[tmpRound]) {
      // Check to see if there are any more rounds/levels left and display the victory screen if
      // there are not.
      if (!ROUNDS[tmpRound + 1]) {
        tmpOver = true;

        setTimeout(() => {
          endGameMenu('Winner!');
          // window.cancelAnimationFrame(animationRef.current);
        }, 1000);
      } else {
        // If there is another round, reset all the values and increment the round number.
        tmpColor = _generateRoundColor();
        tmpPlayer.score = tmpAi.score = 0;
        tmpPlayer.speed += 0.5;
        tmpAi.speed += 1;
        tmpBall.speed += 1;
        tmpRound += 1;
      }
    }
    // Check to see if the ai/AI has won the round.
    else if (tmpAi.score === ROUNDS[tmpRound]) {
      tmpOver = true;

      setTimeout(() => {
        endGameMenu('Game Over!');
        // window.cancelAnimationFrame(animationRef.current);
      }, 1000);
    }

    setGame((prev) => ({
      ...prev,
      player: { ...tmpPlayer },
      ai: { ...tmpAi },
      ball: { ...tmpBall },
      turn: { ...tmpTurn! },
      color: tmpColor,
      over: tmpOver,
      round: tmpRound,
    }));
  };

  // Draw the objects to the canvas element
  const draw = () => {
    const canvas = canvasRef.current!;
    let tmpContext = canvas.getContext('2d')!;

    if (game.ai === null || game.player === null || game.ball === null) {
      console.log('엥 설마 안그린겨?');
      return;
    }
    // Clear the Canvas
    tmpContext.clearRect(0, 0, canvas.width, canvas.height);

    // Set the fill style to black
    tmpContext.fillStyle = game.color;

    // Draw the background
    tmpContext.fillRect(0, 0, canvas.width, canvas.height);

    // Set the fill style to white (For the paddles and the ball)
    tmpContext.fillStyle = '#ffffff';

    // Draw the Player
    tmpContext.fillRect(
      game.player!.x,
      game.player!.y,
      game.player!.width,
      game.player!.height,
    );

    // Draw the Ai
    tmpContext.fillRect(game.ai.x, game.ai.y, game.ai.width, game.ai.height);

    // Draw the Ball
    if (_turnDelayIsOver()) {
      tmpContext.fillRect(
        game.ball.x,
        game.ball.y,
        game.ball.width,
        game.ball.height,
      );
    }

    // Draw the net (Line in the middle)
    tmpContext.beginPath();
    tmpContext.setLineDash([7, 15]);
    tmpContext.moveTo(canvas.width / 2, canvas.height - 140);
    tmpContext.lineTo(canvas.width / 2, 140);
    tmpContext.lineWidth = 10;
    tmpContext.strokeStyle = '#ffffff';
    tmpContext.stroke();

    // Set the default canvas font and align it to the center
    tmpContext.font = '100px Courier New';
    tmpContext.textAlign = 'center';

    // Draw the players score (left)
    tmpContext.fillText(
      game.player.score.toString(),
      canvas.width / 2 - 300,
      200,
    );

    // Draw the paddles score (right)
    tmpContext.fillText(game.ai.score.toString(), canvas.width / 2 + 300, 200);

    // Change the font size for the center score text
    tmpContext.font = '30px Courier New';

    // Draw the winning score (center)
    tmpContext.fillText('Round ' + (game.round + 1), canvas.width / 2, 35);

    // Change the font size for the center score value
    tmpContext.font = '40px Courier';

    // Draw the current round number
    const curRound = ROUNDS[game.round]
      ? ROUNDS[game.round]
      : ROUNDS[game.round - 1];

    tmpContext.fillText(curRound.toString(), canvas.width / 2, 100);

    setForceUpdate((prev) => !prev);
  };

  const [count, setCount] = useState<number>(0);
  const refCount = useRef<number>(0);
  const loop = () => {
    // console.log(
    //   'cout = ' +
    //     count +
    //     ' , refcoutn = ' +
    //     refCount.current +
    //     ' , game.ball.moveX = ' +
    //     game.ball.moveX,
    // );
    setCount((prev) => prev + 1);
    refCount.current += 1;
    update();
    draw();

    // const tmpLoop = loop;
    if (!game.over) animationRef.current = requestAnimationFrame(() => loop());
    else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
    setForceUpdate((prev) => !prev);
  };

  const keydownEvent = (key: KeyboardEvent) => {
    // console.log('함수 keydownEvent 실행');

    // let tmpRunning = game.running;
    // let tmpLoop = loop;
    let tmpPlayer = { ...game.player! };
    // Handle the 'Press any key to begin' function and start the game.
    if (game.running === false) {
      console.log('game.running = ' + game.running);
      // tmpRunning = true;
      setGame((prev) => ({ ...prev, running: true }));
      // setRunning((prev) => !prev);

      // intervalRef.current = setInterval(
      //   () => {
      //     update();
      //     draw();
      //   },
      //   Math.floor(1000 / 60),
      // );

      loop();
      // animationRef.current = window.requestAnimationFrame(loop);
      // animationRef.current = setInterval(loop, Math.floor(1000 / 60));
    }

    // Handle up arrow and w key events
    if (key.key === 'ArrowUp') tmpPlayer.move = DIRECTION.UP;

    // Handle down arrow and s key events
    if (key.key === 'ArrowDown') tmpPlayer.move = DIRECTION.DOWN;

    setGame((prev) => ({ ...prev, player: { ...tmpPlayer } }));
    // setPlayer((prev) => tmpPlayer);
  };

  const keyupEvent = (key: KeyboardEvent) => {
    let tmpPlayer = { ...game.player! };

    tmpPlayer.move = DIRECTION.IDLE;
    setGame((prev) => ({ ...prev, player: { ...tmpPlayer } }));
    // setPlayer(tmpPlayer);
  };

  const listen = () => {
    window.addEventListener('keydown', (event) => keydownEvent(event));

    // Stop the player from moving when there are no keys being pressed.
    window.addEventListener('keyup', (event) => keyupEvent(event));
  };

  const unlisten = () => {
    window.removeEventListener('keydown', (event) => keydownEvent(event));

    // Stop the player from moving when there are no keys being pressed.
    window.removeEventListener('keyup', (event) => keyupEvent(event));
  };

  // Reset the ball location, the player turns and set a delay before the next round begins.
  const _resetTurn = (
    victor: PlayerType,
    loser: PlayerType,
    whoIsWinner: Side,
  ) => {
    let tmpBall = Ball.new(canvasRef.current!, game.ball!.speed);
    let tmpTurn = { ...loser };
    let tmpTimer = new Date().getTime();

    victor.score++;
    if (whoIsWinner === 'left') {
      setGame((prev) => ({
        ...prev,
        player: { ...victor },
        ball: { ...tmpBall },
        turn: { ...tmpTurn },
        timer: tmpTimer,
      }));
    } else if (whoIsWinner === 'right') {
      setGame((prev) => ({
        ...prev,
        ai: { ...victor },
        ball: { ...tmpBall },
        turn: { ...tmpTurn },
        timer: tmpTimer,
      }));
    }
  };

  // Wait for a delay to have passed after each turn.
  const _turnDelayIsOver = () => {
    return new Date().getTime() - game.timer! >= 1000;
  };

  // Select a random color as the background of each level/round.
  const _generateRoundColor = (): string => {
    var newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    if (newColor === game.color) return _generateRoundColor();
    return newColor;
  };

  const gameRef = useRef(false);

  useEffect(() => {
    if (gameRef.current === true) return;
    makeInit();

    gameRef.current = false;
  }, []);

  useEffect(() => {
    if (
      game.ai === null ||
      game.player === null ||
      game.ball === null ||
      gameRef.current === true
    )
      return;
    unlisten();
    gameRef.current = true;
    initialize();
    // menu();
    // listen();

    return () => {
      // const intervalRef = useRef<NodeJS.Timeout>();
      if (intervalRef.current) clearInterval(intervalRef.current);
      // unlisten();
      // window.cancelAnimationFrame(animationRef.current);
    };
  }, [game]);

  useEffect(() => {
    // console.log('Ball = ' + JSON.stringify(game.ball));
    console.log(game.player.score + ' : ' + game.ai.score);
    // console.log('game = ' + JSON.stringify(game));
  }, [game]);

  return <canvas ref={canvasRef}></canvas>;
};

export default React.memo(FailPongGame);
