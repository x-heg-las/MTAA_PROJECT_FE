import { View, Text,
    SafeAreaView,
    StyleSheet,
    ScrollView
} from 'react-native'
import GlobalStyle from '../global/styles/GlobalStyles'
import React, {useState, useEffect} from 'react'
import {Button, Checkbox, Chip, TextInput} from 'react-native-paper'
import { Dropdown } from 'react-native-element-dropdown';
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isInProgress,
    types,
  } from 'react-native-document-picker'
import {useSelector} from 'react-redux';
import { postFile, postTickets } from '../api/apiCalls';
import { SettingsReducer } from '../redux/store/reducers';


export default function TicketCreateScreen() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [callRequested, setCallRequested] = useState(false);
    const [file, setFile] = useState(null);
    const serverAddress =  useSelector(state => state.SettingsReducer.address);
    const userData =  useSelector(state => state.AuthReducer.userData);   

    const categories = [{id:1, name:'Technical'}];

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

    useEffect(() => {
    console.log(JSON.stringify(file, null, 2))
    }, [file])          
    
    useEffect(() => {
        //load categories

    }, []); 

    const submitTicket = async () => {
       
        //Validate entry 
        ///
        /////////////////////////////////
        
        //First send file if exists and wait for response

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
            "title": title,
            "user": userData.id,
            "request_type__name": category,
            "description": description,
            "call_requested": callRequested,
            "file": fileUpload
        }


        postTickets(serverAddress, userData.username, userData.password, data).then(response => {
            console.log(response);
            navigation.goBack();
        }).catch(err => {
            console.error(err);
        });
    }

    return (
        <View style={GlobalStyle.container}>
            <ScrollView style={[GlobalStyle.container, {height: '100%'}]}>
            <View>
                <TextInput
                    mode='outlined'
                    label='Title'
                    value={title}
                    onChangeText={setTitle}
                />
                <Dropdown
                    data={categories}
                    labelField='name'
                    valueField='id'
                    placeholder="Category"
                    onChange={(value) => setCategory(value.name)}
                />
                <TextInput
                    mode='outlined'
                    multiline
                    dense
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>
            <View style={[GlobalStyle.inline]}>
                <Button
                    mode='contained'
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
                    Upload a file
                </Button>
                <View style={GlobalStyle.inline}>
                <Checkbox
                     status={callRequested ? 'checked' : 'unchecked'}
                     onPress={() => {
                        setCallRequested(!callRequested);
                      }}
                />
                <Text>Call requested</Text>
                </View>
            </View>
            {file && <Chip onPress={() => {setFile(null)}}>{file[0].name}</Chip>}
            </ScrollView>
            <Button
                style={styles.submitTicketButton}
                mode='contained'
                onPress={submitTicket}
            >
                CREATE
            </Button>
        </View>
    )
}


const styles = StyleSheet.create({
    submitTicketButton:{
        
        alignSelf: 'center',
    }
});