package com.attendancecardproject.nativeManager;

import com.amap.api.maps.MapView;
import com.amap.api.maps.model.Circle;
import com.amap.api.maps.model.CircleOptions;
import com.amap.api.maps.model.LatLng;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
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
}
