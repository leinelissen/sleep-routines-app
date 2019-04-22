import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, AsyncStorage } from 'react-native';
import { Notifications, Permissions, Constants } from 'expo';
import { getDayOfYear, setDayOfYear, isFuture, addDays, subMinutes } from 'date-fns';

import MenuView from './components/MenuView';
import ClusterView from './components/ClusterView';
import MQTTConnection from './components/MQTTConnection';

const AMOUNT_OF_NOTIFICATIONS_PLANNED = 15;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', 
    },
    menu: {
        maxWidth: '30%',
        flexShrink: 0,
        flexGrow: 0,
    },
});

const emptyCluster = {
    title: undefined,
    location: undefined,
    activities: [ ],
    duration: undefined,
    shouldUpdate: false,
    lastUpdated: null,
}

// AsyncStorage.clear();

class RoutineScreen extends React.Component {
    state = {
        clusters: [],
        currentCluster: 0,
        sleepTime: new Date("2019-03-11T23:00:00+01:00"),
    };
    
    componentDidMount() {
        AsyncStorage.getItem('clusters')
            .then(data => {
                if (data === null) {
                    throw new Error('No Data Saved');
                }
                const clusters = JSON.parse(data);
                this.setState({ clusters });
            })
            .catch(err => {
                this.setState({ clusters: [ emptyCluster ] });
            });

        this.registerPushNotifications()
            .then(console.log);
    }

    componentDidUpdate() {
        AsyncStorage.setItem('clusters', JSON.stringify(this.state.clusters));
    }

    registerPushNotifications() {
        return Constants.isDevice ? Permissions.askAsync(
            Permissions.NOTIFICATIONS,
            Permissions.USER_FACING_NOTIFICATIONS,
        ).then(() => Notifications.getExpoPushTokenAsync())
            : new Promise.resolve();
    }

    // Change the current cluster index
    handleChangeCluster = index => this.setState({ currentCluster: index });


    // Replace the current cluster with new data
    handleEditCluster = cluster => {
        const clusters = [...this.state.clusters];
        clusters[this.state.currentCluster] = cluster;
        this.setState({ clusters });
    }

    // Add a new cluster
    handleAddCluster = () => this.state.clusters.length < 5 
        && this.setState({
        clusters: [
            ...this.state.clusters,
            emptyCluster,
        ],
        currentCluster: this.state.clusters.length,
    });

    // Delete the current cluster
    handleDeleteCluster = () => {
        const clusters = this.state.clusters.filter((d, index) => index !== this.state.currentCluster);

        this.setState({
            clusters: clusters.length ? clusters : [ emptyCluster ],
            currentCluster: 0,
        });
    };

    // Change the current sleep time
    handleChangeSleepTime = sleepTime => {
        // Write new time to state
        this.setState({ sleepTime });

        // Calculate notification time
        const notificationTime = subMinutes(
            setDayOfYear(sleepTime, 
                getDayOfYear(new Date())),
            15
        );

        // Check if the notification time is in the future, if not add a day
        if (!isFuture(notificationTime)) {
            notificationTime = addDays(notificationTime, 1);
        }

        // Cancel any scheduled notifications
        return Notifications.cancelAllScheduledNotificationsAsync()
            // Create an array with notifications for the coming days
            .then(() => [...new Array(AMOUNT_OF_NOTIFICATIONS_PLANNED)]
                .map((x, i) => addDays(notificationTime, i))
            )
            // Schedule all notifications
            .then(notifications => Promise.all(
                notifications.map(notification => 
                    Notifications.scheduleLocalNotificationAsync({
                        title: 'Sleep Routines',
                        body: 'Go to bed...',
                        ios: {
                            sound: true,
                        }
                    }, {
                        time: notification
                    })
                )
            ))
            .then(console.log)
            .catch(console.error);
    }

    render() {
        return (
            <View style={styles.container}>
                <MenuView 
                    style={styles.menu} 
                    onChangeCluster={this.handleChangeCluster}
                    onAddCluster={this.handleAddCluster} 
                    onChangeSleepTime={this.handleChangeSleepTime}
                    {...this.state}
                />
                <ClusterView
                    cluster={this.state.clusters[this.state.currentCluster]}
                    onEditCluster={this.handleEditCluster}
                    onDeleteCluster={this.handleDeleteCluster}
                />
                <MQTTConnection clusters={this.state.clusters} />
            </View>
        );
    }
}

export default RoutineScreen;