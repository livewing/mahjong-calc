import {
  type Dispatch,
  type FC,
  createContext,
  useContext,
  useReducer
} from 'react';
import type React from 'react';
import { reducer } from '../lib/store';
import type { Action } from '../lib/store/action';
import { type AppState, defaultState } from '../lib/store/state';

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
