import { useRef, useEffect, useCallback } from 'react';
import { PlayerInputHandler } from 'types';

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
      pressed.current[event.keyCode] = false;
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
  left: 65,
  up: 87,
  right: 68,
  down: 83,
  shoot: 16
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
