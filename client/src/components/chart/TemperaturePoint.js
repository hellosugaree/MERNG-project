import React from 'react';
import { Circle } from 'victory';



const TemperaturePoint = ({ x, y, datum }) => {
  // dark blue at 0 or below (hue 243)
  // red at 100 or above
  // 243/100 = 2.43
  const hue = 243 - (datum.temperature * 2.43);
  if (hue < 0) {
    hue = 0;
  }
  if (hue > 243) {
    hue = 243
  }
  const fill = `hsl(${hue}, 100%, 36%)`;
  return <Circle style={{ fill }} cx={x} cy={y} r={2} />;
};

export default TemperaturePoint;