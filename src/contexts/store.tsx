import React, {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type FC
} from 'react';
import { reducer } from '../lib/store';
import { defaultState, type AppState } from '../lib/store/state';
import type { Action } from '../lib/store/action';

export const StoreContext = createContext<[AppState, Dispatch<Action>]>([
  defaultState(),
  s => s
]);

export const StoreProvider: FC<{ children?: React.ReactNode }> = ({
  children
}) => {
  const v = useReducer(reducer, defaultState());
  return <StoreContext.Provider value={v}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);
