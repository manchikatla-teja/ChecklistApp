import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import {firebase} from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import change from '../global/global';

const ShareWithFriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const route = useRoute();
  const currentUser = change('get', 'dd');
  const checklist = route.params.checklist;
  
//   console.log("checklist", checklist, "\ncurretnuser", currentUser);

//   console.log("routeParams",route.params);

  useEffect(() => {
        //below line looks horror but it helps in exactly finding the email. its like includes in JS.
        const q = firebase.firestore().collection('users').where('useremail', '>=', searchQuery).where('useremail', '<=', searchQuery + '\uf8ff');
        // Subscribe to the collection changes
        const unsubscribe = q.onSnapshot((snapshot) => {
            const allUsers = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        setUsers(allUsers);
        });
      // console.log(checklists);
      // Unsubscribe when the component unmounts
    //   console.log(users);
      return () => unsubscribe();
  }, [searchQuery]);

  const handleInvite = (user, checklist) => {

    const requestsRef = firebase.firestore().collection('requests');
    const sharedRef = firebase.firestore().collection('sharedChecklists');
    // console.log("insde request", user);
     // Assuming these parameters are passed from the previous screen
    const newRequest = {
      createdBy: checklist.createdUserEmail, // Replace 'currentUserId' with the actual ID of the user sending the invite
      invitedBy: currentUser.email,
      checklistName: checklist.name,
      checklistID: checklist.id,
      invitedOn: new Date(),
      invitationReceivedUserID: user.userID, 
    };

    

    // console.log("below newRequest", newRequest);

    requestsRef.add(newRequest).then(()=>{sharedRef.doc(checklist.id).update({
        invitedUsersID: firebase.firestore.FieldValue.arrayUnion(user.userID),
      });}).catch((err)=>console.log(err));

    // console.log("says i add reeuest");
    setInvitedUsers((prevInvitedUsers) => [...prevInvitedUsers, user.useremail]);
    
  };

  const renderUserItem = ({ item }) => (
    !invitedUsers.includes(item.useremail) && !checklist.invitedUsersID.includes(item.userID) && !checklist.allUsersID.includes(item.userID) && (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
      <Text>{item.useremail}</Text>
        <TouchableOpacity onPress={() => handleInvite(item, checklist)}>
          <Text style={{ color: 'blue' }}>Invite</Text>
        </TouchableOpacity>
    </View>
    )
  );

  return (
    <View>
      <TextInput
        placeholder="Search for users by email"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
      />
    </View>
  );
};

export default ShareWithFriendsPage;
