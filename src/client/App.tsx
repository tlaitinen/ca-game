import React, { useRef, useEffect, useCallback } from 'react';

import { GameState, PlayerInputState, ClientMessage } from '../state/types';
import { initialGameState, updateGameState } from '../state/state';
import { renderScene } from './render';
import ioClient from 'socket.io-client';
import useInputHandler from 'client/InputHandler/useInputHandler';

const socket = ioClient();

const send = (message: ClientMessage) =>
  socket.emit(message.type, message.payload);

const App: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<GameState>(initialGameState());
  const inputHandler = useCallback((inputState: PlayerInputState) => {
    send({ type: 'input', payload: inputState });
  }, []);

  useInputHandler(inputHandler);
  const renderCallback = useCallback(() => {
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        renderScene(ctx, state.current);
      }
    }
    window.requestAnimationFrame(renderCallback);
  }, [canvas, state]);
  useEffect(() => {
    const timerId = setInterval(() => {
      updateGameState(state.current);
    }, 16);
    return () => clearInterval(timerId);
  }, [canvas, state]);
  useEffect(() => {
    socket.on('state', (gameState: GameState) => {
      state.current = gameState;
      console.log('got new state', gameState);
    });
    window.requestAnimationFrame(renderCallback);
    // eslint-disable-next-line
  }, []);
  return (
    <div className="App">
      <canvas
        ref={canvas}
        width={1024}
        height={1024}
        style={{ width: 512, height: 512 }}
      />
    </div>
  );
};

export default App;
