import React, { useCallback, useState } from 'react';
import './TouchInputHandler.css';
import { PlayerInputHandler } from 'state/types';
const TouchInputHandler: React.FC<{ handler: PlayerInputHandler }> = ({
  handler
}) => {
  const [circlePos, setCirclePos] = useState<[number, number] | undefined>();
  const onStartMovement = useCallback(
    (e: React.MouseEvent) => {
      setCirclePos([e.clientX, e.clientY]);
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
  return (
    <>
      <div
        className="TouchInputHandler-Movement"
        onMouseDown={onStartMovement}
        onMouseUp={onEndMovement}
        onMouseLeave={onEndMovement}
      ></div>
      {circlePos && (
        <div
          className="TouchInputHandler-Circle"
          style={{ left: circlePos[0], top: circlePos[1] }}
        ></div>
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
