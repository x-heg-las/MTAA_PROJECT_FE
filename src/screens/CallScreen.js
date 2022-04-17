import React from 'react';
import { 
    View,
    Button,
    Text,
    SafeAreaView,
    StyleSheet,
    
} from 'react-native';
import {MediaStream, RTCView} from 'react-native-webrtc';
 
export const Controls = (props) => {
    return(
        <View style={styles.controls}>
            <Button title="hangup" onPress={props.hangup}/>
        </View>
    )
}

export const CallScreen = (props) => {

    if(props.localStream && !props.remoteStream) {
        return(
            <View style={styles.container}>
                <RTCView streamURL={props.localStream.toURL()} objectFit={'cover'} style={styles.video}/>
                <Controls hangup={props.hangup}/>
            </View>
        );
    }

    if(props.localStream && props.remoteStream) {
        return(
            <View style={styles.container}>
                <RTCView streamURL={props.remoteStream.toURL()} objectFit={'cover'} style={styles.video}/>
                <RTCView zOrder={1} streamURL={props.localStream.toURL()} objectFit={'cover'} style={styles.localVideo}/>
                <Controls hangup={props.hangup}/>
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.container}>
            <Controls hangup={props.hangup}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    controls: {
        flexDirection: 'row',
        bottom: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    video: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    localVideo: {
        position: 'absolute',
        width: 100,
        height: 160,
        alignSelf: 'center',
        zIndex:2,
        right: 10,
        top: 15,
        elevation: 10,
    },
    InnerVideo:{

    }
})