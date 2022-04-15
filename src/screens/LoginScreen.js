import React, { useState } from "react";
import { StyleSheet, View, Image, TextInput, Button, SafeAreaView } from "react-native";
import { useDispatch } from "react-redux";
import * as api from "../api/apiCalls"

export function LoginScreen(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch()
  const onLoginPressed = () => {
    //dispatch(Login(username, password));
    /*
    api.putUsers("http://192.168.1.21:8000", username, password, {id: 6, phone_number: "000"}).then(data => {
      console.log(data);
    });
    */
  }

  return (
  
      <View style={styles.container}>
          <TextInput
            placeholder="Username"
            style={styles.placeholder}
            onChangeText={(text) => {setUsername(text)}}
          ></TextInput>
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            style={styles.placeholder}
            onChangeText={(text) => {setPassword(text)}}
          ></TextInput>
          <Button
            title="LOGIN"
            style={styles.button}
            onPress={onLoginPressed}
          ></Button>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  placeholder: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 50,
    width: '80%',
    backgroundColor: "rgba(155,155,155,1)",
    borderRadius: 30,
    margin: 10,
    padding: 10,
  },

  button: {
    borderWidth: 1,
    width: '80%',
    borderRadius: 85,
    backgroundColor: "#000000",
  }
});

