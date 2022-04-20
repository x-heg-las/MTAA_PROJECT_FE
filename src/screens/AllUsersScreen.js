import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, TextInput, SafeAreaView } from "react-native";
import { Searchbar } from 'react-native-paper';
import { Button, Snackbar, ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Init, Login } from "../redux/store/actions"
import { UserCard } from "../components/UserCard";
import { getUsers, getFile } from "../api/apiCalls";
import GlobalStyle from '../global/styles/GlobalStyles'

export default function AllUsersScreen({navigation}) {
  const dispatch = useDispatch()  
  const serverAddress = useSelector(state => state.SettingsReducer.address);

  const [searchQuery, setSearchQuery] = useState('');
  const [resData, setResData] = useState([]);


  const openProfile = (userdata) => {
    if(userdata) {
      navigation.navigate("Profile",  {user_id: userdata.id})
    }
  }

  const onChangeSearch = (query) => {
      setSearchQuery(query);
      getUsers(serverAddress, {query: query}).then(async resp => {
          for (const item of resp.body.items) {
              console.log(item.profile_img_file);
              if(item.profile_img_file == null) {continue;}
              await getFile(serverAddress, {id: item.profile_img_file}).then(imgRes => {
                imgRes.body.then(imgData => {
                    item.profileImage = imgData;
                    
                });
              });
          }
          if (resp.body.items.length === 0) {
            setResData([]);
          } else {
            setResData(resp.body.items);
          }
      });
  }

  useEffect(() => {
    onChangeSearch("");
  }, []);

  return (
    <SafeAreaView style={GlobalStyle.container}>
   
      
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        />
        <FlatList
            data={resData}
            renderItem={({item}) =>{return <UserCard userData={item} onPress={openProfile} onUpdate={(val) => {onChangeSearch(searchQuery); console.log("del push")}}/>}}
        />
       
    
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  }
});
