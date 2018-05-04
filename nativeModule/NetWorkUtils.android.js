import {NativeModules, requireNativeComponent}
    from 'react-native'
/*使用原生Android代码*/
const {NetWorkUtils} = NativeModules;
// export default NetWorkUtils;

export type Wifi = {
    BSSID: string,
    SSID: string,
}

export type Callback = (hasCompanyWifi: boolean) => void

/*为了方便的使用原生方法，将原生的方法再定义一次*/
export default {
    /*自定义方法名 :  需要传的参数（：有Promise就写，没有就不用）=> 原生方法名*/
    /*通过import NetWorkUtils.方法名 调用*/
    getWifiList: (): Promise<Wifi[]> => NetWorkUtils.getWifiList(),
    checkHasWifi: (wifiList: Array<Wifi>, companyWifiList: Array<Wifi>, callback: Callback) => NetWorkUtils.checkHasWifi(wifiList, companyWifiList, callback)
}


