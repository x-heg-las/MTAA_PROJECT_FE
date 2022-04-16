import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {LoginScreen} from '../screens/LoginScreen'
import { Init, Logout } from '../redux/store/actions'
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, Menu, Button, TextInput } from 'react-native-paper';
import  SettingsScreen  from '../screens/SettingsScreen'
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import UserCreateScreen from '../screens/UserCreateScreen';
import TicketCreateScreen from '../screens/TicketCreateScreen';
import {CallUtils} from '../utils/CallUtils';
import {CallScreen} from '../screens/CallScreen';
import firestore from '@react-native-firebase/firestore';
import {AuthReducer} from '../redux/store/reducers';
import { IncommingCallScreen } from '../screens/IncommingCallScreen';
import {
    MediaStream,
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
} from 'react-native-webrtc'

const Stack = createNativeStackNavigator();

const NavigationBar = ({user, navigation, back}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true); 
    const closeMenu = () => setMenuVisible(false);
    const userData = useSelector(state => state.AuthReducer.userData);
    const dispatch = useDispatch();
    useEffect(() => {
        return closeMenu();    
    }, []);

 
    return(
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack}/> : null}
            { user? <Appbar.Content></Appbar.Content> : <Appbar.Content title="Tech Support"/>}
            <Menu 
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                    <Appbar.Action icon="menu" color="white" onPress={openMenu}/>
                }
            >
            <View style={{ flex: 1 }}>
                {
                    userData && 
                    <View>
                        <Menu.Item title="Profile" onPress={() => { 
                            navigation.navigate("Profile");
                            closeMenu();
                        }}/>
                        <Menu.Item title="My organisation"/> 
                    </View>
                }
                {
                    (userData && userData.user_type__name === 'admin') &&
                    <View>
                        <Menu.Item onPress={() => {navigation.navigate("New User")}} title="Add user"/>
                    </View>
                }
                <Menu.Item onPress={() => {
                    navigation.push("Settings");
                    closeMenu();
                }} title="Settings" />
                {
                    userData && 
                    <Menu.Item onPress={() => {dispatch(Logout())}} title="Logout"/>
                }
                <Menu.Item title="About {not yet :D}"/>
            </View>
            </Menu>
        </Appbar.Header>
    )
} 

export const AuthStack = (props) => {
    return(
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                header: (props) => <NavigationBar {...props}/>,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
}

export const AppStack = (props) => {

    const userData = null;

    return(
        <Stack.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                header: (props) => <NavigationBar user={userData} {...props}/>,
            }}
        >
            <Stack.Screen name="Dashboard" component={DashboardScreen}/>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="New Ticket" component={TicketCreateScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="New User" component={UserCreateScreen} />
        </Stack.Navigator>
    )
}

const RootNavigator = (props) => {
    const [gettingCall, setGettingCall] = useState(false);
    const token = useSelector(state => state.AuthReducer.authToken);
    const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
    const dispatch = useDispatch();
    const userData = useSelector(state => state.AuthReducer.userData);
    const pc = useRef();
    const connecting = useRef(false);
    //streams
    const [peer, setPeer] = useState();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    //========

    const init = () => {
        dispatch(Init());
    }

    useEffect(() => {
        //init();

        if(true) {

            const cRef = firestore().collection('meet').doc('chatId');  

            const subscribe = cRef.onSnapshot(snapshot => {
                const data = snapshot.data();

                //starts call on answer
                if(pc.current && !pc.current.remoteDesription && data && data.answer) {
                    pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                }

                if(data && data.offer && !connecting.current) {
                    setGettingCall(true);
                }
            });

            
            const subscribtionDelete = cRef.collection('callee').onSnapshot(s => {
                s.docChanges().forEach((change) => {
                    if(change.type == 'removed') {
                        hangup();
                    }
                });
            });
            return () => {
                subscribe();
                subscribtionDelete();
            }
     }

    }, []);



    const setupWebrtc = async () => {
        pc.current = new RTCPeerConnection(configuration);
        const stream = await CallUtils.getStream();
        if(stream) {
            setLocalStream(stream);
            pc.current.addStream(stream);
        }

        pc.current.onaddstream = (event) => {
            setRemoteStream(event.stream);
        }

    }

    const collectIceCandidates = async (cRef, localName, remoteName) => {
        const candidateCollection = cRef.collection(localName);
        if(pc.current) {
            pc.current.onicecandidate = (event) => {
                if(event.candidate) {
                    candidateCollection.add(event.candidate);
                }
            }
        }
        cRef.collection(remoteName).onSnapshot(snapshot => {
           snapshot.docChanges().forEach((change) => {
                if(change.type == 'added') {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.current?.addIceCandidate(candidate);
                }
           })
        })
    }

    const create = async (caller = 'caller', callee = 'callee', chatId = 'chatId') => {
        if (chatId === null) { return }

        console.log("Calling ");
        connecting.current = true;
        await setupWebrtc();
        const cRef = firestore().collection("meet").doc('chatId');
        //TODO : change local name
        collectIceCandidates(cRef, 'caller', 'callee');
        
        //collectIceCandidates(cRef, caller, callee);
        if(pc.current) {
            
            //store the offer under the document
            const offer = await pc.current.createOffer();
            pc.current.setLocalDescription(offer);

            const cWithOffer = {
                offer : {
                    type: offer.type,
                    sdp: offer.sdp,
                   
                },
            };
            cRef.set(cWithOffer);
        }
    }

    const join = async (chatId = 'chatId') => {
        console.log("Joining call");
        connecting.current = true;
        setGettingCall(false);
        const cRef = firestore().collection('meet').doc('chatId');
        const offer = (await cRef.get()).data()?.offer;
        if(offer) {
            await setupWebrtc();
            collectIceCandidates(cRef,  'callee', 'caller');

            if(pc.current) {
                 pc.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.current.createAnswer();
                pc.current.setLocalDescription(answer);
                const cWithAnswer = {
                    answer: {
                        type: answer.type,
                        sdp: answer.sdp,
                    },
                };
                cRef.update(cWithAnswer).catch(e => console.error("rejectt"));
            }
        }
    }

    const hangup = async () => {
        setGettingCall(false);
        connecting.current = false;
        streamCleanup();
        firestoreCleanup('caller', 'callee', peer);
        if(pc.current) {
            pc.current.close();
        }
    };

    const streamCleanup = async () => {
        if(localStream) {
            localStream.getTracks().forEach(t => t.stop());
            localStream.release();
        }
        setLocalStream(null);
        setRemoteStream(null);
    }

    const firestoreCleanup = async (caller = 'caller', callee = 'callee' , chatId = 'chatId') => {
        const cRef = firestore().collection('meet').doc('chatId');
        if(cRef) {
            const calleeCandidate = await cRef.collection('callee').get();
            calleeCandidate.forEach(async (c) => {
                await c.ref.delete();
            });
            const callerCandidate = await cRef.collection('caller').get();
            callerCandidate.forEach(async (c) => {
                await c.ref.delete();
            });
            cRef.delete();
        }
    }

    if(localStream) {
        return(
            <CallScreen hangup={hangup} localStream={localStream} remoteStream={remoteStream}/>
        )
    }


    if(gettingCall){
        
      
        return (
           <IncommingCallScreen join={join} hangup={hangup}/>
        )
    }

 
    return (
        
        <NavigationContainer>
            <Button onPress={create}>calll</Button>
            <TextInput title="peer" onChangeText={setPeer}></TextInput>
            {
                (token !== null && gettingCall) && 
                <></>
            }
            {
                token === null ?
                <AuthStack/> : <AppStack/>
            }
        </NavigationContainer>
    );
}

export default RootNavigator;
