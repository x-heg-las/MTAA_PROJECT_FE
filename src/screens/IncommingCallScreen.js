import React, {useEffect} from 'react';
import { 
    View,
   
    Text,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import {Title, FAB} from 'react-native-paper';
import InCallManager from 'react-native-incall-manager';

export const IncommingCallScreen = (props) => {

    useEffect(() => {
        InCallManager.setSpeakerphoneOn(true);
        InCallManager.startRingtone('_BUNDLE_');

        return () => {
            InCallManager.stopRingtone();
            InCallManager.setSpeakerphoneOn(false);
        }
    }, []);

    return(
        <SafeAreaView style={styles.container}>
          
                <View style={styles.banner}>
                    <Title>Incomming call</Title>
                </View>
                <View style={styles.btnContainer}>
                    <FAB style={{marginRight: 20, backgroundColor:'green'}} 
                        icon="phone"
                        onPress={props.join}/>
                    <FAB
                        style={{marginLeft: 20, backgroundColor: 'red'}}
                        title="hangup"
                        icon="phone-off"
                        onPress={props.hangup}/>
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