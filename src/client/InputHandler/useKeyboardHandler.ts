import { useRef, useEffect, useCallback } from 'react';
import { PlayerInputHandler } from 'state/types';

export type KeyboardInput = {};

type PressedKeys = Array<boolean>;

const registerKeyboardHandler = (
  pressed: React.MutableRefObject<PressedKeys>,
  onChange: () => void
) => {
  const keydownHandler = (event: KeyboardEvent) => {
    if (pressed.current) {
      pressed.current[event.keyCode] = true;
      onChange();
    }
  };
  const keyupHandler = (event: KeyboardEvent) => {
    if (pressed.current) {
      delete pressed.current[event.keyCode];
      onChange();
    }
  };
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  return () => {
    document.removeEventListener('keydown', keydownHandler);
    document.removeEventListener('keyup', keyupHandler);
  };
};

const keys = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shoot: 32
};

const useKeyboardHandler = (handler: PlayerInputHandler) => {
  const pressedKeys = useRef<PressedKeys>([]);
  const onChange = useCallback(() => {
    const pressed = pressedKeys.current;
    handler({
      left: pressed[keys.left],
      right: pressed[keys.right],
      up: pressed[keys.up],
      down: pressed[keys.down],
      shoot: pressed[keys.shoot]
    });
  }, [handler]);
  useEffect(() => registerKeyboardHandler(pressedKeys, onChange), [onChange]);
};

export default useKeyboardHandler;
