import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const PersonalChecklistBox = ({ checklist, onDelete, onAddItem }) => {
  // console.log(checklist.name);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>onDelete(checklist.id)} style={styles.deleteButton}>
        <FontAwesome name="trash" size={20} color="red" />
      </TouchableOpacity>
      <Text style={styles.title}>{checklist.name}</Text>
      <Text style={styles.date}>{checklist.createdAt.toDate().toLocaleDateString()}</Text>
      <TouchableOpacity onPress={onAddItem} style={styles.addItemButton}>
        <Text style={styles.addItemButtonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    color: '#000'
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 16,
  },
  addItemButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 16,
  },
  addItemButtonText: {
    color: 'blue',
  },
});

export default PersonalChecklistBox;
