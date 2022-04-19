import { View, StyleSheet, Modal, ScrollView } from 'react-native'
import React, {useEffect, useState} from 'react'
import {Card, Title, Text, IconButton, Button, TextInput,Headline, Subheading} from 'react-native-paper'
import {TICKETS} from '../assets/dummy_data'
import { STATUS_RESOLVED, STATUS_PENDING } from '../global/constants/Constants'
import GlobalStyle from '../global/styles/GlobalStyles';
import {AuthReducer, SettingsReducer} from '../redux/store/reducers';
import {useSelector} from 'react-redux';
import {getUsers, putTickets, deleteTickets} from '../api/apiCalls';


export function TicketCard({item, onUpdate}) {

    const serverAddress = useSelector(state => state.SettingsReducer.address);
    const loggedUser = useSelector(state => state.AuthReducer.userData);
    const [modalView, setModalView] = useState(false);

    console.log("tick tick" + item); 

    const canUpdate = () => {
        if(loggedUser && loggedUser.id === item.user) return true;
        return false;
    }

    const canDelete = () => {
        if(loggedUser && loggedUser.user_type__name) return true;
        if(loggedUser && loggedUser.id === item.user) return true;
        return false;
    }

    const canAnswer = () => {
        if(loggedUser && loggedUser.user_type__name) return true;
        if(loggedUser && loggedUser.user_type__name === 'support') return true;
        return false;
    }

    const closeModal = () => {
        setModalView(false);
    }

    const openModal = () => {
        
        setModalView(true);
    }

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

    const deleteTicket = async (id) => {
        const result = await deleteTickets(serverAddress,{id: id});
        if(result == null) {return;}//show something
        switch(result.status) {
            case 204:
                setModalView(false);
                onUpdate();
                break;
            case 404:
                setModalView(false);
        }
    }

    const CardModal = ({ticket}) => {
        const [owner, setOwner]  = useState({});
        const timestamp = new Date(ticket.updated_at).toString();
        
        const getUserData = async () => {
            const result = await getUsers(serverAddress, {id: ticket.user});
            if(result == null || result.items) {
                setOwner('Unknown');
            } else {
                setOwner(result.body);
            }
        }

        useEffect(() => {
            getUserData();
        },[ticket.id])

        const [answer, setAnswer] = useState(ticket.answer);
        const [description, setDescription] = useState(ticket.description);
        return(
            <Modal
            style={{width: '80%'}}
            animationType="slide"
            transparent={true}
            visible={modalView}
            onRequestClose={closeModal}
            >
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
                        disabled={(loggedUser && loggedUser.id === item.user)}
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
                    <Button onPress={closeModal}>Cancel</Button>
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
        </Modal>
        );
    }



    return (
        <Card>
            <Card.Content>
                <View style={[styles.container]}>
                    <View style={[styles.row]}>
                        <Text>{item.title}</Text>
                        <Text>{new Date(item.created_at).toDateString()}</Text>
                    </View>
                    <View  style={[styles.row]}>
                        <Text>Subject: {item.request_type__name}</Text>
                        <Text>Status: {item.answered_by_user ? STATUS_RESOLVED : STATUS_PENDING}</Text>
                    </View>
                    <View style={[GlobalStyle.inline, styles.controls]}>
                        <IconButton
                            icon="delete"
                            color={'red'}
                            size={20}
                            onPress={() => {deleteTicket(item.id)}}
                            disabled={!canDelete}
                        />
                        <IconButton
                            icon="pen"
                            color={'blue'}
                            size={20}
                            onPress={() => console.log('Pressed')}
                            disabled={!canUpdate}
                        />
                        <IconButton
                            icon="comment"
                            color={'black'}
                            size={20}
                            onPress={openModal}
                            disabled={!canAnswer}

                        />
                    </View>
                </View>
                <CardModal ticket={item}/>
            </Card.Content>
        </Card>
        
    )
}

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