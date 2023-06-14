import _cloneDeep from 'lodash.clonedeep';
import { Dispatch, Reducer, ReducerAction, ReducerState, useCallback, useReducer } from 'react';
import { Middleware } from '../providers/middlewares/types';

function useMiddlewaredReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  middlewares?: Middleware[],
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const [state, dispatch] = useReducer(reducer, _cloneDeep(initialState));

  const middlewaredDispatch = useCallback((action: ReducerAction<R>) => {
    if (middlewares && middlewares.length > 0) {
      middlewares.forEach(middleware => {
        if (typeof middleware === 'function') middleware(action);
      });
    }
    dispatch(action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [state, middlewaredDispatch];
}

export default useMiddlewaredReducer;
