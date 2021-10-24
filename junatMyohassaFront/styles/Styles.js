import { StyleSheet } from 'react-native'
import {Dimensions} from 'react-native';

export default StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        width: 300,
        height: 40,
        marginBottom: 1,
    },
    error_msg: {
        fontSize: 50,
        color: 'red'
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    txt:{
        color: 'red'
    },
    card:{

        width: Dimensions.get('window').width - 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

    }

});