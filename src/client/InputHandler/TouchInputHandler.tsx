import React, { useCallback, useState, useRef, useEffect } from 'react';
import './TouchInputHandler.css';
import { PlayerInputHandler, PlayerInputState } from 'state/types';
const TouchInputHandler: React.FC<{ handler: PlayerInputHandler }> = ({
  handler
}) => {
  const prevState = useRef<PlayerInputState | undefined>();
  const [circlePos, setCirclePos] = useState<[number, number] | undefined>();
  const [pointerPos, setPointerPos] = useState<[number, number]>([0, 0]);
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setCirclePos([e.clientX, e.clientY]);
    setPointerPos([e.clientX, e.clientY]);
  }, []);
  const onTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const e = event.changedTouches[0];
    if (!e) {
      return;
    }
    setCirclePos([e.clientX, e.clientY]);
    setPointerPos([e.clientX, e.clientY]);
  }, []);
  const onTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const e = event.changedTouches[0];
    if (!e) {
      return;
    }
    setPointerPos([e.clientX, e.clientY]);
  }, []);

  const onEndMovement = useCallback(() => {
    setCirclePos(undefined);
    handler({ left: false, right: false, up: false, down: false });
  }, [handler, setCirclePos]);
  const onPressShoot = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    handler({ shoot: true });
  };

  const onReleaseShoot = useCallback(() => {
    handler({
      shoot: false
    });
  }, [handler]);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setPointerPos([e.clientX, e.clientY]);
  }, []);
  useEffect(() => {
    if (!circlePos) {
      return;
    }
    const dx = pointerPos[0] - circlePos[0];
    const dy = pointerPos[1] - circlePos[1];
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
  }, [handler, circlePos, pointerPos]);
  return (
    <>
      <div
        className="TouchInputHandler-Movement"
        onMouseDown={onMouseDown}
        onMouseUp={onEndMovement}
        onMouseLeave={onEndMovement}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onEndMovement}
        onTouchMove={onTouchMove}
        onTouchCancel={onEndMovement}
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
        onTouchStart={onPressShoot}
        onTouchEnd={onReleaseShoot}
      ></div>
    </>
  );
};

export default TouchInputHandler;
