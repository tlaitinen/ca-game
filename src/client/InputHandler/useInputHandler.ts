import useKeyboardHandler from './useKeyboardHandler';
import { PlayerInputHandler } from 'types';

const useInputHandler = (handler: PlayerInputHandler) => {
  useKeyboardHandler(handler);
};

export default useInputHandler;
