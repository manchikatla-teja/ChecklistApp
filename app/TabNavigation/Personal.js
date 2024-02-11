import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {firebase} from '../firebaseConfig';
import change from '../global/global';
import PersonalChecklistBox from '../PersonalChecklist/PersonalChecklistBox';
import { FlatList } from 'react-native-gesture-handler';

const PersonalScreen = () => {

  const [checklistName, setChecklistName] = useState('');
  const [checklists, setChecklists] = useState([]);
  const [triggerUseEffect, setTriggerUseEffect] = useState(true);
  const navigation  = useNavigation();
  const user = change('get', 'dd');



  const onDelete = (id) => {
    const todoRef = firebase.firestore().collection('personalChecklists');
  
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
    navigation.navigate('PersonalChecklistItems', {checklist: checklist});
  }

  useEffect(() => {
    // Reference to the 'personalChecklists' collection
    const checklistsRef = firebase.firestore().collection('personalChecklists');

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
      const todoRef = firebase.firestore().collection('personalChecklists');
      const newChecklist = {
        name: checklistName,
        createdAt: new Date(),
        userID: user.uid,
        items: [],
      };

      todoRef.add(newChecklist).then(()=>{}).catch((err)=>console.log(err));

      // Clear the input field
      setChecklistName('');
      setTriggerUseEffect(!triggerUseEffect);
    }
  };

  const renderItem = ({ item, index }) => (
    item.userID == user.uid && <PersonalChecklistBox
      key={index.toString()}
      checklist={item}
      onDelete={onDelete}
      onAddItem={() => onAddItem(item)}
    />
  );

  return (
    <View style={{marginBottom: 70}}>
      <View style={styles.addChecklistContainer}>
      <TextInput style={styles.textInput}
        placeholder="Type Checklist Title..."
        value={checklistName}
        onChangeText={setChecklistName}
      />
      <Button title="Add Checklist" onPress={handleAddChecklist} />
      </View>
    {/* {checklists.filter((checklist, key)=>checklist.userID == user.uid).map((checklist, key)=>{
       return <PersonalChecklistBox key={key} checklist={checklist} onDelete={onDelete} onAddItem={()=>onAddItem(checklist)}></PersonalChecklistBox>
    })} */}
    <FlatList
      data={checklists}
      keyExtractor={(item) => item.id} // Adjust the keyExtractor according to your data structure
      renderItem={renderItem}
    />
    </View>
  );
};

export default PersonalScreen;

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
