import React, { useRef, useEffect, useCallback } from 'react';

import { GameState, PressedKeys } from './types';
import { createState, updateState } from './state';
import { renderScene } from './render';
import ioClient from 'socket.io-client';

function registerKeyboardHandler(pressed: React.MutableRefObject<PressedKeys>) {
  document.addEventListener('keydown', event => {
    if (pressed.current) {
      pressed.current[event.keyCode] = true;
    }
  });
  document.addEventListener('keyup', event => {
    if (pressed.current) {
      pressed.current[event.keyCode] = false;
    }
  });
}

const socket = ioClient();

socket.emit('fuu', 'bar');
const App: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<GameState>(createState());
  const pressedKeys = useRef<PressedKeys>([]);

  registerKeyboardHandler(pressedKeys);
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
      updateState(state.current, pressedKeys.current);
    }, 16);
    return () => clearInterval(timerId);
  }, [canvas, state]);
  useEffect(() => {
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
