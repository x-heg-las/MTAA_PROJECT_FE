import { 
    View,
    StyleSheet,
    SafeAreaView
} from 'react-native'
import React, { useState } from 'react'


import { useNavigation } from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RegisterServer} from '../redux/store/actions'
import { 
  TextInput,
  Button,
  Subheading
} from 'react-native-paper';
import {AuthReducer} from '../redux/store/reducers';
import GlobalStyle from '../global/styles/GlobalStyles'
import {moduleName} from '../api/apiCalls';

export default function SettingsScreen(props) {
  const dispatch = useDispatch();
  const serverAddress = useSelector((state) => state.SettingsReducer.address);
  const [address, setAddress] = useState(serverAddress || '' );
  const loggedUser = useSelector(state => state.AuthReducer.userData);
  const navigation = useNavigation();


  const SaveSettings = () => {
    dispatch(RegisterServer(address));
    navigation.goBack();
  }


  const onDeleteProfile = async () => {
    if(loggedUser == null || loggedUser.id == null) return
    const result = await deleteUsers(serverAddress, {id: loggedUser.id});
    if(result == null) return;
    switch(result.status) {
      default:
       dispatch(Logout());
    }
  }

  return (
    <SafeAreaView style={GlobalStyle.container}>
      <Subheading>Data provider address</Subheading>
      <TextInput
        label="Server address"
        value={address}
        onChangeText={setAddress}
        type='outlined'
        disabled={loggedUser != null}
      />
      <Button
        mode='contained'
        onPress={SaveSettings}
      >
        Save  
      </Button>
      {
        (loggedUser != null) && 
        <Button
        mode='contained'
        style={styles.removeBtn}
        onPress={onDeleteProfile}
      >
        Delete profile
      </Button>
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  removeBtn: {
    position: 'absolute',
    bottom:5,
    alignSelf: 'center',
    backgroundColor: 'red'
  }
})