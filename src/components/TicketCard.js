import { View, StyleSheet, Modal, ScrollView } from 'react-native'
import React, {useEffect, useState} from 'react'
import {Card, Title, Text, IconButton, Button, TextInput,Headline, Subheading} from 'react-native-paper'
import {TICKETS} from '../assets/dummy_data'
import { STATUS_RESOLVED, STATUS_PENDING } from '../global/constants/Constants'
import GlobalStyle from '../global/styles/GlobalStyles';
import {AuthReducer, SettingsReducer} from '../redux/store/reducers';
import {useSelector} from 'react-redux';
import {getUsers, putTickets, deleteTickets} from '../api/apiCalls';


export function TicketCard({item, onUpdate, onClick}) {
    const serverAddress = useSelector(state => state.SettingsReducer.address);
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
    

    const deleteTicket = async (id) => {
        const result = await deleteTickets(serverAddress,{id: id});
        if(result == null) {return;}//show something
        switch(result.status) {
            case 204:
               
                onUpdate();
                break;
            case 404:
               
        }
    }

    



    return (
        <Card onPress={() => {onClick(item)} }>
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
                        
                    </View>
                </View>
                
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