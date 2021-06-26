import React from 'react';


// render this component as the dataComponent prop of a VictoryScatter component
const ArrowPoint = props => {
    
      const { x, y, datum, dataType } = props;
      // z is our direction in degrees
      const rotation = datum.z - 270;
      let fill = null;
      let size = null;

      // dataType specifies which data we are mapping so we can choose appropriate ranges for arrow sizes and colors
      if (dataType === 'wind speed') {
        fill = datum._y < 5 ? '#338333'
        : datum._y < 15 ? '#FF9900'
        : '#FF0000';
        size = datum._y * 3.5;
      }
      if (dataType === 'swell height') {
        fill = datum._y < 2 ? '#338333'
        : datum._y < 6 ? '#FF9900'
        : '#FF0000';
        size = datum._y * 10;
      }
      // line is flat so correct rotation by -90 so 0 degrees is north 

      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={`${size}`} height={`${size}`}  viewBox={`0 0 ${size} ${size}`} x={x - size/2} y={y- size/2} fill={fill} stroke={fill}>
      <defs>
      <marker id={`arrow${x}`} viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth="6" markerHeight="6"
          orient="auto-start-reverse" fill={fill} stroke='black' >
        <path d="M 0 0 L 5 5 L 0 10 z"/>
      </marker>
      </defs>
      <line x1='0' x2={`${size}`} y1={`${size/2}`} y2={`${size/2}`} strikeWidth='2' stroke={fill} fill={fill}  marker-end={`url(#arrow${x})`} transform={`rotate(${rotation} ${size/2} ${size/2})`}/>
      <circle cx='50%' cy='50%' r='1'/>
      </svg>
      );
    }
  
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
    const size=50;   
    const rotation = 10;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={`${size}`} height={`${size}`}  viewBox={`0 0 ${size} ${size}`} x={x - size/2} y={y- size/2} >
<line x1='0' x2={`${size}`} y1={`${size/2}`} y2={`${size/2}`} stroke='#000' fill="#000"  transform={`rotate(${rotation} ${size/2} ${size/2})`} />
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