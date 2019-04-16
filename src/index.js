import React from 'react';
import HelpScreen from './screens/HelpScreen';
import RoutineScreen from './screens/RoutineScreen';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';

const TabNavigator = createBottomTabNavigator({
    Routine: {
        screen: RoutineScreen,
    },
    Help: {
        screen: HelpScreen,
    }
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
            
            return <AntDesign 
                name={`${routeName === 'Routine' ? 'clockcircle' : 'questioncircle'}${focused ? '' : 'o'}`} 
                size={20} 
                color={tintColor} 
            />;
        },
    }),
});

export default createAppContainer(TabNavigator);