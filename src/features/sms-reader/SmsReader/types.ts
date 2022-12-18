type StartReadSMSCallback = (
  event:
    | {
        status: 'success';
        payload: any;
      }
    | {
        status: 'error';
        error: string | Object;
      },
) => void;
export type StartReadSMS = (callback?: StartReadSMSCallback) => void;
