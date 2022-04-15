import { 
    View,
    Text,
    SafeAreaView
} from 'react-native'
import React, { useState } from 'react'


import { useNavigation } from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RegisterServer} from '../redux/store/actions'
import { 
  TextInput,
  Button,

} from 'react-native-paper';

export default function SettingsScreen(props) {
  const dispatch = useDispatch();
  const serverAddress = useSelector((state) => state.SettingsReducer.address);
  const [address, setAddress] = useState(serverAddress || '' );
  const navigation = useNavigation();

  const SaveSettings = () => {
    dispatch(RegisterServer(address));
    navigation.goBack();
  }

  return (
    <SafeAreaView>
      <Text>Data provider address</Text>
      <TextInput
        label="Server address"
        value={address}
        onChangeText={setAddress}
        type='outlined'
      />
      <Button
        mode='contained'
        onPress={SaveSettings}
      >
        Save  
      </Button>
    </SafeAreaView>
  )
}