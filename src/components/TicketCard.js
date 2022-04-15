import { View, Text, StyleSheet } from 're11act-native'
import React from 'react'

export default function TicketCard({props}) {
    
    //fetch ticket info


    useEffect(() => {
        //call fetch
    })

    return (
    <View style={styles.container}>
        <Text>TicketCard</Text>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '80%',
        height: '150',
    }
})