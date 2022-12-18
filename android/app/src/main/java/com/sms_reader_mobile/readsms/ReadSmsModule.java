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
    private final String tag = "ReadSmsModule";

    public ReadSmsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "ReadSms";
    }

    @ReactMethod
    public void stopReadSMS() {
        try {
            if (reactContext != null && msgReceiver != null) {
                reactContext.unregisterReceiver(msgReceiver);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void startReadSMS(final Callback success, final Callback error) {
        try {
            if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.RECEIVE_SMS) == PackageManager.PERMISSION_GRANTED
                    && ContextCompat.checkSelfPermission(reactContext, Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED) {
                msgReceiver = new BroadcastReceiver() {
                    @Override
                    public void onReceive(Context context, Intent intent) {
                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("received_sms", getMessageFromMessageIntent(intent));
                    }
                };
                String SMS_RECEIVED_ACTION = "android.provider.Telephony.SMS_RECEIVED";
                reactContext.registerReceiver(msgReceiver, new IntentFilter(SMS_RECEIVED_ACTION));
                success.invoke("Start Read SMS successfully");
            } else {
                // Permission has not been granted
                error.invoke("Required RECEIVE_SMS and READ_SMS permission");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private WritableMap getMessageFromMessageIntent(Intent intent) {
        final Bundle bundle = intent.getExtras();
        WritableMap info2 = Arguments.createMap();
        HashMap<String, String> info = new HashMap();
        try {
            if (bundle != null) {
                final Object[] pdusObj = (Object[]) bundle.get("pdus");
                if (pdusObj != null) {
                    for (Object aPdusObj : pdusObj) {
                        SmsMessage currentMessage = SmsMessage.createFromPdu((byte[]) aPdusObj);
                        String sender = currentMessage.getDisplayOriginatingAddress();
                        String body = currentMessage.getDisplayMessageBody();
                        info.put(sender, body);
                        info2.putString(sender, body);
                        Log.d(tag, "Received sms: " + info);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return info2;
    }
}
