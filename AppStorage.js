import {AsyncStorage, ToastAndroid} from 'react-native'

const companyLLKey = 'com.companyLL.key'

/*companyLL: {
    latitude: 0,
    longitude: 0,
    radius: 0,
},*/
export const saveCompanyInfo = (companyLL) => {
    AsyncStorage.setItem(companyLLKey, JSON.stringify(companyLL))
}

export const getCompanyLL = (callback = null) => {
    return AsyncStorage.getItem(companyLLKey, (error, string) => {
        console.debug(error)
        console.debug(JSON.parse(string))
        if (callback)
            callback(null == error, JSON.parse(string))
    })
}

