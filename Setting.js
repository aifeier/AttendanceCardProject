import React, {Component} from 'react'
import {Button, StyleSheet, Text, TextInput, ToastAndroid, View} from 'react-native'
import {MapView} from 'react-native-amap3d'
import {saveCompanyInfo} from './AppStorage'

export default class Setting extends Component {

    static navigationOptions = {
        title: '设置打卡范围',
    }

    constructor(props) {
        super(props)
        console.debug(props)
        console.debug(props.navigation.getParam('onResultBack'))
        this.state = {
            zoomLevel: 16,
            coordinate: {
                latitude: 30.278975,
                longitude: 120.145913,
            },
            //公司经纬度
            companyLL: {
                latitude: 0,
                longitude: 0,
                radius: 0,
            },
            companyLLStr: '地图点击设置公司位置',
        }
    }

    saveCompany() {
        if (null == this.state.companyLL || 0 >= this.state.companyLL.radius) {
            ToastAndroid.show('公司位置或考勤半径不能为空', ToastAndroid.SHORT)
            return
        }
        saveCompanyInfo(this.state.companyLL)
        this.props.navigation.pop()
        if (this.props.navigation.getParam('onResultBack'))
            this.props.navigation.getParam('onResultBack')(true)
    }

    _onPress(event, data) {
        console.debug(data.latitude + ':' + data.longitude)
        this.setState({
            companyLLStr: '(' + data.latitude + ',' + data.longitude + ')',
            companyLL: {
                latitude: data.latitude,
                longitude: data.longitude,
                radius: this.state.companyLL.radius,
            }
        })
    }

    _logPressEvent = ({nativeEvent}) => this._onPress('onPress', nativeEvent)

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.companyLLStr}</Text>
                <TextInput
                    style={{padding: 0}}
                    underlineColorAndroid="transparent"
                    placeholder={'输入考勤半径(米)'}
                    keyboardType={'numeric'}
                    maxLength={5}
                    onChangeText={text => this.setState({
                        companyLL: {
                            latitude: this.state.companyLL.latitude,
                            longitude: this.state.companyLL.longitude, radius: parseFloat(text)
                        }
                    })}
                />
                <Button title={'确认'} onPress={() => this.saveCompany()}></Button>
                <MapView style={styles.map}
                         zoomLevel={this.state.zoomLevel}
                         coordinate={this.state.coordinate}
                         locationEnabled={true}
                         showsLocationButton={true}
                         onPress={this._logPressEvent}
                         locationInterval={30000}>
                    <MyCircle
                        radius={this.state.companyLL.radius}
                        coordinate={this.state.companyLL}
                    />
                    <MapView.Marker
                        title="公司位置"
                        coordinate={this.state.companyLL}
                    />
                </MapView>
            </View>
        )
    }
}

class MyCircle extends Component {
    render() {
        return <MapView.Circle
            strokeWidth={1}
            strokeColor="rgba(255, 120, 0, 0.5)"
            fillColor="rgba(255, 120, 0, 0.5)"
            radius={this.props.radius}
            coordinate={this.props.coordinate}
        />
    }
}

const styles = new StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    checkBtn: {
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        fontSize: 14,
        color: 'white',
    },
})