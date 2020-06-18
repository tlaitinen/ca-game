import React, { useRef, useEffect, useCallback, useState } from 'react';

import { GameState, PlayerInputState, ClientMessage } from '../state/types';
import { updateGameState } from '../state/state';
import { renderScene } from './render';
import ioClient from 'socket.io-client';
import useInputHandler from 'client/InputHandler/useInputHandler';
import './App.css';
import TouchInputHandler from './InputHandler/TouchInputHandler';

import MetaTags from 'react-meta-tags';

const socket = ioClient();

const send = (message: ClientMessage) =>
  socket.emit(message.type, message.payload);

const App: React.FC = () => {
  const appRef = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<GameState | undefined>();
  const [canvasSize, setCanvasSize] = useState<[number, number]>([1, 1]);

  const inputHandler = useCallback((inputState: PlayerInputState) => {
    send({ type: 'input', payload: inputState });
  }, []);

  useInputHandler(inputHandler);
  const renderCallback = useCallback(() => {
    if (canvas.current) {
      if (!state.current) {
        window.requestAnimationFrame(renderCallback);

        return;
      }

      renderScene(canvas.current, state.current, socket.id);
    }
    window.requestAnimationFrame(renderCallback);
  }, [canvas, state]);
  useEffect(() => {
    const timerId = setInterval(() => {
      if (!state.current) {
        return;
      }
      updateGameState(state.current);
    }, 5);
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

  useEffect(() => {
    const { current } = appRef;

    if (!current) {
      return;
    }
    setCanvasSize([current.clientWidth, current.clientHeight]);
  }, [appRef]);
  return (
    <div ref={appRef} className="App">
      <MetaTags>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta>
      </MetaTags>
      ;
      <canvas
        ref={canvas}
        width={2 * canvasSize[0]}
        height={2 * canvasSize[1]}
        style={{ width: canvasSize[0], height: canvasSize[1] }}
      />
      <TouchInputHandler handler={inputHandler} />
    </div>
  );
};

export default App;
