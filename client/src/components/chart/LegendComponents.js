import React from 'react';


// renders an arrow for our legend
export const ArrowLegendComponent = props => {
  // these correspond to x and y svg coordinates of the component you are supposed to render, they are passed to this component by Victory automatically
  // we pass in a symbol to render for each legend component
  const { x, y, datum: { symbolToRender } } = props;

  if (symbolToRender === 'arrow') {
    const hues = [135, 100, 65, 30, 355, 320, 285, 270];
    const arrowLength = props.length ? props.length : 20;
    return (
      <svg  xmlns="http://www.w3.org/2000/svg" width={`${arrowLength}`} height={`${arrowLength}`}  viewBox={`0 0 ${arrowLength} ${arrowLength}`} x={x-arrowLength/2 - 2} y={y-arrowLength/2} fill="url(#gradient)" stroke="url(#gradient)">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="gradient" x1='0' x2={`${arrowLength}`} y1={`${arrowLength/2}`} y2={`${arrowLength/2}`} >
            {hues.map((hue, index) => <stop key={index} offset={`${100 / (hues.length - 1) * index}%`} stopColor={`hsl(${hue}, 80%, 40%)`} />)}
          </linearGradient>
          <marker id='arrow-point' viewBox="0 0 10 10" refX="5" refY="5"
              markerWidth="4" markerHeight="4"
              orient="auto-start-reverse" fill="hsl(270, 80%, 40%)" >
            <path d="M 0 0 L 5 5 L 0 10 z"/>
          </marker>
        </defs>
        <line strokeWidth='1' x1='0' x2={`${arrowLength}`} y1={`${arrowLength/2}`} y2={`${arrowLength/2}`}  stroke="url(#gradient)" markerEnd="url(#arrow-point)" />
        <circle cx='50%' cy='50%' r='.8' fill="url(#gradient)"/>
      </svg>
    );
  }

  if (symbolToRender === 'line') {
    const color = props.color ? props.color : 'lightgrey';
    const length = props.length ? props.length : 20;
  
    return (
      <svg  xmlns="http://www.w3.org/2000/svg" width={`${length}`} height={`${length}`}  viewBox={`0 0 ${length} ${length}`} x={x-length/2 -2} y={y-length/2} fill="url(#gradient)" stroke="url(#gradient)">
        <line strokeWidth='1' x1='5' x2={`${length}`} y1={`${length/2}`} y2={`${length/2}`} stroke={color} />
      </svg>
    );
  }
};







export const LineLegendComponent = props => {
  // these correspond to x and y svg coordinates of the component you are supposed to render, they are passed to this component by Victory automatically
  const { x, y } = props;
  const color = props.color ? props.color : 'lightgrey';
  const length = props.length ? props.length : 20;

  return (
    <svg  xmlns="http://www.w3.org/2000/svg" width={`${length}`} height={`${length}`}  viewBox={`0 0 ${length} ${length}`} x={x-length/2} y={y-length/2} fill="url(#gradient)" stroke="url(#gradient)">
      <line strokeWidth='1' x1='0' x2={`${length}`} y1={`${length/2}`} y2={`${length/2}`} stroke={color} />
    </svg>
  );
};


