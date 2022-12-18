import {useEffect} from 'react';
import * as SmsReader from './SmsReader';

const SMSReaderComponent = ({children}: {children?: any}) => {
  useEffect(() => {
    const startReadSMS = async () => {
      const hasPermission = await SmsReader.requestReadSMSPermission();
      if (hasPermission) {
        SmsReader.startReadSMS(event => {
          if (event.status === 'success') {
            console.log(event.payload);
          } else {
            console.error(event.error);
          }
        });
      }
    };
    startReadSMS();
    return () => SmsReader.stopReadSMS();
  }, []);
  return children;
};

export default SMSReaderComponent;
