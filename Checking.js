import React, {Component} from 'react'
import {Text, View, StyleSheet, ToastAndroid, Button} from 'react-native'
import {MapView} from 'react-native-amap3d'
import AAmpUtils from './nativeModule/AAmpUtils'

export default class Checking extends Component {

    static navigationOptions = {
        title: '打卡',
    }
    state = {
        checkText: '打卡',
        zoomLevel: 10,
        coordinate: {
            latitude: 30.278975,
            longitude: 120.145913,
        },
    }
    companyLL = {
        latitude: 30.278975,
        longitude: 120.145913,
        radius: 1000,
    }

    _log(event, data) {
        ToastAndroid.show('定位成功：' + JSON.stringify(data, null, 2), ToastAndroid.SHORT)
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

    _onLocation = ({nativeEvent}) => this._log('onLocation', nativeEvent)

    render() {
        return (
            <View style={styles.container}>
                <MapView style={{flex: 0}}
                         zoomLevel={this.state.zoomLevel}
                         coordinate={this.state.coordinate}
                         locationEnabled={true}
                         showsLocationButton={true}
                         locationInterval={10000}
                         onLocation={this._onLocation
                             // ToastAndroid.show('定位成功：' + JSON.stringify(nativeEvent, null, 2), ToastAndroid.SHORT)
                         }>
                </MapView>
                <View style={styles.checkBtnView}>
                    <Text style={styles.checkBtn}>
                        {this.state.checkText}
                    </Text>
                </View>
                <Text style={styles.countBtn} onPress={() => this.props.navigation.navigate('App')}>
                    {'统计'}
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