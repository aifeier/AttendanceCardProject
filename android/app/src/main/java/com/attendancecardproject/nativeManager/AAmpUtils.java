package com.attendancecardproject.nativeManager;

import android.util.Log;

import com.amap.api.maps.CoordinateConverter;
import com.amap.api.maps.MapView;
import com.amap.api.maps.model.Circle;
import com.amap.api.maps.model.CircleOptions;
import com.amap.api.maps.model.LatLng;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.IllegalViewOperationException;

/**
 * Created by chenwanfeng on 2018/4/28.
 */

public class AAmpUtils extends ReactContextBaseJavaModule {
    private MapView tempMapView;
    private Circle circle;

    public AAmpUtils(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AAmpUtils";
    }

    /*判断定位点是否在原内*/
    @ReactMethod
    public void checkLLInCircle(double centerLat, double centerLong, double radius, double currentLat, double currentLong, Callback onResult) {
        try {
            if (null == tempMapView)
                tempMapView = new MapView(getReactApplicationContext());
            if (null == circle)
                circle = tempMapView.getMap().addCircle(new CircleOptions());
            circle.setCenter(new LatLng(centerLat, centerLong));
            circle.setRadius(radius);
            onResult.invoke(circle.contains(new LatLng(currentLat, currentLong)));
        } catch (IllegalViewOperationException exception) {
            exception.printStackTrace();
        }
    }

    /*转换GPS坐标系到高德坐标系*/
    @ReactMethod
    public void LatLngConverterTOAAmp(double lat, double lng, Callback callback) {
        CoordinateConverter converter = new CoordinateConverter(getReactApplicationContext());
        // CoordType.GPS 待转换坐标类型
        converter.from(CoordinateConverter.CoordType.GPS);
        // sourceLatLng待转换坐标点 DPoint类型
        LatLng latLng = new LatLng(lat, lng);
        converter.coord(new LatLng(lat, lng));
        // 执行转换操作
        LatLng converterLatLng = converter.convert();
        Log.d("AAmpUtils", "原坐标：(" + latLng.latitude + "," + latLng.longitude
                + ") 转换后的坐标：(" + converterLatLng.latitude + "," + converterLatLng.longitude + ")");
        WritableMap map = Arguments.createMap();
        map.putDouble("latitude", converterLatLng.latitude);
        map.putDouble("longitude", converterLatLng.longitude);
        callback.invoke(map);
    }
}
