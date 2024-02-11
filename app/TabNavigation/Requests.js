import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
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
    requestsRef.doc(request.id).delete()
      .then(() => {})
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const renderRequestItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
      <View>
        <Text>Checklist Name: {item.checklistName}</Text>
        <Text>Created By: {item.createdBy}</Text>
        <Text>Invited By: {item.invitedBy}</Text>
        <Text>Invited On: {item.invitedOn.toDate().toLocaleDateString()}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => handleAccept(item)}>
          <Text style={{ color: 'green', marginRight: 10 }}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleReject(item)}>
          <Text style={{ color: 'red' }}>Reject</Text>
        </TouchableOpacity>
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
