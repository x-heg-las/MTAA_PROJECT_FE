import {Modal, Text, TextInput, Subheading, Button, Headline} from 'react-native-paper';
import {View, ScrollView, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {AuthReducer, SettingsReducer} from '../redux/store/reducers';
import {getUsers} from '../api/apiCalls';

export const TicketModal = ({ticket, onUpdate}) => {
    if(ticket == null) return null;
    const [owner, setOwner]  = useState({});
    const timestamp = new Date(ticket.updated_at).toString();
    const [modalView, setModalView] = useState(false);
    const serverAddress = useSelector(state => state.SettingsReducer.address);
    const loggedUser = useSelector(state => state.AuthReducer.userData);

    useEffect(() => {
        setModalView(visible);
        console.log("rendering modal")
    }, [visible]);

    const submitChanges = async (id, question, answer) => {
        const data = {
            id: id,
            description: question,
            answer: answer
        };
        const result = await putTickets(serverAddress, data);
        if(result == null) {return;} //show something
        switch(result.status) {
            case 200:
                setModalView(false);
                onUpdate();
                break;
        }

    }

    useEffect(() => {
        getUserData();
    }, [ticket.id]);

    const canUpdate = () => {
        if(loggedUser && loggedUser.id === ticket.user) return true;
        return false;
    }

    const canAnswer = () => {
        if(loggedUser && loggedUser.user_type__name) return true;
        if(loggedUser && loggedUser.user_type__name === 'support') return true;
        return false;
    }
    
    const getUserData = async () => {
        const result = await getUsers(serverAddress, {id: ticket.user});
        if(result == null || result.items) {
            setOwner('Unknown');
        } else {
            setOwner(result.body);
        }
    }

   

    const [answer, setAnswer] = useState(ticket.answer);
    const [description, setDescription] = useState(ticket.description);
    
    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(64, 64, 64, 0.5)', paddingTop: 25}}>
         <ScrollView
            contentContainerStyle={styles.answerField}
         >
            <View>
                <Headline>{ticket.title}</Headline>
                <TextInput
                    mode='outlined'
                    dense
                    multiline={true}
                    value={ticket.description}
                    style={styles.textInpuField}
                    disabled={(loggedUser && loggedUser.id === ticket.user)}
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
                    value={ticket.answer}
                    onChangeText={setAnswer}
                    disabled={!canAnswer()}
                ></TextInput>
                <Button onPress={onRequestClose}>Cancel</Button>
                {
                    (canUpdate() || canAnswer()) &&
                    <Button
                        onPress={() => { 
                            submitChanges(ticket.id, description, answer)
                        }}
                    >Submit</Button>
                }
            </View>
            </ScrollView>
        </View>
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
        backgroundColor: 'white'
    },
    textInpuField: {
        fontSize:14
    }
})