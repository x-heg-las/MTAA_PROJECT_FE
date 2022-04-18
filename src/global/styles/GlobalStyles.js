import {StyleSheet} from 'react-native';


const GlobalStyle = StyleSheet.create({
    container:{
        flex:1,
        margin: 5,
        flexDirection: 'column',
        backgroundColor: '#f2f5f0'
    },
    inline:{
        flexDirection: 'row',
    },
    form:{
        minHeight: 60,  
    },
    profileImage:{ 
        alignSelf: 'center',
        height: 120,
        width: 120,
        borderRadius: 60,
        margin: 10
    },
    toggleBtn:{
        borderColor: 'black',
        borderWidth: 2,
    }
})


export default GlobalStyle;