import {useEffect} from 'react';
import * as SmsReader from './SmsReader';
import {logNotification} from '../api';

type Pattern = {
  id: string;
  sender: string;
  content?: string;
};
type Props = {
  beneficiaryId?: string;
  sessionToken?: string;
  patterns: Pattern[];
  children?: any;
};

const SMSReaderComponent = ({
  children,
  patterns,
  beneficiaryId,
  sessionToken,
}: Props) => {
  useEffect(() => {
    const startReadSMS = async () => {
      const hasPermission = await SmsReader.requestReadSMSPermission();
      if (hasPermission) {
        SmsReader.startReadSMS(event => {
          if (event.status !== 'success') {
            console.error(event.error);
            return;
          }
          if (!beneficiaryId || !sessionToken) {
            return;
          }
          matchAndSend({
            message: event.payload[0],
            patterns,
            beneficiaryId,
            sessionToken,
          });
        });
      }
    };
    startReadSMS();
    return () => SmsReader.stopReadSMS();
  }, [patterns, beneficiaryId, sessionToken]);
  return children;
};

function matchAndSend(params: {
  message: {sender: string; body: string};
  beneficiaryId: string;
  sessionToken: string;
  patterns: Pattern[];
}) {
  const {message, beneficiaryId, sessionToken, patterns} = params;
  const found = patterns.find(p => {
    const sameSender = p.sender.toLowerCase() === message.sender.toLowerCase();
    if (p.content) {
      return sameSender && message.body.includes(p.content);
    }
    return sameSender;
  });
  if (!found) {
    return;
  }
  logNotification({
    sessionToken,
    beneficiaryId,
    patternId: found.id,
    content: message.body,
  });
}

export default SMSReaderComponent;
