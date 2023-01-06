import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';
import {
  IS_ANDROID,
  PERMISSION_GRANTED,
  PLATFORM_VERSION,
  READ_SMS_PERMISSION,
  RECEIVE_SMS_PERMISSION,
} from '../constants';
import type {StartReadSMS} from './types';

const hasSmsPermissions = async () => {
  if (IS_ANDROID && PLATFORM_VERSION < 23) {
    return true;
  }

  const currentPermissions = await Promise.all([
    PermissionsAndroid.check(RECEIVE_SMS_PERMISSION),
    PermissionsAndroid.check(READ_SMS_PERMISSION),
  ]);

  return currentPermissions.every(permission => permission === true);
};

export const startReadSMS: StartReadSMS = async (callback: any) => {
  if (!callback) {
    return;
  }

  if (!IS_ANDROID) {
    return callback({
      status: 'error',
      error: 'ReadSms Plugin is only for android platform',
    });
  }

  const hasPermission = await hasSmsPermissions();

  if (!hasPermission) {
    return callback({
      status: 'error',
      error: 'Required RECEIVE_SMS and READ_SMS permission',
    });
  }

  const emitter = new NativeEventEmitter(NativeModules.ReadSms);
  emitter.addListener('received_sms', (...payload) =>
    callback({status: 'success', payload}),
  );
};

export const requestReadSMSPermission = async () => {
  const hasPermission = await hasSmsPermissions();

  if (!IS_ANDROID || hasPermission) {
    return true;
  }

  const status = Object.values(
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]),
  );

  return status.every(st => st === PERMISSION_GRANTED);
};

export const stopReadSMS = () => {
  if (!IS_ANDROID) {
    return;
  }

  NativeModules.ReadSms.removeListeners(1);
};
