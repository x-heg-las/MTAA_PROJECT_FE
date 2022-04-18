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
} from 'react-native-webrtc';


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
                            navigation.navigate("Profile", {user_id: userData.id});
                            closeMenu();
                        }}/>
                        <Menu.Item title="My organisation"/> 
                    </View>
                }
                {
                    //(userData && userData.user_type__name === 'admin') &&
                    <View>
                        <Menu.Item onPress={() => {
                                navigation.navigate("New User");
                                closeMenu();
                            }} 
                            title="Add user"/>
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

    const [gettingCall, setGettingCall] = useState(false);
    const configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
    const dispatch = useDispatch();
    const userData = useSelector(state => state.AuthReducer.userData);
    const pc = useRef();
    const connecting = useRef(false);
    //streams
    const [peer, setPeer] = useState();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callRoom, setCallroom] = useState(null);
    const [currentChatId, setCurrentChatId] = useState('');
    //========

    const init = () => {
        dispatch(Init());
    }

    useEffect(() => {
        //init();
        const roomId = Math.random().toString(36).substring(0,12);
        if(true) { 

            //const cRef = firestore().collection('meet').doc('chatId');
             
            const cRef = firestore().collection(userData.username);            
            const subscribtionDelete = firestore().collection('meet').doc(callRoom).collection('callee').onSnapshot(s => {
                s.docChanges().forEach((change) => {
                    if(change.type == 'removed') {
                        hangup();
                    }
                    console.warn("toto niee");
                    setCallroom(null);
                });
                
            });

            const subscribeSignaling = firestore().collection(userData.username).onSnapshot(snapshot => {
                snapshot.docChanges().forEach( async (change) => {
                    if(change.type == 'added' || change.type == 'update') {
                        let data = change.doc.data();
                        setCallroom(data.room);
                        startListener(data.room);
                        startRemoveListener(data.room)
                        return;
                    }
                })
            });

            return () => {
                subscribeSignaling();
                subscribtionDelete();
            }
     }

    }, []);


    const startListener = async (roomId) => {
        const subscribtionDelete = firestore().collection('meet').doc(roomId).onSnapshot(snapshot => {
        
           
            const data = snapshot.data();
            //starts call on answer
            if(pc.current && !pc.current.remoteDesription && data && data.answer) {
                console.warn("setting answer");
                pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
            
            if(data && data.offer && !connecting.current) {
                console.log("tu ano")
                setGettingCall(true);
            }
        });
        
    }

    const startRemoveListener = async (roomId) => {
        const subscribtionDelete = firestore().collection('meet').doc(roomId).collection('callee').onSnapshot(s => {
            s.docChanges().forEach((change) => {
                if(change.type == 'removed') {
                    hangup();
                    console.warn("toto niee");
                    setCallroom(null);
                }
                
            });
            
        });
    }


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

    const create = async (chatId = 'chatId') => {

        setCurrentChatId(chatId);
        console.log("create called with : "  + chatId);
        if (chatId === null || chatId === userData.username) { return }

        console.log("Calling ");
        connecting.current = true;
        await setupWebrtc();
        //signal the second party.
        const roomId = Math.random().toString(36).substring(0,34);

        const cRef = firestore().collection("meet").doc(roomId);
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
            await cRef.set(cWithOffer);
            firestore().collection(chatId).doc('room').set({room : roomId});
            setCallroom(roomId);



            const subscribtionSet = firestore().collection('meet').doc(roomId).onSnapshot(snapshot => {
        
           
                const data = snapshot.data();
                //starts call on answer
                if(pc.current && !pc.current.remoteDesription && data && data.answer) {
                    console.warn("setting answer");
                    pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
                
                if(data && data.offer && !connecting.current) {
                    console.log("tu ano")
                    setGettingCall(true);
                }
            });

            const subscribtionDelete = firestore().collection('meet').doc(roomId).collection('callee').onSnapshot(s => {
                s.docChanges().forEach((change) => {
                    if(change.type == 'removed') {
                        hangup();
                        console.warn("toto niee");
                        setCallroom(null);
                    }
                    
                });
                
            });

        }
    }

    const join = async (chatId = 'chatId') => {
        console.log("Joining call");
        connecting.current = true;
        setGettingCall(false);
        console.log("joining")
        
        const cRef = firestore().collection('meet').doc(chatId);
        const offer = (await cRef.get()).data()?.offer;
       
        if(offer) {
            await setupWebrtc();
            
            collectIceCandidates(cRef,  'callee', 'caller');
            console.warn("Offer: "+offer);
            if(pc.current) {
                
                console.warn(chatId);
                 pc.current.setRemoteDescription(new RTCSessionDescription(offer)).catch(e => console.error(e));
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
        firestoreCleanup();
        if(pc.current) {
            pc.current.close();
        }
        setCallroom(null);
    };

    const streamCleanup = async () => {
        if(localStream) {
            localStream.getTracks().forEach(t => t.stop());
            localStream.release();
        }
        setLocalStream(null);
        setRemoteStream(null);
    }

    const firestoreCleanup = async () => {
        /*
        const cRef = firestore().collection('meet').doc(currentChatId);
        if(cRef) {
            const calleeCandidate = await cRef.collection('callee').get();
            calleeCandidate.forEach(async (c) => {
                await c.ref.delete();
            });
            const callerCandidate = await cRef.collection('caller').get();
            callerCandidate.forEach(async (c) => {
                await c.ref.delete();
            });
            firestore().collection(userData.username).doc('room').delete()
            firestore().collection(peer).doc('room').delete()
            cRef.delete();
        }
        */
        const sRef = firestore().collection(userData.username).doc('room');
        if(sRef){
            sRef.delete();
        }
        setCallroom(null);
    }

    if(localStream) {
        return(
            <CallScreen hangup={hangup} localStream={localStream} remoteStream={remoteStream}/>
        )
    }


    if(gettingCall && callRoom != null){
        
        return (
           <IncommingCallScreen join={() => join(callRoom)} hangup={hangup}/>
        )
    }

    return(
        <>
            {  false && // for testing purpose
                <>
                    <Button onPress={() => create(peer)}>calll</Button>
                    <TextInput title="peer" onChangeText={setPeer}></TextInput>
                </>
            }
            <Stack.Navigator
                initialRouteName="Dashboard"
                screenOptions={{
                    header: (props) => <NavigationBar user={userData} {...props}/>,
                }}
            >
                <Stack.Screen name="Dashboard" component={DashboardScreen}/>
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="New Ticket" component={TicketCreateScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} initialParams={{onCall: create}} />
                <Stack.Screen name="New User" component={UserCreateScreen} />
            </Stack.Navigator>
        </>
    )
}

const RootNavigator = (props) => {
    const token = useSelector(state => state.AuthReducer.authToken);

    return (
        
        <NavigationContainer>
            {
                token === null ?
                <AuthStack/> : <AppStack/>
            }
        </NavigationContainer>
    );
}

export default RootNavigator;
