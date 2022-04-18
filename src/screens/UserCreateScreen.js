import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import {Button, TextInput, Chip, Avatar, HelperText, Snackbar} from 'react-native-paper'
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import {SettingsReducer, AuthReducer} from '../redux/store/reducers'
import GlobalStyle from '../global/styles/GlobalStyles';
import {getUserTypes, postUsers, postFile} from '../api/apiCalls';
import {textValidator, passwordValidator} from '../validators';
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
    const [visible, setVisible] = useState(false);
    const [privilege, setPrivilege] = useState(null);
    const [privileges, setPrivileges] = useState([]);
    const [file, setFile] = useState(null);
    const serverAddress = useSelector(state => state.SettingsReducer.address);
    const userData = useSelector(state => state.AuthReducer.userData);

    const validateForm = () =>  {
        return (
            validatePassword() && 
            textValidator(username.trim()) && 
            textValidator(fullName.trim()) &&
            privilege != null
        )
    }

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

        if(!validateForm()) {
            setVisible(true);
            return;
        }

        
        const data = {
            "username": username.trim(),
            "profile_img_file": fileUpload,
            "user_type__name": privilege,
            "full_name": fullName.trim() || "",
            "phone_number": phoneNumber.trim(),
            "password": password.trim()
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

    const validatePassword = () => {
        return !passwordValidator(password.trim())
    }


    return (
       <ScrollView>
        <SafeAreaView style={GlobalStyle.container}>
            <View style={[styles.profileView, {flexDirection:'row'}]}>
                <View style={{flex: 1}}>
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
                        Add image
                    </Button>
                    {file && <Chip onClose={() => {setFile(null)}} onPress={() => {setFile(null)}}>{file[0].name}</Chip>}
                </View>
                <View style={[{flex: 1}, styles.imageView]}>
                    {
                        file ?
                        <Avatar.Image style={GlobalStyle.profileImage} size={120} source={{uri:file[0].uri}} />
                        :
                        <Avatar.Text style={GlobalStyle.profileImage} size={120} label={fullName.split(' ').map(w => w[0]).join('')} />
                    }
                </View>
            </View>
            <View>
                <TextInput
                    style={[GlobalStyle.form]}
                    mode='outlined'
                    label='Username'
                    value={username}
                    onChangeText={setUsername}
                />
                {
                    !textValidator(username.trim()) &&
                    <HelperText type='error' visible={true}>Username cannot be empty</HelperText>
                }

                <TextInput
                    style={[GlobalStyle.form]}
                    mode='outlined'
                    label='Password'
                    value={password}
                    onChangeText={setPassword}
                />
                {
                    validatePassword() &&
                    <HelperText type='error' visible={validatePassword()}>Password must have at least 8 characters</HelperText>
                }
                
                <TextInput
                    style={[GlobalStyle.form]}
                    mode='outlined'
                    label='Full name'
                    value={fullName}
                    onChangeText={setFullName}
                />
                {
                    !textValidator(fullName.trim()) &&
                    <HelperText type='error' visible={true}>Full name cannot be empty</HelperText>
                }
                <TextInput
                    style={[GlobalStyle.form]}
                    mode='outlined'
                    label='Phone Number'
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                
                <Dropdown
                    style={[styles.dropdown, GlobalStyle.form]}
                    data={privileges}
                    labelField='name'
                    valueField='name'
                    onChange={(value) => setPrivilege(value.name)}
                    placeholder="Privilege"
                />
                <HelperText type='error' visible={privilege == null}>You must assign privilege.</HelperText>
                <Button
                    style={styles.submitUser}
                    mode='contained'
                    onPress={submitUser}
                >
                    Submit
                </Button>
                <Snackbar
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    duration={3000}
                    action={{
                    label: 'Undo',
                    onPress: () => {
                        setVisible(false);
                    },
                    }}>
                    Fill in all required forms.
                </Snackbar>   
            </View>
        </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        borderColor: 'grey',
        borderWidth:1, 
        borderRadius:5,
        marginTop:5,
        paddingLeft: 15
    },
    submitUser: {
        marginTop:10,
    },
    profileView: {
        height: 120,
    },
    imageView:{
        flex:1,
        alignContent: 'center',
        justifyContent: 'center',
    }
})