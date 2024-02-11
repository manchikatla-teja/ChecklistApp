import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button } from 'react-native';
import {firebase} from '../firebaseConfig';
import change from '../global/global';
import PersonalChecklistBox from '../PersonalChecklist/PersonalChecklistBox';

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

  return (
    <View>
      <Text>Create a New Checklist</Text>
      <TextInput
        placeholder="Checklist Name"
        value={checklistName}
        onChangeText={setChecklistName}
      />
      <Button title="Add Checklist" onPress={handleAddChecklist} />
    {checklists.filter((checklist, key)=>checklist.userID == user.uid).map((checklist, key)=>{
       return <PersonalChecklistBox key={key} checklist={checklist} onDelete={onDelete} onAddItem={()=>onAddItem(checklist)}></PersonalChecklistBox>
    })}
    </View>
  );
};

export default PersonalScreen;
