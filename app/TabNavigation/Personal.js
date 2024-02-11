import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {firebase} from '../firebaseConfig';
import change from '../global/global';
import PersonalChecklistBox from '../PersonalChecklist/PersonalChecklistBox';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalScreen = () => {

  const [checklistName, setChecklistName] = useState('');
  const [checklists, setChecklists] = useState([]);
  const [triggerUseEffect, setTriggerUseEffect] = useState(true);
  const navigation  = useNavigation();
  const user = change('get', 'dd');

  const onDelete = async (id) => {
    try {
      // Retrieve existing checklists from AsyncStorage
      const existingChecklists = JSON.parse(await AsyncStorage.getItem('personalChecklists')) || [];
      
      // Filter out the checklist with the specified id
      const updatedChecklists = existingChecklists.filter(checklist => checklist.id !== id);

      // Update AsyncStorage with the new checklists
      await AsyncStorage.setItem('personalChecklists', JSON.stringify(updatedChecklists));

      // Trigger re-render by updating state
      setTriggerUseEffect(!triggerUseEffect);
    } catch (error) {
      console.error('Error removing checklist:', error);
    }
  };

  // const onDelete = (id) => {
  //   const todoRef = firebase.firestore().collection('personalChecklists');
  
  //   // Assuming id is the document ID you want to delete
  //   todoRef.doc(id).delete()
  //     .then(() => {
  //       console.log("Document successfully deleted!");
  //     })
  //     .catch((error) => {
  //       console.error("Error removing document: ", error);
  //     });
  // };

  const onAddItem = (checklist)=>{
    navigation.navigate('PersonalChecklistItems', {checklist: checklist});
  }

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        // Retrieve checklists from AsyncStorage
        const storedChecklists = await AsyncStorage.getItem('personalChecklists');
        const parsedChecklists = JSON.parse(storedChecklists) || [];
        // console.log("PARSED CHECKLSITS",parsedChecklists);
        setChecklists(parsedChecklists);
      } catch (error) {
        console.error('Error fetching checklists:', error);
      }
    };

    fetchChecklists();
  }, [triggerUseEffect]);

  // useEffect(() => {
  //   // Reference to the 'personalChecklists' collection
  //   const checklistsRef = firebase.firestore().collection('personalChecklists');

  //   // Subscribe to the collection changes
  //   const unsubscribe = checklistsRef.onSnapshot((snapshot) => {
  //     const newChecklists = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setChecklists(newChecklists);
  //   });
  //   // console.log(checklists);
  //   // Unsubscribe when the component unmounts
  //   return () => unsubscribe();
  // }, [triggerUseEffect]);

  // const handleAddChecklist = () => {
  //   // Check if checklistName is not empty
  //   if (checklistName.trim() !== '') {
  //     // Create a new checklist object with the name and a createdAt timestamp
      
  const handleAddChecklist = async () => {
    try {
      // Check if checklistName is not empty
      if (checklistName.trim() !== '') {
        // Create a new checklist object with the name and a createdAt timestamp
        const newChecklist = {
          id: Math.random().toString(), // Generate a random id (you may use a better id generation logic)
          name: checklistName,
          createdAt: new Date().toISOString(),
          userID: user.uid, // Replace with actual user ID logic
          items: [],
        };

        // Retrieve existing checklists from AsyncStorage
        const existingChecklists = JSON.parse(await AsyncStorage.getItem('personalChecklists')) || [];

        // Add the new checklist to the existing checklists
        const updatedChecklists = [...existingChecklists, newChecklist];

        // Update AsyncStorage with the new checklists
        await AsyncStorage.setItem('personalChecklists', JSON.stringify(updatedChecklists));

        // Clear the input field
        setChecklistName('');
        // Trigger re-render by updating state
        setTriggerUseEffect(!triggerUseEffect);
      }
    } catch (error) {
      console.error('Error adding checklist:', error);
    }
  };

  //     // Pass the new checklist to the parent component
  //     const todoRef = firebase.firestore().collection('personalChecklists');
  //     const newChecklist = {
  //       name: checklistName,
  //       createdAt: new Date(),
  //       userID: user.uid,
  //       items: [],
  //     };

  //     todoRef.add(newChecklist).then(()=>{}).catch((err)=>console.log(err));

  //     // Clear the input field
  //     setChecklistName('');
  //     setTriggerUseEffect(!triggerUseEffect);
  //   }
  // };

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
