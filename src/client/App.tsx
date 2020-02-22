import React, { useRef, useEffect, useCallback } from 'react';

import { GameState, PlayerInputState, ClientMessage } from '../state/types';
import { updateGameState } from '../state/state';
import { renderScene } from './render';
import ioClient from 'socket.io-client';
import useInputHandler from 'client/InputHandler/useInputHandler';

const socket = ioClient();

const send = (message: ClientMessage) =>
  socket.emit(message.type, message.payload);

const App: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<GameState | undefined>();
  const inputHandler = useCallback((inputState: PlayerInputState) => {
    send({ type: 'input', payload: inputState });
  }, []);

  useInputHandler(inputHandler);
  const renderCallback = useCallback(() => {
    if (canvas.current) {
      const ctx = canvas.current.getContext('2d');
      if (!ctx || !state.current) {
        window.requestAnimationFrame(renderCallback);

        return;
      }
      ctx.imageSmoothingEnabled = false;

      renderScene(ctx, state.current, socket.id);
    }
    window.requestAnimationFrame(renderCallback);
  }, [canvas, state]);
  useEffect(() => {
    const timerId = setInterval(() => {
      if (!state.current) {
        return;
      }
      updateGameState(state.current);
    }, 16);
    return () => clearInterval(timerId);
  }, [canvas, state]);
  useEffect(() => {
    socket.on('initState', (gameState: GameState) => {
      state.current = gameState;
    });
    socket.on('updateState', (updates: Partial<GameState>) => {
      if (!state.current) {
        return;
      }
      Object.assign(state.current, updates);
    });
    window.requestAnimationFrame(renderCallback);
    // eslint-disable-next-line
  }, []);
  return (
    <div className="App">
      <canvas
        ref={canvas}
        width={2048}
        height={1536}
        style={{ width: 1024, height: 768 }}
      />
    </div>
  );
};

export default App;
