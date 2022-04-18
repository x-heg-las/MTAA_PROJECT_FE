import {useSelector} from 'react-redux';
import {ToggleButton, Avatar, Button, IconButton} from 'react-native-paper';
import { View, Text, StyleSheet, SafeAreaView, FlatList} from 'react-native'
import {TicketCard} from '../components/TicketCard';
import React, { useState, useEffect } from 'react'
import GlobalStyle from '../global/styles/GlobalStyles';
import {AuthReducer, SettingsReducer} from '../redux/store/reducers'
import { getTickets } from '../api/apiCalls';

export default function ProfileScreen({_userData}) {
    const [filter, setFilter] = useState('resolved');
    const [resolved, setResolved] = useState([]);
    const [pending, setPending] = useState([]);
    const [total, setTotal] = useState();
    const [profileImage, setProfileimage] = useState(null); 
    const userData = useSelector(state => state.AuthReducer.userData);
    const serverAddress = useSelector(state => state.SettingsReducer.address);

    const fetchTickets = async () => {
        const response = await getTickets(serverAddress, userData.username, userData.password, {user: userData.id, per_page: 20});
        switch(response.status) {
            case 401:
                console.error("err 401");

                return;
            case 200:
                console.log("ok");
                console.log(response.body)
                const allTickets = response.body.items;
                setResolved(allTickets.filter(e => e.answered_by_user != null));
                setPending(allTickets.filter(e => e.answered_by_user == null));
                setTotal(response.body.metadata.total);
        }


    }

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <SafeAreaView style={GlobalStyle.container}>
            <View style={styles.profileInfo}>
                <View style={[{flex:1, alignItems: 'center', justifyContent: 'space-evenly', verticalAlign: 'middle', backgroundColor: '#432312'}]}>
                <View style={[{flex: 1}, styles.imageView]}>
                    {
                        profileImage ?
                        <Avatar.Image style={GlobalStyle.profileImage} size={120} source={{uri:profileImage[0].uri}} />
                        :
                        <Avatar.Text style={GlobalStyle.profileImage} size={120} label={userData.full_name.split(' ').map(w => w[0]).join('')} />
                    }
                </View>
                    <View>
                        <Text>{userData.username}</Text>
                        <Text>ID: {userData.id}</Text>
                        <Text>Phone number: {userData.phone_number}</Text>
                    </View>
                </View>
                <View style={[{flex:1, alignItems: 'center', justifyContent: 'space-evenly', verticalAlign: 'middle', backgroundColor: '#432312'}]}>
                        <View>
                            <Text>{userData.full_name}</Text>
                            <View style={styles.inline}>
                                <Button style={styles.callBtn} mode='contained'>Call</Button>
                                <IconButton style={styles.cameraBtn} mode='contained' icon='camera'></IconButton>
                            </View>
                        </View>
                        <View>
                            <Text>Ticket created: {total}</Text>
                            <Text>Active tickets: {pending.length}</Text>
                            <Text>Resolved tickets: {resolved.length}</Text>
                        </View>
                </View>
            </View>
            <View style={styles.ticketsTab}>
            <View style={[styles.inline]}> 
                <ToggleButton.Group
                    style={styles.inline}
                    onValueChange={ value => setFilter(value || 'resolved')}
                    value={filter}
                >
                    <ToggleButton
                        status={filter === 'resolved' ? 'checked' : 'unchecked'}
                        style={[styles.optionBtn, filter === 'resolved' ? styles.active: null]}
                        icon={() => <Text>Resolved</Text>}
                        value='resolved'>
                    </ToggleButton>
                    <ToggleButton
                        status={filter === 'pending' ? 'checked' : 'unchecked'}
                        style={[styles.optionBtn, filter === 'pending' ? styles.active: null]}
                        icon={() => <Text>Pending</Text>} 
                        value='pending'>
                    </ToggleButton>
                </ToggleButton.Group>
            </View>
            <View style={{flex:1}}>
                <FlatList
                    data={filter == 'resolved' ? resolved : pending}
                    renderItem={({item}) =>{console.log(pending); return <TicketCard ticketData={item}/>}}
                />
            </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    profileInfo:{
        flex:2,
        flexDirection: 'row',
        verticalAlign: 'middle', 
        alignContent: 'space-around'
    },
    ticketsTab:{
        flex:3
    },
    profilePhoto:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
    },
    inline:{
        flexDirection: 'row',

    },
    optionBtn: {
        flex:1,
    },
    active: {
        backgroundColor: '#4F56F2'
    },
    cameraBtn:{
        backgroundColor: 'blue'
    },
    callBtn: {
        borderRadius: 20
    }
})