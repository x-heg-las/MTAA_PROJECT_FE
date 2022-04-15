import React from 'react';
import { 
    View,
    Button,
    Text,
    SafeAreaView,
    StyleSheet
} from 'react-native';


export const IncommingCallScreen = (props) => {

    return(
        <SafeAreaView style={styles.container}>
          
                <View style={styles.banner}>
                    <Text>placeholder for something , incomming call screen</Text>
                </View>
                <View style={styles.btnContainer}>
                    <Button style={{marginRight: 20}} title="take" onPress={props.join}/>
                    <Button style={{marginLeft: 20}} title="hangup" onPress={props.hangup}/>
                </View>
           
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    banner: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    btnContainer: {
        flexDirection: 'row',
        bottom: 40,
    }
})