import {NativeModules}
    from 'react-native'
/*使用原生Android代码*/
const {AAmpUtils} = NativeModules;

export type InCircleCallback = (inCircle: boolean) => void
export type converterCallback = (latlng: { latitude: Number, longitude: Number }) => void

/*为了方便的使用原生方法，将原生的方法再定义一次*/
export default {
    /*自定义方法名 :  需要传的参数（：有Promise就写，没有就不用）=> 原生方法名*/
    checkLLInCircle: (centerLat: Number, centerLong: Number, radius: Number, currentLat: Number, currentLong: Number, callBack: InCircleCallback) => AAmpUtils.checkLLInCircle(centerLat, centerLong, radius, currentLat, currentLong, callBack),
    LatLngConverterTOAAmp: (lat: Number, lng: Number, callBack: converterCallback) => AAmpUtils.LatLngConverterTOAAmp(lat, lng, callBack),
}
