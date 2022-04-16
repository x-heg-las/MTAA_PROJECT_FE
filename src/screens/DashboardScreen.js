import { View, Text,StyleSheet, SafeAreaView, FlatList } from 'react-native'
import React, {useState,useEffect, useCallback} from 'react'
import store from '../redux/store'
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyle from '../global/styles/GlobalStyles';
import {FAB, ToggleButton, ActivityIndicator, Colors, Snackbar} from 'react-native-paper';
import {TicketCard} from '../components/TicketCard';
import {useSelector} from 'react-redux';

export default function DashboardScreen(props) {

    //const user = store.getState();
    const [filter, setFilter] = useState('pending');
    const [requests, setRequests] = useState([]);
    const [visible, setVisible] = useState(false);
    const user = useSelector(state => state.AuthReducer.userData)

    useEffect(() => {
        console.log('effect calles');
    }, [filter]);

    const onCreateTicket = data => {
        setVisible(data.created)
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
                        style={[styles.optionBtn, filter === 'pending' ? styles.active: null]}
                        icon={() => <Text>Pending</Text>}
                        value='pending'>
                    </ToggleButton>
                    <ToggleButton
                        status={filter === 'all' ? 'checked' : 'unchecked'}
                        style={[styles.optionBtn, filter === 'all' ? styles.active: null]}
                        icon={() => <Text>All</Text>} 
                        value='all'>
                    </ToggleButton>
                </ToggleButton.Group>
            </View>
            {

                <View>
                    <FlatList
                        data={[]}
                        renderItem={TicketCard}
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
                onDismiss={() => setVisible(false)}    
            >
                Ticket created
            </Snackbar>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inline:{
        flexDirection: 'row',
        flex:1,
    },
    optionBtn: {
        flex:1,
    },
    active: {
        backgroundColor: '#4F56F2'
    },
    header:{
        
        marginBottom: 50,
    },
    fab:{
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    }
})