import {createContext, useCallback} from 'react';
import useSwr from 'swr';
import {search} from './api';

export const PatternProvider = createContext({});

export function usePatternList({sessionToken}: {sessionToken?: string}) {
  const onSearch = useCallback(() => {
    return search({sessionToken});
  }, [sessionToken]);
  return useSwr('notification-pattern-list', onSearch);
}
