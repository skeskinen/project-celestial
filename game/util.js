import _ from 'lodash';

function deep(a, b, fn) {
  return deepM(_.cloneDeep(a), b, fn);
}

function deepM(a, b, fn) {
  return _.assignWith(a, b, (j, k) => {
    if(_.isObject(j) && _.isObject(k)) {
      return deepM(j, k, fn);
    }
    else if(_.isNumber(j) && _.isNumber(k)) {
      return fn(j, k);
    }
    else {
      return j !== undefined ? j : k;
    }
  });
}

export function deepSum(a, b) {
  return deep(a, b, (j, k) => j + k);
}

export function deepSubstraction(a, b) {
  return deep(a, b, (j, k) => j - k);
}

export function deepSumM(a, b) {
  return deepM(a, b, (j, k) => j + k);
}

export function deepSubstractionM(a, b) {
  return deepM(a, b, (j, k) => j - k);
}

export const ordinals = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
