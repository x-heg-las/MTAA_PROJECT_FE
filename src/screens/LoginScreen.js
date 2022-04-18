import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, TextInput, SafeAreaView } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getTokens, getUsers } from "../api/apiCalls"
import { Init, Login } from "../redux/store/actions"


export function LoginScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const dispatch = useDispatch()  
  const serverAddress = useSelector(state => state.SettingsReducer.address);
  
  useEffect(() => {
    //dispatch(Init());
  }, [])

  const onLoginPressed = async () => {

    getTokens(serverAddress, username, password).then(response => {
      //console.log("\n\n\n" + JSON.stringify(response.body, null, 2) + "\n\n\n");
      if(response.status === 200) {

        dispatch(Login(response, password));
        getUsers(serverAddress);
      }
    });
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
            mode='contained'
            style={styles.button}
            onPress={onLoginPressed}
          >LOGIN</Button>
          <Snackbar
            visible={showWarning}
            onDismiss={() => {setShowWarning(false)}}
            >
            {message}
            </Snackbar>
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
    backgroundColor: "green",
  }
});

