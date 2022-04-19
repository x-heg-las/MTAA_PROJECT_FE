import { View,StyleSheet, SafeAreaView, FlatList, Modal, ScrollView } from 'react-native'
import React, {useState,useEffect, useCallback} from 'react'
import store from '../redux/store'
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyle from '../global/styles/GlobalStyles';
import {FAB, ToggleButton, Button, ActivityIndicator, Colors, Snackbar, Paragraph, Headline, Subheading, TextInput, Surface, Text} from 'react-native-paper';
import {TicketCard} from '../components/TicketCard';
import {useSelector} from 'react-redux';
import {TICKETS} from '../assets/dummy_data';
import {getTickets} from '../api/apiCalls';
import {TicketModal} from '../components/TicketModal';

export default function DashboardScreen(props) {

    //const user = store.getState();
    const [filter, setFilter] = useState('pending');
    const [requests, setRequests] = useState([]);
    const [visible, setVisible] = useState(false);
    const [pendingTickets, setPendingTickets] = useState([]);
    const [resolvedTickets, setResolvedTickets] = useState([]);
    const [ticket, setTicket] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const user = useSelector(state => state.AuthReducer.userData)
    const [message, setMessage] = useState('');
    const serverAddress = useSelector(state => state.SettingsReducer.address);
    
    useEffect(() => {
        fetchData();
        const willFocusSubscription = props.navigation.addListener('focus', () => {
            console.log("focus");
            fetchData();
      });
  
      return willFocusSubscription;
  }, []);

    const fetchData = async () => {
        const response = await getTickets(serverAddress);
        if(response === null) return
        switch(response.status) {
            case 401:
                dispatch(Logout());
                break;
            case 200:
                console.log("ok");
                console.log(response.body)
                const allTickets = response.body.items;
                let resolved = []; let pending = [];
                allTickets.forEach(e => {
                    if(e.answered_by_user !== null) {
                        resolved.push(e);
                    } else {
                        pending.push(e);
                    }
                });
                setPendingTickets(pending);
                setResolvedTickets(resolved);
                if(filter === 'resolved') {
                    setRequests(resolved);
                } else {
                    setRequests(pending);
                }
        }
    }
    
    useEffect(() => {
        fetchData();
    }, []);

    const showModal = () =>{
        setModalVisible(true);
    }

    const onCreateTicket = data => {
        if(data) {
            setMessage("Ticket created");
            setVisible(data.created)
        }
    }

    const refreshList = () => {
        fetchData();
    }

    const applyFilter = (value) => {
        setFilter(value);
        if(value === 'resolved') {
            setRequests(resolvedTickets);
        } else {
            setRequests(pendingTickets);
        }
    }

    return (
        <SafeAreaView style={GlobalStyle.container}>
            <View style={[styles.inline, styles.header]}> 
                <ToggleButton.Group
                    style={styles.inline}
                    onValueChange={applyFilter}
                    value={filter}
                >
                    <ToggleButton
                        status={filter === 'pending' ? 'checked' : 'unchecked'}
                        style={[styles.optionBtn, filter === 'pending' ? styles.active: null, GlobalStyle.toggleBtn]}
                        icon={() => <Text>Pending</Text>}
                        value='pending'>
                    </ToggleButton>
                    <ToggleButton
                        status={filter === 'resolved' ? 'checked' : 'unchecked'}
                        style={[styles.optionBtn, filter === 'resolved' ? styles.active: null, GlobalStyle.toggleBtn]}
                        icon={() => <Text>Resolved</Text>} 
                        value='resolved'>
                    </ToggleButton>
                </ToggleButton.Group>
            </View>
            {
                <View>
                    <FlatList
                        data={requests}
                        renderItem={({item}) => <TicketCard onClick={(ticket) => {props.navigation.navigate("Ticket Detail", {ticket: ticket})}} onUpdate={fetchData} item={item} />}
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