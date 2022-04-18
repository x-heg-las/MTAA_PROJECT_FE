import { View, StyleSheet } from 'react-native'
import React, {useEffect} from 'react'
import {Card, Title, Text} from 'react-native-paper'
import {TICKETS} from '../assets/dummy_data'
import { STATUS_RESOLVED, STATUS_PENDING } from '../global/constants/Constants'

export function TicketCard({ticketData, onPress}) {
    
    console.log("tick tick" + ticketData); 

    return (
        <Card onPress={() => onPress(ticketData)}>
            <Card.Content>
                <View style={[styles.container]}>
                    <View style={[styles.row]}>
                        <Text>{ticketData.title}</Text>
                        <Text>{new Date(ticketData.created_at).toDateString()}</Text>
                    </View>
                    <View  style={[styles.row]}>
                        <Text>Author: {ticketData.user}</Text>
                        <Text>Status: {ticketData.answered_by_user ? STATUS_RESOLVED : STATUS_PENDING}</Text>
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
        flexDirection: 'column'
    }
})