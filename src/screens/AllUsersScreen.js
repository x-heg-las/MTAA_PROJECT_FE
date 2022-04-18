import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, TextInput, SafeAreaView } from "react-native";
import { Searchbar } from 'react-native-paper';
import { Button, Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { Init, Login } from "../redux/store/actions"
import { UserCard } from "../components/UserCard";
import { getUsers, getFile } from "../api/apiCalls";

export default function AllUsersScreen() {
  const dispatch = useDispatch()  
  const serverAddress = useSelector(state => state.SettingsReducer.address);

  const [searchQuery, setSearchQuery] = useState('');
  const [resData, setResData] = useState([]);

  const onChangeSearch = (query) => {
      setSearchQuery(query);
      getUsers(serverAddress, {query: query}).then(resp => {
          for (const item of resp.body.items) {
              console.log(item.profile_img_file);
              getFile(serverAddress, {id: item.profile_img_file}).then(imgRes => {
                imgRes.body.then(imgData => {
                    item.profileImage = imgData;
                    setResData(resp.body.items);
                });
              });
          }
          if (resp.body.items.length === 0) {
            setResData([]);
          }
      });
  }

  useEffect(() => {
    onChangeSearch("");
  }, []);

  return (
    <View style={styles.container}>
        <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        />
        <FlatList
            data={resData}
            renderItem={({item}) =>{return <UserCard userData={item}/>}}
        />
    </View>
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
