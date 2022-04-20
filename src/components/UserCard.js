import { View,  StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import {Card, Avatar, Title, Text, IconButton} from 'react-native-paper'
import GlobalStyle from '../global/styles/GlobalStyles';
import { AuthReducer,SettingsReducer } from '../redux/store/reducers';
import {useSelector} from 'react-redux';
import {deleteUsers} from '../api/apiCalls';

export function UserCard({userData, onPress, onUpdate}) {
    const loggedUser = useSelector(state => state.AuthReducer.userData);
    const serverAddress = useSelector(state => state.SettingsReducer.address);
    //console.log("tick tick" + userData);
    //const [profileImage, setProfileImage] = useState(null);

    const onDeleteProfile = async () => {
        if(loggedUser == null || loggedUser.id == null) return
        const result = await deleteUsers(serverAddress, {id: userData.id});
        if(result == null) return;
        onUpdate(null);
      }

    return (
        <Card onPress={() => onPress(userData)}>
            <Card.Content>
                <View style={[styles.container]}>
                    <View style={[styles.row]}>
                        {
                            (userData.profile_img_file && userData.profileImage) ?
                            <Avatar.Image style={GlobalStyle.profileImage} size={120} source={{uri: userData.profileImage}} />
                            :
                            <Avatar.Text style={GlobalStyle.profileImage} size={120} label={userData.full_name.split(' ').map(w => w[0]).join('')} />
                        }
                        <View style={{flex: 1}}>
                            <Title style={styles.txt}>{userData.full_name}</Title>
                            <View style={[styles.row]}>
                                <Text>Username: {userData.username}</Text>
                                {   (loggedUser && loggedUser.user_type__name === 'admin') &&
                                    <IconButton icon="delete" onPress={onDeleteProfile} color='red'/>
                                }
                            </View>
                        </View>
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
        flexDirection: 'column',
        flex: 1
    },
    txt: {
        textAlign: 'center'
    }
})
