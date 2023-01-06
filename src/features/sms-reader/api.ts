import axios from 'axios';
import Config from 'react-native-config';

type Session = {sessionToken: string};

type LogParams = Session & {
  beneficiaryId: string;
  patternId: string;
  content: string;
};

export type LogResult = {
  status: 'ok' | 'error';
};

export function logNotification(params: LogParams) {
  return axios
    .post<LogResult>(`${Config.ALERTMOON_API}/notification/log`, params)
    .then(d => {
      if (d.data.status === 'ok') {
        return d.data;
      }
      return Promise.reject(d.data);
    });
}
