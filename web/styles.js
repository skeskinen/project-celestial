import React, {} from 'react';

export const gameComponent = {
  height: '100%',
  width: '100%',
  userSelect: 'none',
  boxSizing: 'border-box',
  position: 'absolute',
};

export function wrap(width, height, left, top, elem) {
  const style = {
    position: 'absolute',
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  };
  return (<div style={style}>
    {elem}
  </div>);
}

export function wrapEm(width, height, left, top, elem) {
  const style = {
    position: 'absolute',
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}em`,
    height: `${height}em`,
  };
  return (<div style={style}>
    {elem}
  </div>);
}
