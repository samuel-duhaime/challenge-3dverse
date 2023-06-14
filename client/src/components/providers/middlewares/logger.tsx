import { Reducer, ReducerAction } from 'react';
import { Middleware } from './types';

function Logger(): Middleware {
  return (action: ReducerAction<Reducer<any, any>>) => {
    // eslint-disable-next-line no-console
    console.log(action);
  };
}

export default Logger;
