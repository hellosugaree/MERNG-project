import React from 'react';


// render this component as the dataComponent prop of a VictoryScatter component
const ArrowPoint = props => {
  // props.datum is an object that contains a single data point that we can process to render however we want
  // format will be {x: <x value>, y: <main y value>, <supplementary data key>: <supplementary data value> } 
  // supplementary data keys can be 'period' for swell period, 'gust' for wind gust, 'direction' for wind or swell direction, etc
  const { x, y, dataKey, datum } = props;
  // console.log(datum.y);
  // props.x and props.y are positions of the data points rather than values themselves
  // console.log(datum);
  // console.log(data);
  // z is our direction in degrees
  // line is flat so correct rotation by -90 so 0 degrees is north 
  const rotation = datum.direction ? datum.direction - 270 : -270;

  let fill = null;
  let arrowLength = null;

  // use hsl hue to fade smoothly
  /*
  FOR WIND SPEED:
    0kt, 135 hue
    35kt  270 hue
    total range is 135 + (360-270) = 225
    wind speed range 35
    multiplier = 225/35 = 6.429
    hue shift = 5.626 * wind speed
      if hue shift is greater than 225, set it to 225 so we don't loop back to our start hue again
    hue = 135 (base hue) - hue shift
    if the hue is less than zero, subtract its absolute value from 360

  FOR SWELL HEIGHT:
    0ft 135 hue
    12ft 270 hue
    total range is 225
    swell height range is 15
    multiplier = 225/15 = 18.5

  */
  if (dataKey === 'windSpeed') {
    const baseHue = 135;
    const multiplier =  6.429;
    // max shift is 225
    const shift = datum[dataKey] * multiplier <= 225 ? datum[dataKey] * multiplier : 225;
    const hue = baseHue - shift >= 0 ? baseHue - shift : 360 - Math.abs(baseHue - shift);
    fill = `hsl(${hue}, 80%, 40%)`;
    arrowLength = datum[dataKey] * 1.5;
    // min and max arrow length
    if (arrowLength < 8) {
      arrowLength = 8;
    }
    if (arrowLength > 30 ) {
      arrowLength = 30;
    }
    // datum[dataKey] <= 5 ? 10 
    // : datum[dataKey] <= 10 ? 20
    // : datum[dataKey] <= 20 ? 30
    // : datum[dataKey] <= 30 ? 40
    // : 50;
  }
  if (dataKey === 'primarySwellHeight') {
    const baseHue = 135;
    const multiplier = 18.5;
    // max shift is 225
    const shift = datum[dataKey] * multiplier <= 225 ? datum[dataKey] * multiplier : 225;
    const hue = baseHue - shift >= 0 ? baseHue - shift : 360 - Math.abs(baseHue - shift);
    fill = `hsl(${hue}, 80%, 40%)`;
    arrowLength = datum[dataKey] * 4;
    // min and max arrow length
    if (arrowLength < 8) {
      arrowLength = 8;
    }
    if (arrowLength > 30 ) {
      arrowLength = 30;
    }
  }

  // we need a unique id for the arrowhead in the svg
  // const arrowId = dataType.split(' ')[0] + `${datum.x}`;
  const arrowId = `${datum.x},${Math.random()}`;

  return (
    <svg onMouseEnter={e=>console.log(props)}  xmlns="http://www.w3.org/2000/svg" width={`${arrowLength}`} height={`${arrowLength}`}  viewBox={`0 0 ${arrowLength} ${arrowLength}`} x={x - arrowLength/2} y={y - arrowLength/2} fill={fill} stroke={fill}>
      <defs>
        <marker id={arrowId} viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="4" markerHeight="4"
            orient="auto-start-reverse" fill={fill} stroke={'black'} >
          <path d="M 0 0 L 5 5 L 0 10 z"/>
        </marker>
      </defs>
      <line strokeWidth='0.8' x1='0' x2={`${arrowLength}`} y1={`${arrowLength/2}`} y2={`${arrowLength/2}`} stroke={fill} fill={fill} markerEnd={`url(#${arrowId})`} transform={`rotate(${rotation} ${arrowLength/2} ${arrowLength/2})`}/>
      <circle cx='50%' cy='50%' r='.8'/>
    </svg>
  );
}
  //strokeWidth='1px'
export default ArrowPoint;

/*
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" x={x-5} y={y-5} >
<line x1='0' x2='10' y1='5' y2='5' stroke='#000' fill="#000" />
<circle cx='5' cy='5' r='2' fill='#000' />
</svg>
    );



        const {x, y, datum} = this.props;
    const cat = datum._y >= 0 ? "😻" : "😹";
    const arrowLength=50;   
    const rotation = 10;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={`${arrowLength}`} height={`${arrowLength}`}  viewBox={`0 0 ${arrowLength} ${arrowLength}`} x={x - arrowLength/2} y={y- arrowLength/2} >
<line x1='0' x2={`${arrowLength}`} y1={`${arrowLength/2}`} y2={`${arrowLength/2}`} stroke='#000' fill="#000"  transform={`rotate(${rotation} ${arrowLength/2} ${arrowLength/2})`} />
<circle cx='50%' cy='50%' r='2' fill='#000' />
</svg>
    );
  }
}

    */



// class App extends React.Component {
//   render() {
//     return (
//       <VictoryChart>
//         <VictoryScatter
//           y={(d) =>
//             Math.sin(2 * Math.PI * d.x)
//           }
//           samples={25}
//           dataComponent={<CatPoint/>}
//         />
//       </VictoryChart>
//     );
//   }
// }
// ReactDOM.render(<App/>, mountNode);