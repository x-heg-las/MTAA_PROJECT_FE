import React, {useState} from 'react';
import { 
    View,
    Button,
    Text,
    SafeAreaView,
    StyleSheet,
    
} from 'react-native';
import {MediaStream, RTCView, mediaDevices, registerGlobals} from 'react-native-webrtc';
import {FAB, Colors} from 'react-native-paper'; 
import InCallManager from 'react-native-incall-manager';


export const Controls = (props) => {
    const [mute, setMute] = useState(false);
  

    //Prevzate od: https://dipanshkhandelwal.medium.com/video-calling-using-firebase-and-webrtc-14cc2d4afceb
    const toggleMute = () => {
    
        props.localStream.getAudioTracks().forEach(track => {
          // console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
          track.enabled = !track.enabled;
          setMute(!track.enabled);
          console.log(mute);
        });
      };

    const switchCamera = () => {
        props.localStream.getVideoTracks().forEach(track => track._switchCamera());
    };

    
    return(
        <View style={styles.controls}>

            <FAB
                icon={mute ? 'microphone-off' : 'microphone'}
                color={'black'}
                style={styles.muteBtn}
                onPress={toggleMute}
            />
            <FAB
                icon='phone-hangup'
                color={'black'}
                onPress={props.hangup}
                style={styles.endCallBtn}
            />
       
            <FAB
                icon={'orbit-variant'}
                color="black"
                style={styles.cameraSwitchBtn}
                onPress={switchCamera}
            />
            
        </View>
    )
}

export const CallScreen = (props) => {
    const [speaker, setSpeaker] = useState(false);
     const switchAudio = () => {
        InCallManager.setSpeakerphoneOn(!speaker);
        setSpeaker(!speaker);      
    }

    
    if(props.localStream && !props.remoteStream) {
        return(
            <View style={styles.container}>
                 <FAB
                    icon={speaker ? 'speaker' : 'phone-in-talk'}
                    color={'black'}
                    style={styles.speakerphoneBtn}
                    onPress={switchAudio}
                />
                <RTCView streamURL={props.localStream.toURL()} objectFit={'cover'} style={styles.video}/>
                <Controls localStream={props.localStream} remoteStream={props.remoteStream} hangup={props.hangup}/>
            </View>
        );
    }

  
    if(props.localStream && props.remoteStream) {
        return(
            <View style={styles.container}>
                 <FAB
                    icon={speaker ? 'speaker' : 'phone-in-talk'}
                    color={'black'}
                    style={styles.speakerphoneBtn}
                    onPress={switchAudio}
                />
                <RTCView streamURL={props.remoteStream.toURL()} objectFit={'cover'} style={styles.video}/>
                <RTCView zOrder={1} streamURL={props.localStream.toURL()} objectFit={'cover'} style={styles.localVideo}/>
                <Controls localStream={props.localStream} remoteStream={props.remoteStream} hangup={props.hangup}/>
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

    },
    endCallBtn: {
        backgroundColor: 'red',
        bottom: 20,
        
    },
    muteBtn: {
        position: 'relative',
    },
    cameraSwitchBtn: {
        position: 'relative',
    },
    speakerphoneBtn: {
        position: 'absolute',
        top:15,
        left: 15,
       
        zIndex:2
    }
})