import { useReducer, useMemo, useCallback } from 'react';
import { ICmd } from './types';
import { cmdInput, ISuggestion, ICmdInput } from '../input';

interface IState {
  value: string;
  index: number;
  suggestions: Array<ISuggestion>;
  input: ICmdInput;
}

type Action = {
  type: 'UPDATE';
  updates: Partial<{ value: string; index: number }>;
};

const reducer = (state: IState, action: Action) => {
  switch (action.type) {
    case 'UPDATE':
      state.input.update(action.updates);

      return {
        ...state,
        ...action.updates,
        suggestions: state.input.suggestions,
      };
    default:
      return state;
  }
};

interface IUpdates {
  index?: number;
  value?: string;
}

const useInput = (
  cmds: Record<string, ICmd>,
): [Omit<IState, 'input'>, (updates: Action['updates']) => void] => {
  const input = useMemo(() => cmdInput(cmds), [cmds]);

  const [state, dispatch] = useReducer(reducer, {
    value: '',
    index: 0,
    input,
    suggestions: input.suggestions,
  });

  const update = useCallback((updates: IUpdates) => dispatch({ type: 'UPDATE', updates }), [
    dispatch,
  ]);

  return [
    {
      value: state.value,
      index: state.index,
      suggestions: state.suggestions,
    },
    update,
  ];
};

export default useInput;
