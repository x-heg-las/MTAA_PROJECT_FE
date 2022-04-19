import {Modal, Text, TextInput, Subheading, Button, Headline} from 'react-native-paper';
import {View, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {AuthReducer, SettingsReducer} from '../redux/store/reducers';
import {getUsers, putTickets} from '../api/apiCalls';

export  default function TicketDetailScreen({route, navigation}) {;
    const [owner, setOwner]  = useState({});
    const timestamp = new Date(route.params.ticket.updated_at).toString();
    const serverAddress = useSelector(state => state.SettingsReducer.address);
    const loggedUser = useSelector(state => state.AuthReducer.userData);


    const submitChanges = async (id, question, answer) => {
        const data = {
            id: id,
            description: question,
            answer: answer,
            answered_by_user: loggedUser.id
        };
        const result = await putTickets(serverAddress, data);
        if(result == null) {return;} //show something
        switch(result.status) {
            case 200:
                navigation.goBack();
                break;
        }

    }

    useEffect(() => {
        getUserData();
        
    }, [route.params.ticket.id]);

    const canUpdate = () => {
        if(loggedUser && loggedUser.id === route.params.ticket.user) return true;
        return false;
    }

    const canAnswer = () => {
        if(loggedUser && loggedUser.user_type__name) return true;
        if(loggedUser && loggedUser.user_type__name === 'support') return true;
        return false;
    }
    
    const getUserData = async () => {
        const result = await getUsers(serverAddress, {id: route.params.ticket.user});
        if(result == null || result.items) {
            setOwner('Unknown');
        } else {
            setOwner(result.body);
        }
    }

   

    const [answer, setAnswer] = useState(route.params.ticket.answer);
    const [description, setDescription] = useState(route.params.ticket.description);
    
    return(
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
         <ScrollView
            contentContainerStyle={styles.answerField}
         >
            <View>
                <Headline>{route.params.ticket.title}</Headline>
                <TextInput
                    mode='outlined'
                    dense
                    multiline={true}
                    value={route.params.ticket.description}
                    style={styles.textInpuField}
                    disabled={(route.params.ticket.answer != null) ||(loggedUser && loggedUser.id !== route.params.ticket.user)}
                    onChangeText={setDescription}
                >
                </TextInput>
                <Text>From : {owner.username} on  {timestamp}</Text>
                <Subheading>Answer</Subheading>
                <TextInput
                    mode='outlined'
                    style={styles.textInpuField}
                    dense
                    placeholder="This question is not answered yet."
                    multiline={true}
                    value={route.params.ticket.answer}
                    onChangeText={setAnswer}
                    disabled={!canAnswer()}
                ></TextInput>
                <Button onPress={() => navigation.goBack()}>Cancel</Button>
                {
                    (canUpdate() || canAnswer()) &&
                    <Button
                        onPress={() => { 
                            submitChanges(route.params.ticket.id, description, answer)
                        }}
                    >Submit</Button>
                }
            </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    row:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    container:{
        flexDirection: 'column'
    },
    controls: {
        direction: 'ltr',
        justifyContent: 'flex-end',
    },
    modalView:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
    },
    answerField: {
        padding: 25,
     
    },
    textInpuField: {
        fontSize:14
    }
})