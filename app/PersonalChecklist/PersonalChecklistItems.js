import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute} from '@react-navigation/native';
import {firebase} from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PersonalChecklistItems = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [checklist, setChecklist] = useState({});
  const [newItem, setNewItem] = useState('');
  const [items, setItems] = useState([]);

  // console.log("params", route.params.checklist);
  const paramsChecklist = route.params.checklist;

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        // Retrieve checklist from AsyncStorage
        const storedChecklist = await AsyncStorage.getItem('personalChecklists');
        const parsedChecklist = JSON.parse(storedChecklist) || {};
        // console.log(paramsChecklist.id);
        const filteredChecklist = parsedChecklist.filter(item => item.id == paramsChecklist.id);
        // console.log("inside itemsLIST",filteredChecklist, "inside items", filteredChecklist[0].items);
        
        // console.log("RetirevedItems", filteredChecklist[0].items);
        // console.log("filteredChecklsit",filteredChecklist[0]);
        setChecklist(filteredChecklist[0]);
        setItems(filteredChecklist[0].items || []);
      } catch (error) {
        console.error('Error fetching checklist:', error);
      }
    };

    fetchChecklist();
  }, [route.params.checklist.id]);

  // useEffect(() => {
  //   // Reference to the 'personalChecklists' collection
  //   const checklistsRef = firebase.firestore().collection('personalChecklists');
  //   const checklistId = route.params.checklist.id;
  
  //   // Subscribe to changes in a specific document (checklist) within the collection
  //   const unsubscribe = checklistsRef.doc(checklistId).onSnapshot((snapshot) => {
  //     const checklistData = snapshot.data();
  //     if (checklistData) {
  //       setChecklist(checklistData);
  //       setItems(checklistData.items || []);
  //     }
  //   });
  
  //   // Unsubscribe when the component unmounts
  //   return () => unsubscribe();
  // }, [route.params.checklist.id]);
  

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      const newItemObject = { name: newItem, status: 0 };
      setItems((prevItems) => [...prevItems, newItemObject]);
      setNewItem('');
    }
  };

  const handleToggleStatus = (index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].status = updatedItems[index].status === 0 ? 1 : 0;
      return updatedItems;
    });
  };

  const handleDeleteItem = (index) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const handleSave = async () => {
    try {
      // Retrieve the personalChecklists array from AsyncStorage
      const storedPersonalChecklists = await AsyncStorage.getItem('personalChecklists');
      const personalChecklists = JSON.parse(storedPersonalChecklists) || [];
  
      // Update the checklist with new information based on checklist.id

      // console.log("oldChecklsit", checklist);
      
      const updatedChecklists = personalChecklists.filter(item => item.id!=checklist.id);
      const newChecklist = checklist;
      newChecklist.items = items;
      setChecklist(newChecklist);
      setItems([]);

      // console.log("newChecklist", checklist);
      // Save the updated personalChecklists array back to AsyncStorage
      await AsyncStorage.setItem('personalChecklists', JSON.stringify([...updatedChecklists, checklist]));
  
      // Navigate back after successful update
      navigation.goBack();
    } catch (error) {
      console.error('Error updating checklist:', error);
      // Handle the error as needed
    }
  };

  // const handleSave = async () => {
  //   // Reference to the 'personalChecklists' collection
  //   const checklistsRef = firebase.firestore().collection('personalChecklists');
  //   const checklistId = route.params.checklist.id;
  
  //   try {
  //     // Update the specific document (checklist) within the collection
  //     await checklistsRef.doc(checklistId).update({
  //       items: items,
  //     });
  
  //     // Navigate back after successful update
  //     navigation.goBack();
  //   } catch (error) {
  //     console.error("Error updating document: ", error);
  //     // Handle the error as needed
  //   }
  // };
  



  return (
    <View style={{marginBottom: 110}}>
      <Text style={styles.checklistTitle}>{checklist.name}</Text>
      <Text style={styles.checklistDate}>Created On: {new Date(checklist.createdAt).toLocaleDateString()}</Text>
      
      <View style={styles.addChecklistContainer}>
      <TextInput style={styles.textInput}
        placeholder="Enter CheckList Item"
        value={newItem}
        onChangeText={setNewItem}
       
      />
      <Button  title="Add Item" onPress={handleAddItem} style={{ backgroundColor: '#3498db' }}>
        {/* <Text style={{ color: 'white' }}>Add Item</Text> */}
      </Button>
      </View>
      <ScrollView style={{marginBottom: 30}}>
        {items.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <TouchableOpacity onPress={() => handleToggleStatus(index)} style={{ marginHorizontal: 8 }}>
              {item.status === 1 ? (
                <FontAwesome name="check-square" size={25} color="green" />
              ) : (
                <FontAwesome name="square-o" size={25} color="black" />
              )}
            </TouchableOpacity>
            <Text style={{ flex: 1, marginLeft:16 }}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteItem(index)}>
              <FontAwesome name="trash" size={25} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={{color:'#fff', fontSize: 16, fontWeight: 'bold'}}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PersonalChecklistItems;



const styles = StyleSheet.create({
  checklistTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,

  },
  checklistDate: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 5, 
    color: '#777',
  },
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
    width: '70%',
    maxWidth: 350,
    fontSize: 15,
  },
  saveButton:{
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 2,
    elevation: 3,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1035ac',
  }
});
