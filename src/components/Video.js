import { View, Text } from 'react-native'
import React from 'react'
import {MediaStream} from 'react-native-webrtc';

export default function Video(props) {
  return (
    <View>
      <RTCView streamURL={props.localStream.toURL()} objectFit='cover'/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    video: {
        position: 'absolute',
        width: '100%',
        height: '80%',
    }
})