import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button } from 'react-native';
import {firebase} from '../firebaseConfig';
import change from '../global/global';

const RequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const currentUser = change('get', 'dd');

  useEffect(() => {

      const requestsRef = firebase.firestore().collection('requests').where('invitationReceivedUserID','==',currentUser.uid);

      // Subscribe to the collection changes
      const unsubscribe = requestsRef.onSnapshot((snapshot) => {
        const newRequests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(newRequests);
      });
      // console.log(checklists);
      // console.log(requests);
      // Unsubscribe when the component unmounts
      return () => unsubscribe();
 
  }, [currentUser.uid]);

  const handleAccept = async (request) => {
    
      // Update the 'sharedChecklists' collection with the new user
      const sharedRef = firebase.firestore().collection('sharedChecklists');
      const requestsRef = firebase.firestore().collection('requests');
      sharedRef.doc(request.checklistID).update({
        allUsersID: firebase.firestore.FieldValue.arrayUnion(request.invitationReceivedUserID),
        invitedUsersID: firebase.firestore.FieldValue.arrayRemove(request.invitationReceivedUserID),
      });
      // Remove the request from the 'requests' collection
      requestsRef.doc(request.id).delete()
      .then(() => {})
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
      // Refresh the requests list
      setRequests((prevRequests) => prevRequests.filter((item) => item.id !== request.id));
    
  };

  const handleReject = async (request) => {
    const requestsRef = firebase.firestore().collection('requests');
    const sharedRef = firebase.firestore().collection('sharedChecklists');
      sharedRef.doc(request.checklistID).update({
        invitedUsersID: firebase.firestore.FieldValue.arrayRemove(request.invitationReceivedUserID),
      });
    requestsRef.doc(request.id).delete()
      .then(() => {})
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.title}>Checklist Name: {item.checklistName}</Text>
        <Text style={styles.date}>Created By: {item.createdBy}</Text>
        <Text style={styles.date}>Invited By: {item.invitedBy}</Text>
        <Text style={styles.date}>Invited On: {item.invitedOn.toDate().toLocaleDateString()}</Text>
      </View>
      <View style={{ flexDirection: 'column', gap: 10,}}>
        <Button title="Accept" color="green" onPress={() => handleAccept(item)}>
          {/* <Text style={{ color: 'green', marginBottom: 15 }}>Accept</Text> */}
        </Button>
        <Button title="Reject" color="red" onPress={() => handleReject(item)}>
          {/* <Text style={{ color: 'red' }}>Reject</Text> */}
        </Button>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
      />
    </View>
  );
};

export default RequestsScreen;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  details: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  title: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 13,
    color: '#777',
  },
});