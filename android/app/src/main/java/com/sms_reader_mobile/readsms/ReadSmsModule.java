package com.sms_reader_mobile.readsms;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;

public class ReadSmsModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private BroadcastReceiver msgReceiver;
  private int listenerCount = 0;

  public ReadSmsModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return "ReadSms";
  }

  @ReactMethod
  public void checkPermissions(final Callback error) {
    try {
      if (!(ContextCompat.checkSelfPermission(reactContext, Manifest.permission.RECEIVE_SMS) == PackageManager.PERMISSION_GRANTED
        && ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED)) {
        error.invoke("Required RECEIVE_SMS and READ_SMS permission");
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void sendEvent(@Nullable WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("received_sms", params);
  }

  @ReactMethod
  public void addListener(String eventName) {
    if (listenerCount > 0) {
      listenerCount += 1;
      return;
    }
    try {
      msgReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
          sendEvent(getMessageFromMessageIntent(intent));
        }
      };
      String SMS_RECEIVED_ACTION = "android.provider.Telephony.SMS_RECEIVED";
      reactContext.registerReceiver(msgReceiver, new IntentFilter(SMS_RECEIVED_ACTION));
    } catch (Exception e) {
      e.printStackTrace();
    }
    listenerCount += 1;
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    listenerCount -= count;
    if (listenerCount != 0) {
      return;
    }
    try {
      if (reactContext != null && msgReceiver != null) {
        reactContext.unregisterReceiver(msgReceiver);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private WritableMap getMessageFromMessageIntent(Intent intent) {
    final Bundle bundle = intent.getExtras();
    WritableMap info2 = Arguments.createMap();
    try {
      if (bundle != null) {
        final Object[] pdusObj = (Object[]) bundle.get("pdus");
        if (pdusObj != null) {
          for (Object aPdusObj : pdusObj) {
            SmsMessage currentMessage = SmsMessage.createFromPdu((byte[]) aPdusObj);
            String sender = currentMessage.getDisplayOriginatingAddress();
            String body = currentMessage.getDisplayMessageBody();
            info2.putString("sender", sender);
            info2.putString("body", body);
            String tag = "ReadSmsModule";
            Log.d(tag, "Received sms: " + body);
          }
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return info2;
  }
}
