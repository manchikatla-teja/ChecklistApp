import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SharedChecklistBox = ({ checklist, onDelete, onAddItem }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onDelete(checklist.id)} style={styles.deleteButton}>
        <FontAwesome name="trash" size={20} color="red" />
      </TouchableOpacity>
      <Text style={styles.title}>{checklist.name}</Text>
      <Text style={styles.date}>{checklist.createdAt.toDate().toLocaleDateString()}</Text>
      <Text style={styles.title}>Created By {checklist.createdUserEmail}</Text>
      <TouchableOpacity onPress={onAddItem} style={styles.addItemButton}>
        <Text style={styles.addItemButtonText}>Add Item</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ShareWithFriendsPage', {checklist: checklist})} style={styles.addFriendButton}>
        <Text style={styles.addFriendButtonText}>Add a Friend</Text>
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
  addFriendButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 16,
  },
  addFriendButtonText: {
    color: 'green',
  },
});

export default SharedChecklistBox;
