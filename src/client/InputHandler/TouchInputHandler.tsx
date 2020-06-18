import React, { useCallback, useState, useRef } from 'react';
import './TouchInputHandler.css';
import { PlayerInputHandler, PlayerInputState } from 'state/types';
const TouchInputHandler: React.FC<{ handler: PlayerInputHandler }> = ({
  handler
}) => {
  const prevState = useRef<PlayerInputState | undefined>();
  const [circlePos, setCirclePos] = useState<[number, number] | undefined>();
  const [pointerPos, setPointerPos] = useState<[number, number]>([0, 0]);
  const onStartMovement = useCallback(
    (e: React.MouseEvent) => {
      setCirclePos([e.clientX, e.clientY]);
      setPointerPos([e.clientX, e.clientY]);
    },
    [setCirclePos]
  );
  const onEndMovement = useCallback(() => {
    setCirclePos(undefined);
  }, [setCirclePos]);
  const onPressShoot = () => handler({ shoot: true });
  const onReleaseShoot = useCallback(() => {
    handler({
      shoot: false
    });
  }, [handler]);
  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!circlePos) {
        return;
      }
      const dx = e.clientX - circlePos[0];
      const dy = e.clientY - circlePos[1];
      setPointerPos([e.clientX, e.clientY]);
      const nextState: PlayerInputState = {
        down: false,
        up: false,
        left: false,
        right: false
      };
      if (Math.abs(dx) > Math.abs(dy)) {
        nextState.left = dx < 0;
        nextState.right = dx > 0;
      } else {
        nextState.up = dy < 0;
        nextState.down = dy > 0;
      }
      if (JSON.stringify(prevState.current) !== JSON.stringify(nextState)) {
        handler(nextState);
      }
      prevState.current = nextState;
    },
    [handler, prevState, circlePos]
  );
  return (
    <>
      <div
        className="TouchInputHandler-Movement"
        onMouseDown={onStartMovement}
        onMouseUp={onEndMovement}
        onMouseLeave={onEndMovement}
        onMouseMove={onMouseMove}
      ></div>
      {circlePos && (
        <>
          <div
            className="TouchInputHandler-Circle"
            style={{ left: circlePos[0], top: circlePos[1] }}
          >
            <div
              className="TouchInputHandler-SmallCircle"
              style={{
                left: pointerPos[0] - circlePos[0],
                top: pointerPos[1] - circlePos[1]
              }}
            ></div>
          </div>
        </>
      )}

      <div
        className="TouchInputHandler-Circle TouchInputHandler-Shoot"
        onMouseDown={onPressShoot}
        onMouseUp={onReleaseShoot}
        onMouseLeave={onReleaseShoot}
      ></div>
    </>
  );
};

export default TouchInputHandler;
