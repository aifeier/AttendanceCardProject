import React, {Component} from 'react'
import {StyleSheet, Text, View, ToastAndroid, Alert, Platform} from 'react-native'
import {MapView} from 'react-native-amap3d'
import AAmpUtils from './nativeModule/AAmpUtils'
import {getCompanyLL, saveCompanyInfo} from './AppStorage'

import Setting from './Setting'
import NetWorkUtils from './nativeModule/NetWorkUtils'

export default class Checking extends Component {

    static navigationOptions = {
        title: '打卡',
    }

    companyLL = {
        latitude: 30.278975,
        longitude: 120.145913,
        radius: 1000,
    }

    constructor(props) {
        super(props)
        getCompanyLL((error, result) => {
            if (error && null == result) {
                //设置默认
                saveCompanyInfo({
                    latitude: this.companyLL.latitude,
                    longitude: this.companyLL.longitude,
                    radius: this.companyLL.radius
                })
            } else {
                this.companyLL = {
                    latitude: result.latitude,
                    longitude: result.longitude,
                    radius: result.radius
                }
            }
            // ToastAndroid.show('' + this.companyLL.radius, ToastAndroid.SHORT)
        })
        this.state = {
            checkText: '外勤',
            inWifi: false,
            zoomLevel: 10,
            coordinate: {
                latitude: 30.278975,
                longitude: 120.145913,
            },
            locationEnabled: true,
            companyWifis: [
                {
                    SSID: '30:fc:68:18:ac:1e',
                    BSSID: 'upsoft_yt',
                },
                {
                    SSID: 'upsoft_5g',
                    BSSID: '30:fc:68:18:ac:20',
                },
                {
                    SSID: '测试部test',
                    BSSID: '14:75:90:83:a8:8c',
                },
            ],
            android: Platform.OS == 'android',
            watchID: null,
        }
        this._checkWifi()
    }

    _checkWifi() {
        if (!this.state.android)
            return
        NetWorkUtils.getWifiList().then(wifis => {
            console.log(wifis)
            NetWorkUtils.checkHasWifi(wifis, this.state.companyWifis, (hasCompanyWifi) => {
                    console.log('是否在公司wifi范围：' + hasCompanyWifi)
                    if (hasCompanyWifi) {
                        this.setState({
                            checkText: 'WIFI打卡',
                            inWifi: true,
                        })
                    } else {
                        if (this.state.inWifi) {
                            this.setState({
                                checkText: '状态未知',
                                inWifi: false,
                            })
                        }
                    }
                }
            )
        })
    }

    _log(event, data) {
        // ToastAndroid.show(JSON.stringify(data, null, 2), ToastAndroid.SHORT)
        console.debug('定位成功：' + JSON.stringify(data, null, 2))
        if (this.state.inWifi)
            return
        if (data.latitude > 0 && data.longitude > 0) {
            this.setState({
                locationEnabled: false
            })
            this.setState({
                zoomLevel: 17,
                coordinate: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                },
                //半径
                radius: 100,
                // checkText: '(' + data.latitude + ',' + data.longitude + ')\n打卡'
            })
            AAmpUtils.checkLLInCircle(this.companyLL.latitude, this.companyLL.longitude, this.companyLL.radius
                , data.latitude, data.longitude
                , (result) => {
                    this.setState({
                        checkText: result ? '正常打卡' : '外勤'
                    })
                })
        }
    }

    _onLocation = ({nativeEvent}) => this._log('onLocation', nativeEvent)


    _checking() {
        fetch('http://www.baidu.com').then((response) => {
            // ToastAndroid.show(JSON.stringify(response), ToastAndroid.SHORT)
            Alert.alert('', '您的勤奋打败了0%的队友')
        })

    }

    componentDidMount() {
        console.debug('componentDidMount')
        // //初始化当前的位置
        // navigator.geolocation.getCurrentPosition((initialPosition) => {
        //         this._onGeoLocationSuccess(initialPosition)
        //     },
        //     (error) => alert(error.message),
        //     {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000})
        // // 监听
        // this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
        //     this._onGeoLocationSuccess(lastPosition)
        // })
        this.timer = setTimeout(() => {
            this._checkWifi()
        }, 60000)
    }

    _onGeoLocationSuccess(lastPosition) {
        if (this.state.inWifi)
            return
        AAmpUtils.LatLngConverterTOAAmp(lastPosition.coords.latitude, lastPosition.coords.longitude, (latlng) => {
            console.debug(lastPosition, latlng)
            this.setState({coordinate: latlng})
            AAmpUtils.checkLLInCircle(this.companyLL.latitude, this.companyLL.longitude, this.companyLL.radius
                , latlng.latitude, latlng.longitude
                , (result) => {
                    this.setState({
                        checkText: result ? '正常打卡' : '外勤'
                    })
                })
        })
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
        // if (this.watchID)
        //     navigator.geolocation.clearWatch(this.watchID)
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView style={{flex: 0}}
                         zoomLevel={this.state.zoomLevel}
                         coordinate={this.state.coordinate}
                         locationEnabled={this.state.locationEnabled}
                         locationInterval={10000}
                         onLocation={this._onLocation}>
                </MapView>
                <View style={styles.checkBtnView}>
                    <Text style={styles.checkBtn} onPress={() => this._checking()}>
                        {this.state.checkText}
                    </Text>
                </View>
                <Text style={styles.countBtn} onPress={() => this.props.navigation.push('App')}>
                    {'统计'}
                </Text>
                <Text style={[styles.countBtn, {top: 350,}]} onPress={() => this.props.navigation.push('Setting', {
                    onResultBack(changed) {
                        console.log('拿到返回值' + changed)
                        getCompanyLL((error, result) => {
                            if (error && null == result) {
                            } else {
                                this.companyLL = {
                                    latitude: result.latitude,
                                    longitude: result.longitude,
                                    radius: result.radius
                                }
                            }
                        })
                    },
                }, 'View')}>
                    {'设置'}
                </Text>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#fff',
    },
    checkBtnView: {
        marginTop: 100,
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: 'skyblue',
    },
    checkBtn: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        fontSize: 14,
        color: 'white',
    },
    countBtn: {
        position: 'absolute',
        top: 300,
        left: 20,
        right: 20,
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'skyblue',
        borderRadius: 5
    },

})