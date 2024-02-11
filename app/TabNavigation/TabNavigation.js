// In a file, let's say TabNavigation.js

import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
// Import your tab screens
import PersonalScreen from './Personal';
import SharedScreen from './Shared';
import RequestsScreen from './Requests';
import PersonalChecklistItems from '../PersonalChecklist/PersonalChecklistItems';
import SharedChecklistItems from '../SharedChecklist/SharedChecklistItem';
import ShareWithFriendsPage from '../SharedChecklist/ShareWithFriends';

const Tab = createMaterialBottomTabNavigator();
const PersonalStack = createStackNavigator();
const SharedStack = createStackNavigator();

const PersonalStackScreen = () => {
  return (
    <PersonalStack.Navigator>
      <PersonalStack.Screen name="Personal" component={PersonalScreen} />
      <PersonalStack.Screen name="PersonalChecklistItems" component={PersonalChecklistItems} />
    </PersonalStack.Navigator>
  );
};

const SharedStackScreen = () => {
  return (
    <SharedStack.Navigator>
      <SharedStack.Screen name="Shared" component={SharedScreen} />
      <SharedStack.Screen name="SharedChecklistItems" component={SharedChecklistItems} />
      <SharedStack.Screen name="ShareWithFriendsPage" component={ShareWithFriendsPage} />
    </SharedStack.Navigator>
  );
};


const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="PersonalMain"
      activeColor="#fff"
      shifting={true}
    >
      <Tab.Screen
        name="PersonalMain"
        component={PersonalStackScreen}
        options={{
          tabBarLabel: 'Personal',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="SharedMain"
        component={SharedStackScreen}
        options={{
          tabBarLabel: 'Shared',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          tabBarLabel: 'Requests',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-plus" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
