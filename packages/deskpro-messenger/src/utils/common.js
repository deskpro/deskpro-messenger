import Immutable from 'immutable';

export const fromJSGreedy = (js) => {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ?
      Immutable.Seq(js).map(fromJSGreedy).toList() :
      Immutable.Seq(js).map(fromJSGreedy).toMap();
};

