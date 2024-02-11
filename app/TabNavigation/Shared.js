import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import {firebase} from '../firebaseConfig';
import change from '../global/global';
import SharedChecklistBox from '../SharedChecklist/SharedChecklistBox';
import { FlatList } from 'react-native-gesture-handler';

const SharedScreen = () => {

  const [checklistName, setChecklistName] = useState('');
  const [checklists, setChecklists] = useState([]);
  const [triggerUseEffect, setTriggerUseEffect] = useState(true);
  const navigation  = useNavigation();
  const user = change('get', 'dd');
  // console.log(user);
  const onDelete = (id) => {
    const todoRef = firebase.firestore().collection('sharedChecklists');
  
    // Assuming id is the document ID you want to delete
    todoRef.doc(id).delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const onAddItem = (checklist)=>{
    navigation.navigate('SharedChecklistItems', {checklist: checklist});
  }

  useEffect(() => {
    // Reference to the 'sharedChecklists' collection
    const checklistsRef = firebase.firestore().collection('sharedChecklists');

    // Subscribe to the collection changes
    const unsubscribe = checklistsRef.onSnapshot((snapshot) => {
      const newChecklists = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChecklists(newChecklists);
    });
    // console.log(checklists);
    // Unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [triggerUseEffect]);

  const handleAddChecklist = () => {
    // Check if checklistName is not empty
    if (checklistName.trim() !== '') {
      // Create a new checklist object with the name and a createdAt timestamp
      

      // Pass the new checklist to the parent component
      const todoRef = firebase.firestore().collection('sharedChecklists');
      const newChecklist = {
        name: checklistName,
        createdAt: new Date(),
        createdUserEmail: user.email,
        allUsersID: [user.uid],
        items: [],
        invitedUsersID: [],
      };

      todoRef.add(newChecklist).then(()=>{}).catch((err)=>console.log(err));

      // Clear the input field
      setChecklistName('');
      setTriggerUseEffect(!triggerUseEffect);
    }
  };

  const renderItem = ({ item, index }) => (
    item.allUsersID.includes(user.uid) && <SharedChecklistBox
    key={index.toString()}
    checklist={item}
    onDelete={onDelete}
    onAddItem={()=>onAddItem(item)}>

    </SharedChecklistBox>
  );

  return (
    <View style={{marginBottom: 70}}>
      {/* <Text>Create a New Checklist</Text> */}
      <View style={styles.addChecklistContainer}>
      <TextInput style={styles.textInput}
        placeholder="Type Checklist Name.."
        value={checklistName}
        onChangeText={setChecklistName}
      />
      <Button title="Add Checklist" onPress={handleAddChecklist} />
      </View>
    {/* {checklists.filter((checklist, key)=>checklist.allUsersID.includes(user.uid)).map((checklist, key)=>{
       return <SharedChecklistBox key={key} checklist={checklist} onDelete={onDelete} onAddItem={()=>onAddItem(checklist)}></SharedChecklistBox>
    })} */}
    <FlatList
      data={checklists}
      keyExtractor={(item) => item.id} // Adjust the keyExtractor according to your data structure
      renderItem={renderItem}
    />
    </View>
  );
};

export default SharedScreen;


const styles = StyleSheet.create({
  addChecklistContainer: {
    width: '90%',
    maxWidth: 400,
    display:"flex",
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 16,
    marginLeft: 16,
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  textInput: {
    width: '55%',
    maxWidth: 300,
    fontSize: 15,
    
  },
});