import { View, Text, SafeAreaView } from 'react-native'
import React, {useState, useEffect} from 'react'
import {Button, TextInput} from 'react-native-paper'
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import {SettingsReducer, AuthReducer} from '../redux/store/reducers'
import {getUserTypes, postUsers, postFile} from '../api/apiCalls';
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isInProgress,
    types,
  } from 'react-native-document-picker';


export default function UserCreateScreen() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [privilege, setPrivilege] = useState('');
    const [privileges, setPrivileges] = useState([]);
    const [file, setFile] = useState(null);
    const serverAddress = useSelector(state => state.SettingsReducer.address);
    const userData = useSelector(state => state.AuthReducer.userData);

    const handleError = (err) => {
        if (DocumentPicker.isCancel(err)) {
          console.warn('cancelled')
          // User cancelled the picker, exit any dialogs or menus and move on
        } else if (isInProgress(err)) {
          console.warn('multiple pickers were opened, only the last will be considered')
        } else {
          throw err
        }
    }

    const submitUser = async () => {
        let fileUpload = null;
        if(file !== null) {
            const uploadResponse = await postFile(serverAddress, userData.username, userData.password, file[0]);
            console.log("Upload response"+uploadResponse);
            if(uploadResponse === null) {
                console.error("could not post file");
                return;
            } else {   
                fileUpload = uploadResponse.id;
            }
        }

        
        const data = {
            "username": username,
            "profile_img_file": fileUpload,
            "user_type__name": privilege,
            "full_name": fullName,
            "phone_number": phoneNumber,
            "password": password
        }
        console.log(data);
        postUsers(serverAddress, userData.username, userData.password, data);
        
    }

    useEffect(() => {
    console.log(JSON.stringify(file, null, 2))
    }, [file]) 

    
    const fetchData = async () => {
        const result = await getUserTypes(serverAddress, userData.username, userData.password);
        console.log(result.status);
        switch(result.status) {
            case 200:
                console.log("OK");
                setPrivileges(result.body.items);
                console.log(result.body.items)
        }

    }

    useEffect( () => {
       fetchData();
    }, []);


    return (
        <SafeAreaView>
            <View>
            <Button
                    mode='outlined'
                    icon='file'
                    onPress={async () => {
                        try {
                          const pickerResult = await DocumentPicker.pickSingle({
                            presentationStyle: 'fullScreen',
                            copyTo: 'cachesDirectory',
                          })
                          setFile([pickerResult])
                        } catch (e) {
                          handleError(e)
                        }
                      }}
                >
                    Upload a profile picture
                </Button>
            </View>
            <View>
                <TextInput
                    mode='outlined'
                    label='Username'
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    mode='outlined'
                    label='Password'
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    mode='outlined'
                    label='Full name'
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    mode='outlined'
                    label='Phone Number'
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                <Dropdown
                    data={privileges}
                    labelField='name'
                    valueField='name'
                    onChange={(value) => setPrivilege(value.name)}
                />
                <Button
                    mode='contained'
                    onPress={submitUser}
                >
                    Submit
                </Button>
            </View>
        </SafeAreaView>
    )
}