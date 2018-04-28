import {AppRegistry} from 'react-native';
import {StackNavigator} from 'react-navigation';
import App from './App';
import Checking from './Checking'

const MainScreen = StackNavigator({
    CheckingScreen:Checking,
    App: {screen: App}
})

AppRegistry.registerComponent('AttendanceCardProject', () => MainScreen);
