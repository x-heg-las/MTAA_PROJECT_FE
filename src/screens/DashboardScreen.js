import { View, Text,StyleSheet, SafeAreaView, FlatList } from 'react-native'
import React, {useState, useCallback} from 'react'
import store from '../redux/store'
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyle from '../global/styles/GlobalStyles';
import {ToggleButton} from 'react-native-paper';

export default function DashboardScreen({props}) {

    //const user = store.getState();
    const [filter, setFilter] = useState('pending');
    const [requests, setRequests] = useState([]);


    

    //fetch data
    useFocusEffect(useCallback(() => {

        //set user data

        return(
            setFilter('all')
        )
    }));


    return (
        <SafeAreaView style={GlobalStyle.container}>
            <View style={styles.inline}> 
                <ToggleButton.Row
        
                    onValueChange={ value => setFilter(value)}
                    value={filter}
                >
                    <ToggleButton icon={() => <Text>Low</Text>} color="black" value='pending'>Pending</ToggleButton>
                    <ToggleButton icon="menu" color="black" value='all'><Text>sdas</Text></ToggleButton>
                </ToggleButton.Row>
            </View>
            <View>
                <FlatList>

                </FlatList>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inline:{
        flexDirection: 'row',
        flex:1,
        width: '80%',
    }
})