package com.attendancecardproject.nativeManager;

import android.content.Context;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chenwanfeng on 2018/5/3.
 */

public class NetWorkUtils extends ReactContextBaseJavaModule {
    public NetWorkUtils(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NetWorkUtils";
    }

    /*获取手机wifi*/
    @ReactMethod
    public void getWifiList(Promise promise) {
        WritableArray wifiList = Arguments.createArray();
        List<ScanResult> list = new ArrayList<>();
        try {
            WifiManager wifiManager = (WifiManager) getReactApplicationContext().getApplicationContext().getSystemService(Context.WIFI_SERVICE);
            // WIFI不可用，直接返回空列表
            if (WifiManager.WIFI_STATE_ENABLED != wifiManager.getWifiState()) {
                Log.d("Utils", "WIFI 不可用");
                promise.resolve(wifiList);
                return;
            }
            list = wifiManager.getScanResults();
            if (null == list) {
                list = new ArrayList<>();
            }
            for (ScanResult wifi : list) {
                Log.d("Utils", "WIFI SSID：" + wifi.SSID + " BSSID：" + wifi.BSSID);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        for (ScanResult result : list) {
            WritableMap map = Arguments.createMap();
            map.putString("BSSID", result.BSSID);
            map.putString("SSID", result.SSID);
            wifiList.pushMap(map);
        }
        promise.resolve(wifiList);
    }

    /*判断是否在公司wifi方位内*/
    @ReactMethod
    public void checkHasWifi(ReadableArray wifiList, ReadableArray companyWifiList, Callback callback) {

        if (null == companyWifiList || companyWifiList.size() == 0) {
            callback.invoke(false);
            return;
        }
        if (null == wifiList || wifiList.size() == 0) {
            callback.invoke(false);
            return;
        }
        for (int i = 0; i < wifiList.size(); i++) {
            ReadableMap map = wifiList.getMap(i);
            for (int j = 0; j < companyWifiList.size(); j++) {
                ReadableMap sourceMap = companyWifiList.getMap(j);
                if (map.getString("BSSID").equals(sourceMap.getString("BSSID"))) {
                    callback.invoke(true);
                    return;
                }
            }
        }
        callback.invoke(false);
    }
}
