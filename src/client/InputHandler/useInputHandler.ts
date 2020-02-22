import useKeyboardHandler from './useKeyboardHandler';
import { PlayerInputHandler } from 'state/types';

const useInputHandler = (handler: PlayerInputHandler) => {
  useKeyboardHandler(handler);
};

export default useInputHandler;
