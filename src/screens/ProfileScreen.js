import {useSelector, useDispatch} from 'react-redux';
import {ToggleButton, Avatar, Button, IconButton, Headline, Text} from 'react-native-paper';
import { View, StyleSheet, SafeAreaView, FlatList} from 'react-native'
import {TicketCard} from '../components/TicketCard';
import React, { useState, useEffect } from 'react'
import GlobalStyle from '../global/styles/GlobalStyles';
import {AuthReducer, SettingsReducer} from '../redux/store/reducers'
import { getTickets, getFile, constructParams, getUsers } from '../api/apiCalls';
import {RNFS} from 'react-native-fs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Logout} from '../redux/store/actions'

export default function ProfileScreen({route, navigation}) {
    const [filter, setFilter] = useState('resolved');
    const [resolved, setResolved] = useState([]);
    const [pending, setPending] = useState([]);
    const [total, setTotal] = useState();
    const [userData, setUserData] = useState({});
    const serverAddress = useSelector(state => state.SettingsReducer.address);
    const loggedUser = useSelector(state => state.AuthReducer.userData);
    const [token, setToken] = useState(null)
    const dispatch = useDispatch();

    const fetchTickets = async () => {
        const response = await getTickets(serverAddress, {user_id: route.params.user_id});
        switch(response.status) {
            case 401:
                dispatch(Logout());
                break;
            case 200:
                console.log("ok");
                console.log(response.body)
                const allTickets = response.body.items;
                setResolved(allTickets.filter(e => e.answered_by_user != null));
                setPending(allTickets.filter(e => e.answered_by_user == null));
                setTotal(response.body.metadata.total);
        }
    }

    

    const fetchProfile = async () => {
        const response = await getUsers(serverAddress, {id: route.params.user_id});
        switch (response.status) {
            case 200:
                setUserData(response.body);
                break;
            case 404:
                break;
            case 401:
                dispatch(Logout());
                break;
            default:
        }
        setToken( await AsyncStorage.getItem("accessToken"));
        //setProfileimage(response);
    }

    useEffect(() => {
        fetchProfile();
        
    }, [route.params.user_id]);
    
    useEffect(() => {
        fetchTickets();
        const willFocusSubscription = navigation.addListener('focus', () => {
            console.log("focus");
            fetchTickets();
      });
  
      return willFocusSubscription;
  }, []);
  

    return (
        <SafeAreaView style={GlobalStyle.container}>
            <View style={styles.profileInfo}>
                <View style={[{flex:1, alignItems: 'center', justifyContent: 'space-evenly', verticalAlign: 'middle', backgroundColor: '#929c8e'}]}>
                <View style={[{flex: 1}, styles.imageView]}>
                    {
                        userData && userData.profile_img_file ?
                        <Avatar.Image style={GlobalStyle.profileImage} size={120} source={{
                            uri: `${serverAddress}/file/${constructParams({id: userData.profile_img_file})}`,
                            method: 'GET',
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        }} />
                        :
                        <Avatar.Text style={GlobalStyle.profileImage} size={120} label={userData.full_name?.split(' ').map(w => w[0]).join('')} />
                    }
                </View>
                    <View>
                        <Text>Username: {userData.username}</Text>
                        <Text>ID: {userData.id}</Text>
                        <Text>Phone number: {userData.phone_number}</Text>
                    </View>
                </View>
                <View style={[{flex:1, alignItems: 'center', justifyContent: 'space-evenly', verticalAlign: 'middle', backgroundColor: '#929c8e'}]}>
                        <View>
                            <Headline>{userData.full_name}</Headline>
                            {
                               ((loggedUser.id != userData.id)) &&
                                <Button 
                                    style={styles.callBtn} 
                                    onPress={() => {route.params.onCall(userData.username)}}
                                    mode='contained'>
                                        Call
                                    </Button>
                            }
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
                        style={[styles.optionBtn, filter === 'resolved' ? styles.active: null, GlobalStyle.toggleBtn]}
                        icon={() => <Text>Resolved</Text>}
                        value='resolved'>
                    </ToggleButton>
                    <ToggleButton
                        status={filter === 'pending' ? 'checked' : 'unchecked'}
                        style={[styles.optionBtn, filter === 'pending' ? styles.active: null, GlobalStyle.toggleBtn]}
                        icon={() => <Text>Pending</Text>} 
                        value='pending'>
                    </ToggleButton>
                </ToggleButton.Group>
            </View>
            <View style={{flex:1}}>
                <FlatList
                    data={filter == 'resolved' ? resolved : pending}
                    renderItem={({item}) => <TicketCard onClick={(ticket) => {navigation.navigate("Ticket Detail", {ticket: ticket})}} onUpdate={ fetchTickets} item={item} />}
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
    callBtn: {
        borderRadius: 20,
        backgroundColor: 'blue'
    }
})