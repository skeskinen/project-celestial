import React, {} from 'react';

export const gameComponent = {
  height: '100%',
  width: '100%',
  userSelect: 'none',
  boxSizing: 'border-box',
  position: 'absolute',
};

export function wrap(width, height, left, top, elem, key, ref) {
  const style = {
    position: 'absolute',
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  };
  return (<div style={style} key={key} ref={ref}>
    {elem}
  </div>);
}

export function wrapEm(width, height, left, top, elem, key, ref) {
  const style = {
    position: 'absolute',
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}em`,
    height: `${height}em`,
  };
  return (<div style={style} key={key} ref={ref}>
    {elem}
  </div>);
}

export function wrapEmPos(width, height, left, top, elem, key, ref) {
  const style = {
    position: 'absolute',
    left: `${left}em`,
    top: `${top}em`,
    width: `${width}em`,
    height: `${height}em`,
  };
  return (<div style={style} key={key} ref={ref}>
    {elem}
  </div>);
}
