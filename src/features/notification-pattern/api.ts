import axios from 'axios';
import Config from 'react-native-config';

type Session = {sessionToken?: string};

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

export function search(params: Session) {
  return axios
    .post<SearchResult>(`${Config.ALERTMOON_API}/pattern/search`, params)
    .then(d => {
      if (d.data.status === 'ok') {
        return d.data;
      }
      return Promise.reject(d.data);
    });
}

type CreateParams = Session & Pick<NotificationPattern, 'sender' | 'content'>;
type CreateResult =
  | {
      status: 'ok';
      payload: NotificationPattern;
    }
  | {status: 'error'; payload: void};

export function createPattern(params: CreateParams) {
  return axios.post<CreateResult>(
    `${Config.ALERTMOON_API}/pattern/create`,
    params,
  );
}

type EditParams = Session &
  Pick<NotificationPattern, 'sender' | 'content'> & {
    patternId: NotificationPattern['id'];
  };

export function editPattern(params: EditParams) {
  return axios.post<{status: 'ok' | 'error' | 'not_found'}>(
    `${Config.ALERTMOON_API}/pattern/update`,
    params,
  );
}

type ListConfidantsParams = Session & {patternId: NotificationPattern['id']};
export type Confidant = {
  patternId: NotificationPattern['id'];
  confidantEmail: string;
};
type ListConfidantsResult =
  | {
      status: 'ok';
      payload: Confidant[];
    }
  | {status: 'error'; payload: void};

export function listConfidants(params: ListConfidantsParams) {
  return axios.post<ListConfidantsResult>(
    `${Config.ALERTMOON_API}/pattern/list-confidants`,
    params,
  );
}

type GrantAccessParams = Session & {
  patternId: NotificationPattern['id'];
  confidantEmail: string;
};

export function grantAccess(params: GrantAccessParams) {
  return axios.post<any>(
    `${Config.ALERTMOON_API}/pattern/grant-access`,
    params,
  );
}

export function revokeAccess(params: GrantAccessParams) {
  return axios.post<any>(
    `${Config.ALERTMOON_API}/pattern/revoke-access`,
    params,
  );
}
