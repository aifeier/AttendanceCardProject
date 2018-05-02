import {AppRegistry} from 'react-native';
import {StackNavigator} from 'react-navigation';
import App from './App';
import Checking from './Checking'
import Setting from './Setting'

const MainScreen = StackNavigator({
    CheckingScreen: Checking,
    App: {screen: App},
    Setting: Setting,
})

AppRegistry.registerComponent('AttendanceCardProject', () => MainScreen);
