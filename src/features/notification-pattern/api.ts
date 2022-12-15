import axios from 'axios';
import Config from 'react-native-config';

export type NotificationPattern = {
  id: string;
  beneficiaryId: string;
  sender: string;
  content?: string;
  createdAt: string;
};

export type SearchResult =
  | {
      status: 'ok';
      payload: NotificationPattern[];
    }
  | {status: 'error'; payload: void};

export function search({sessionToken}: {sessionToken?: string}) {
  return axios.post<SearchResult>(
    `${Config.SMS_READER_BACKEND}/pattern/search`,
    {sessionToken},
  );
}
