import _ from 'lodash';

function deep(a, b, fn) {
  a = _.cloneDeep(a);
  return deepM(a, b, fn);
}

function deepM(a, b, fn) {
  return _.assignWith(a, b, (j, k) => {
    var oJ = _.isObject(j);
    var oK = _.isObject(k);
    if(oJ && oK)
      return deepSum(j, k);
    else if(!oJ && !oK)
      return fn(j, k);
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
