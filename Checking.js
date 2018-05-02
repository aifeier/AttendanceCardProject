import React, {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {MapView} from 'react-native-amap3d'
import AAmpUtils from './nativeModule/AAmpUtils'
import {getCompanyLL, saveCompanyInfo} from './AppStorage'

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
            zoomLevel: 10,
            coordinate: {
                latitude: 30.278975,
                longitude: 120.145913,
            },
            locationEnabled: true,
        }
    }

    _log(event, data) {
        // ToastAndroid.show(JSON.stringify(data, null, 2), ToastAndroid.SHORT)
        console.debug('定位成功：' + JSON.stringify(data, null, 2))
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

    }

    render() {
        return (
            <View style={styles.container}>
                <MapView style={{flex: 0}}
                         zoomLevel={this.state.zoomLevel}
                         coordinate={this.state.coordinate}
                         locationEnabled={this.state.locationEnabled}
                         locationInterval={30000}
                         onLocation={this._onLocation
                             // ToastAndroid.show('定位成功：' + JSON.stringify(nativeEvent, null, 2), ToastAndroid.SHORT)
                         }>
                </MapView>
                <View style={styles.checkBtnView}>
                    <Text style={styles.checkBtn} onPress={() => this._checking()}>
                        {this.state.checkText}
                    </Text>
                </View>
                <Text style={styles.countBtn} onPress={() => this.props.navigation.navigate('App')}>
                    {'统计'}
                </Text>
                <Text style={[styles.countBtn, {top: 350,}]} onPress={() => this.props.navigation.navigate('Setting')}>
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