import { View, Text,
    SafeAreaView,
    StyleSheet,
    ScrollView
} from 'react-native'
import GlobalStyle from '../global/styles/GlobalStyles'
import React, {useState, useEffect} from 'react'
import {Button, Checkbox, Chip, TextInput, HelperText, Snackbar} from 'react-native-paper'
import { Dropdown } from 'react-native-element-dropdown';
import DocumentPicker, {
    DirectoryPickerResponse,
    DocumentPickerResponse,
    isInProgress,
    types,
  } from 'react-native-document-picker'
import {useSelector, useDispatch} from 'react-redux';
import { postFile, postTickets, getTicketTypes, getFileTypes } from '../api/apiCalls';
import { SettingsReducer } from '../redux/store/reducers';
import {passwordValidator, textValidator } from '../validators';

export default function TicketCreateScreen(props) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(null);
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [callRequested, setCallRequested] = useState(false);
    const [file, setFile] = useState(null);
    const [fileformats, setFileformats] = useState([]);
    const serverAddress =  useSelector(state => state.SettingsReducer.address);
    const userData =  useSelector(state => state.AuthReducer.userData);   
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch()


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

    const loadCategories = async () => {
        const result  = await getTicketTypes(serverAddress);
        if(result === null) return;
        switch (result.status) {
            case 401:
                dispatch(Logout());
                break;
            case 404:
                setVisible(true);
                break;
            case 200:
                setCategories(result.body.items);
                break;
            default:
        };

        const filetypes = await getFileTypes(serverAddress);
        if(filetypes === null) return;
        switch (result.status) {
            case 401:
                dispatch(Logout());
                break;
            case 404:
                setVisible(true);
                break;
            case 200:
                setFileformats(filetypes.body.items);
                break;
            default:
        };
    }

    useEffect(() => {
    console.log(JSON.stringify(file, null, 2))
    }, [file])          
    
    useEffect(() => {
        //load categories
        loadCategories();
    }, []); 

    
    //Validate entry 
    const validateForm = () => {
        return(
            textValidator(title.trim(), {length_min: 3}) && 
            textValidator(description.trim()) &&
            category != null
        );
    }
    /////////////////////////////////
    
    const submitTicket = async () => {
       
       if(!validateForm()) {
        setVisible(true);
        return;
       } 
        


        //First send file if exists and wait for response

        let fileUpload = null;
        if(file !== null) {
            const uploadResponse = await postFile(serverAddress, file[0]);
            if(uploadResponse == null) return;
            switch(uploadResponse.status){
                case 401:
                    dispatch(Logout());
                    break;
                case 404:
                    break;
                default:
            }
            console.log("Upload response"+uploadResponse);
            if(uploadResponse === null) {
                console.error("could not post file");
                return;
            } else {   
                fileUpload = uploadResponse.body.id;
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


        postTickets(serverAddress, data).then(response => {
            console.log(response);
    
            props.route.params.onCreateTicket({created: true});
            switch(response.status){
                case 201:
                    console.log(response);
                    props.navigation.goBack();
                    props.route.params.onCreateTicket({created: true});
                    break;
                case 401:
                    dispatch(Logout());
                    break;
                case 404:
                    setVisible(true);
                    break;
                default: 
            }
        }).catch(err => {
            console.error(err);
        });
    }

    return (
        <View style={GlobalStyle.container}>
            <ScrollView style={[GlobalStyle.container, {height: '100%'}]}>
            <View>
                <TextInput
                    style={[styles.form]}
                    dense
                    mode='outlined'
                    label='Title'
                    value={title}
                    onChangeText={setTitle}
                    maxLength={120}
                />
                {
                    !textValidator(title.trim(), {length_min: 3}) && 
                    <HelperText type='error' visible={true}>Title must be at least 3 characters long</HelperText>
                }
                <Dropdown
                    style={[styles.dropdown, styles.form]}
                    data={categories}
                    value={category}
                    labelField='name'
                    valueField='id'
                    placeholder="Select category"
                    onChange={(value) => {setCategory(value.name)}}
                />
                {
                    (category == null) &&
                    <HelperText type='error' visible={true}>Please select category</HelperText>
                }
                <TextInput
                    style={[styles.form]}
                    mode='outlined'
                    multiline
                    dense
                    label="Description"
                    value={description}
                    onChangeText={setDescription}
                    maxLength={32000}
                />
                {
                    !textValidator(description.trim()) && 
                    <HelperText type='error' visible={true}>Please fill in description</HelperText>
                }
            </View>
            <View style={[GlobalStyle.inline, {paddingTop: 10}]}>
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
                <View style={[GlobalStyle.inline, {alignItems:'center'}]}>
                <Checkbox
                     status={callRequested ? 'checked' : 'unchecked'}
                     onPress={() => {
                        setCallRequested(!callRequested);
                      }}
                />
                <Text>Call requested</Text>
                </View>
            </View>
            <HelperText type='info' visible={true}>Supported file formats: {fileformats.map(e => "."+e.name).join(", ")}</HelperText>
            {file && <Chip onClose={() => {setFile(null)}} onPress={() => {setFile(null)}}>{file[0].name}</Chip>}
            </ScrollView>
            <Button
                style={styles.submitTicketButton}
                mode='contained'
                onPress={submitTicket}
            >
                CREATE TICKET
            </Button>
            <Snackbar
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    duration={3000}
                    action={{
                    label: 'Close',
                    onPress: () => {
                        setVisible(false);
                    },
                    }}>
                    Fill in all required forms.
                </Snackbar>   
        </View>
    )
}


const styles = StyleSheet.create({
    submitTicketButton:{
        alignSelf: 'center',
    },
    dropdown: {
        borderColor: 'grey',
        borderWidth:1, 
        borderRadius:5,
        marginTop:5,
        paddingLeft: 15
    },
    form:{
        minHeight: 60,  
    }
});