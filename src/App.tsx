import React, { useRef, useEffect } from "react";

import { GameState, PressedKeys } from "./types";
import { createState, updateState } from "./state";
import { renderScene } from "./render";

function registerKeyboardHandler(pressed: React.MutableRefObject<PressedKeys>) {
  document.addEventListener("keydown", event => {
    if (pressed.current) {
      pressed.current[event.keyCode] = true;
    }
  });
  document.addEventListener("keyup", event => {
    if (pressed.current) {
      pressed.current[event.keyCode] = false;
    }
  });
}

const App: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<GameState>(createState());
  const pressedKeys = useRef<PressedKeys>([]);

  registerKeyboardHandler(pressedKeys);
  useEffect(() => {
    const timerId = setInterval(() => {
      updateState(state.current, pressedKeys.current);
      if (canvas.current) {
        const ctx = canvas.current.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          renderScene(ctx, state.current);
        }
      }
    }, 16);
    return () => clearInterval(timerId);
  }, [canvas, state]);
  return (
    <div className="App">
      <canvas ref={canvas} width={1024} height={768} />
    </div>
  );
};

export default App;
