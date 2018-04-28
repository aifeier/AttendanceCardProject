import React, {Component} from 'react'
import {processColor, ScrollView, StyleSheet, Text, View} from 'react-native'
//https://github.com/wuxudong/react-native-charts-wrapper
import {PieChart} from 'react-native-charts-wrapper';
//https://github.com/skv-headless/react-native-scrollable-tab-view
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';

/*统计界面
* 2.0版本 第三方库绘制
* */


class CountApp extends Component {


    constructor(props) {
        super(props)
        var date = new Date()
        var weekday = new Array(7)
        weekday[0] = "星期天"
        weekday[1] = "星期一"
        weekday[2] = "星期二"
        weekday[3] = "星期三"
        weekday[4] = "星期四"
        weekday[5] = "星期五"
        weekday[6] = "星期六"
        this.state = {
            tabPosition: 1,
            titleStr: ['今天', '本周', '本月', '今年'],
            typeStr: ['病假', '事假', '出差', '出勤'],
            currentSumList: [3, 4, 10, 20],
            date: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + weekday[date.getDay()],
            legend: {
                enabled: true,
                textSize: 10,
                form: 'CIRCLE',
                position: 'RIGHT_OF_CHART',
                wordWrapEnabled: false,
                maxSizePercent: 50,
            },
            data: {
                dataSets: [{
                    values: [{value: 40, label: '出勤'},
                        {value: 2, label: '出差'},
                        {value: 3, label: '事假'},
                        {value: 1, label: '病假'}],
                    label: '',
                    config: {
                        colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C'), processColor('#8CEAFF')],
                        valueTextSize: 12,
                        valueTextColor: processColor('green'),
                        sliceSpace: 5,
                        selectionShift: 13
                    }
                }],
            },
            highlights: [{x: 2}],
            description: {
                text: props.pageName,
                textSize: 15,
                textColor: processColor('darkgray'),

            }
        }

    }

    render() {

        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text style={{padding: 20, textAlign: 'center', fontSize: 14}}>{this.state.date}</Text>
                    <View style={{
                        padding: 10,
                        marginLeft: 20,
                        marginRight: 30,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{fontSize: 14}}>当前在岗人员</Text>
                        <Text style={{fontSize: 16, color: 'dodgerblue'}}>34人</Text>
                    </View>
                    <View style={{
                        padding: 10,
                        marginLeft: 20,
                        marginRight: 30,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{fontSize: 14}}>今日迟到人数</Text>
                        <Text style={{fontSize: 16, color: 'dodgerblue'}}>2人</Text>
                    </View>

                    <View style={{alignItems: 'center'}}>
                        <PieChart
                            style={{width: 300, height: 300}}
                            logEnabled={true}
                            chartBackgroundColor={processColor('white')}
                            chartDescription={this.state.description}
                            data={this.state.data}
                            legend={this.state.legend}
                            entryLabelColor={processColor('green')}
                            entryLabelTextSize={10}
                            drawEntryLabels={false}
                            rotationEnabled={true}
                            rotationAngle={45}
                            usePercentValues={false}
                            holeRadius={0}
                            transparentCircleRadius={0}
                            maxAngle={350}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}


export default class CountAppSource extends Component {
    static navigationOptions = {
        title: '统计',
    }

    constructor() {
        super()
        this.state = {
            titleStr: ['今天', '本周', '本月', '今年'],
        }
    }


    render() {
        return (
            <ScrollableTabView
                initialPage={0}
                renderTabBar={() => <DefaultTabBar/>
                }
                tabBarBackgroundColor='#fff'
                tabBarActiveTextColor='#00bfff'
                tabBarInactiveTextColor='#333'
                tabBarUnderlineStyle={styles.tabBarUnderline}
            >
                <CountApp tabLabel={this.state.titleStr[0]} pageName={this.state.titleStr[0]}/>
                <CountApp tabLabel={this.state.titleStr[1]} pageName={this.state.titleStr[1]}/>
                <CountApp tabLabel={this.state.titleStr[2]} pageName={this.state.titleStr[2]}/>
                <CountApp tabLabel={this.state.titleStr[3]} pageName={this.state.titleStr[3]}/>
            </ScrollableTabView>
        )
    }
}


const styles = StyleSheet.create({
    tabBarUnderline: {
        backgroundColor: '#00bfff',
        height: 2,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 20,
        backgroundColor: 'white',
    },
    tabTitle: {
        flex: 1,
        maxHeight: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabItem: {
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
        backgroundColor: 'white',
        color: 'black',
        padding: 5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'dodgerblue',
    },
    tabItemSelected: {
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
        padding: 5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'dodgerblue',
        backgroundColor: 'dodgerblue',
        color: 'white',
    }
})