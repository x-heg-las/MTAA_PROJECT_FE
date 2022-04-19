import { View, Text,StyleSheet, SafeAreaView, FlatList, Modal, ScrollView } from 'react-native'
import React, {useState,useEffect, useCallback} from 'react'
import store from '../redux/store'
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyle from '../global/styles/GlobalStyles';
import {FAB, ToggleButton, Button, ActivityIndicator, Colors, Snackbar, Paragraph, Headline, Subheading, TextInput, Surface} from 'react-native-paper';
import {TicketCard} from '../components/TicketCard';
import {useSelector} from 'react-redux';
import {TICKETS} from '../assets/dummy_data';
import {getTickets} from '../api/apiCalls'

export default function DashboardScreen(props) {

    //const user = store.getState();
    const [filter, setFilter] = useState('pending');
    const [requests, setRequests] = useState(TICKETS);
    const [visible, setVisible] = useState(false);
    const [answerModal, setAnswerModal] = useState(false);
    const [answer, setAnswer] = useState('');
    const [openTicket, setOpenTicket] = useState(TICKETS[0]);
    const [pendingTickets, setPendingTickets] = useState([]);
    const [allTickets, setAllTickets] = useState([]);
    const [page, setPage] = useState(1);
    const user = useSelector(state => state.AuthReducer.userData)
    const [message, setMessage] = useState('');
    const [description, setDescription] = useState('');
    const serverAddress = useSelector(state => state.SettingsReducer.address);
    const fetchData = async () => {
        //const response = await getTickets(serverAddress);
    }
    
    useEffect(() => {
        console.log('effect calles');
        fetchData();
    }, [filter]);

    const onCreateTicket = data => {
        if(data) {
            setMessage("Ticket created");
            setVisible(data.created)
        }
    }

    const refreshList = () => {
        fetchData();
    }

    return (
        <SafeAreaView style={GlobalStyle.container}>
            <View style={[styles.inline, styles.header]}> 
                <ToggleButton.Group
                    style={styles.inline}
                    onValueChange={ value => setFilter(value)}
                    value={filter}
                >
                    <ToggleButton
                        status={filter === 'pending' ? 'checked' : 'unchecked'}
                        style={[styles.optionBtn, filter === 'pending' ? styles.active: null, GlobalStyle.toggleBtn]}
                        icon={() => <Text>Pending</Text>}
                        value='pending'>
                    </ToggleButton>
                    <ToggleButton
                        status={filter === 'all' ? 'checked' : 'unchecked'}
                        style={[styles.optionBtn, filter === 'all' ? styles.active: null, GlobalStyle.toggleBtn]}
                        icon={() => <Text>All</Text>} 
                        value='all'>
                    </ToggleButton>
                </ToggleButton.Group>
            </View>
            {
                <View>
                    <FlatList
                        data={requests}
                        renderItem={({item}) => <TicketCard item={item} onUpdate={refreshList} />}
                    />
                </View>
            }
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => {props.navigation.navigate("New Ticket", { onCreateTicket: onCreateTicket})}}
            />
            <Snackbar 
                visible={visible}
                duration={3000}
                onDismiss={() => {setMessage(""); setVisible(false)}}    
            >
                {message}
            </Snackbar>
           
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inline:{
        flexDirection: 'row',
     
    },
    optionBtn: {
        width: '50%'
    },
    active: {
        backgroundColor: '#4F56F2'
    },
    header:{
        
    },
    fab:{
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    answerField: {
        padding: 25,
        backgroundColor: 'white'
    }
})