import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute} from '@react-navigation/native';
import { getFirestore, collection, doc, updateDoc, onSnapshot, addDoc } from '@react-native-firebase/firestore';
import {firebase} from '../firebaseConfig';

const PersonalChecklistItems = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [checklist, setChecklist] = useState({});
  const [newItem, setNewItem] = useState('');
  const [items, setItems] = useState([]);

//   console.log("params", route.params.checklist);

  useEffect(() => {
    // Reference to the 'personalChecklists' collection
    const checklistsRef = firebase.firestore().collection('personalChecklists');
    const checklistId = route.params.checklist.id;
  
    // Subscribe to changes in a specific document (checklist) within the collection
    const unsubscribe = checklistsRef.doc(checklistId).onSnapshot((snapshot) => {
      const checklistData = snapshot.data();
      if (checklistData) {
        setChecklist(checklistData);
        setItems(checklistData.items || []);
      }
    });
  
    // Unsubscribe when the component unmounts
    return () => unsubscribe();
  }, [route.params.checklist.id]);
  

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
    // Reference to the 'personalChecklists' collection
    const checklistsRef = firebase.firestore().collection('personalChecklists');
    const checklistId = route.params.checklist.id;
  
    try {
      // Update the specific document (checklist) within the collection
      await checklistsRef.doc(checklistId).update({
        items: items,
      });
  
      // Navigate back after successful update
      navigation.goBack();
    } catch (error) {
      console.error("Error updating document: ", error);
      // Handle the error as needed
    }
  };
  

//   const handleAddChecklist = async () => {
//     const newChecklist = {
//       title: 'Your Checklist Title', // You can replace this with the actual checklist title
//       createdAt: new Date(),
//       items: [],
//     };

//     try {
//       const docRef = await addDoc(collection(getFirestore(), 'personalChecklists'), newChecklist);
//       navigation.navigate('ChecklistScreen', { checklistId: docRef.id });
//     } catch (error) {
//       console.error('Error adding checklist:', error);
//     }
//   };

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 20 }}>{checklist.name}</Text>
      <Text style={{ textAlign: 'center', fontSize: 12 }}>{checklist.createdAt?.toDate().toLocaleDateString()}</Text>
      <TextInput
        placeholder="Enter checklist item"
        value={newItem}
        onChangeText={setNewItem}
        style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
      />
      <TouchableOpacity onPress={handleAddItem} style={{ padding: 16, backgroundColor: '#3498db' }}>
        <Text style={{ color: 'white' }}>Add Item</Text>
      </TouchableOpacity>
      <ScrollView>
        {items.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <TouchableOpacity onPress={() => handleToggleStatus(index)} style={{ marginHorizontal: 8 }}>
              {item.status === 1 ? (
                <FontAwesome name="check-square" size={20} color="green" />
              ) : (
                <FontAwesome name="square-o" size={20} color="black" />
              )}
            </TouchableOpacity>
            <Text style={{ flex: 1, marginLeft:16 }}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteItem(index)}>
              <FontAwesome name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={handleSave} style={{ position: 'absolute', top: 0, right: 0, padding: 16 }}>
        <Text>Save</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={handleAddChecklist} style={{ position: 'absolute', top: 0, left: 0, padding: 16 }}>
        <Text>Add Checklist</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default PersonalChecklistItems;
