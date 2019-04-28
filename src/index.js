import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';

import HelpScreen from './screens/HelpScreen';
import RoutineScreen from './screens/RoutineScreen';

// This is the function that bootstraps the bottom navigation bar
// We input the various screens first
const TabNavigator = createBottomTabNavigator({
    Routine: RoutineScreen,
    Help: HelpScreen,
}, {
    // As well as set some navigation options, so that we have some nice icons
    defaultNavigationOptions: ({ navigation }) => ({
        // This is admittedly a weird way of doing stuff, but we'll leave it
        // here for now
        tabBarIcon: ({ focused, tintColor }) => {
            const { routeName } = navigation.state;
            
            return (
                <AntDesign 
                    name={`${routeName === 'Routine' ? 'clockcircle' : 'questioncircle'}${focused ? '' : 'o'}`} 
                    size={20} 
                    color={tintColor} 
                />
            );
        },
    }),
});

export default createAppContainer(TabNavigator);