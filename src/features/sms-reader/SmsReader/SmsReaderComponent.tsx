import {useEffect} from 'react';
import * as SmsReader from './SmsReader';

type Pattern = {
  sender: string;
  content?: string;
};
type Props = {
  patterns: Pattern[];
  children?: any;
};

const SMSReaderComponent = ({children, patterns}: Props) => {
  useEffect(() => {
    const startReadSMS = async () => {
      const hasPermission = await SmsReader.requestReadSMSPermission();
      if (hasPermission) {
        SmsReader.startReadSMS(event => {
          if (event.status === 'success') {
            matchAndSend(patterns, event.payload[0]);
          } else {
            console.error(event.error);
          }
        });
      }
    };
    startReadSMS();
    return () => SmsReader.stopReadSMS();
  }, [patterns]);
  return children;
};

function matchAndSend(patterns: Pattern[], message: {sender: string}) {
  Object.keys(message).forEach(sender => {
    const body = message[sender] as string;
    const matched = patterns.some(p => {
      const sameSender = p.sender.toLowerCase() === sender.toLowerCase();
      if (p.content) {
        return sameSender && body.includes(p.content);
      }
      return sameSender;
    });
    console.log(sender, matched);
  });
}

export default SMSReaderComponent;
