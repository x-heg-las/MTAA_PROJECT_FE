import { View, Text, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import {Card, Avatar} from 'react-native-paper'
import GlobalStyle from '../global/styles/GlobalStyles';

export function UserCard({userData, onPress}) {
    
    //console.log("tick tick" + userData);
    //const [profileImage, setProfileImage] = useState(null);

    return (
        <Card onPress={() => onPress(userData)}>
            <Card.Content>
                <View style={[styles.container]}>
                    <View style={[styles.row]}>
                        {
                            userData.profileImage ?
                            <Avatar.Image style={GlobalStyle.profileImage} size={120} source={{uri: userData.profileImage}} />
                            :
                            <Avatar.Text style={GlobalStyle.profileImage} size={120} label={userData.full_name.split(' ').map(w => w[0]).join('')} />
                        }
                        <Text style={styles.txt}>{userData.full_name}</Text>
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
