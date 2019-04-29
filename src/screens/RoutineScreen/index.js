import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { Notifications, Permissions, Constants } from 'expo';
import { debounce } from 'debounce';

import MenuView from './components/MenuView';
import ClusterView from './components/ClusterView';
import MQTTConnection from './components/MQTTConnection';
import scheduleNotifications from './ScheduleNotifications';

// Whenever a new cluster is created, we need to seed it with some data. This
// determines what data ends up there.
const emptyCluster = {
    title: undefined,
    location: undefined,
    activities: [ ],
    duration: 60000,
    shouldUpdate: false,
    lastUpdated: null,
}

/**
 * This is the root component for the routine design aspect of the application.
 * It also acts as the data source for all underlying components
 *
 * @class RoutineScreen
 * @extends {React.Component}
 */
class RoutineScreen extends React.Component {
    /**
     * This is the default state
     *
     * @memberof RoutineScreen
     */
    state = {
        // This will hold the clusters that are created
        clusters: [],
        // This denotes the cluster that is currently selected
        currentCluster: 0,
        // This is the default sleep time, set to 23:00, Dutch time
        sleepTime: "2019-03-11T23:00:00+01:00",
    };
    
    /**
     * Whenever the component is mounted, run these functions
     *
     * @memberof RoutineScreen
     */
    componentDidMount() {
        return Promise.all([
            this.registerPushNotifications(),
            this.retrieveAsyncStorage()
        ])
    }

    /**
     * Whenever the state changes, we need to do some actions
     *
     * @memberof RoutineScreen
     */
    componentDidUpdate() {
        // Store the new state in AsyncStorage, so we can retrieve it when the
        // app gets closed and openend again
        AsyncStorage.setItem('state', JSON.stringify(this.state))
            .catch(console.error);

        // Set the scheduled notifications, but wait for 2500 so that we don't
        // spam notification calls.
        debounce(this.setScheduledNotifications, 2500);
    }

    /**
     * Set the scheduled notifications based on the data provided
     *
     * @memberof RoutineScreen
     */
    setScheduledNotifications = () => {
        // In order to schedule notifications we need to caluclate the new
        // routine start time
        const routineStartTime = this.state.sleepTime - this.state.clusters.reduce((sum, cluster) => 
            cluster.duration ? sum + parseInt(cluster.duration) : sum
        , 0);

        // Also schedule notifications for the new sleepTime
        scheduleNotifications(routineStartTime)
            .catch(console.log);
    }

    /**
     * We need to ask for permissions in order to be able to show notifications.
     * We do this every time the app is run, so we never have to deal with it.
     *
     * @returns Promise
     * @memberof RoutineScreen
     */
    registerPushNotifications() {
        // Check if the device is real, since the function will throw an error
        // if it is run from a Simulator
        if (Constants.isDevice) {
            // Ask permissions for notifications
            return Permissions.askAsync(
                Permissions.NOTIFICATIONS,
                Permissions.USER_FACING_NOTIFICATIONS,
            // Then retrieve the the Push token
            ).then(() => Notifications.getExpoPushTokenAsync());
        }
        
        return new Promise.resolve();
    }

    /**
     * We'll retrieve the state from AsyncStorage on update, so we can show
     * previously entered data, even if the app is closed or crashes.
     *
     * @returns
     * @memberof RoutineScreen
     */
    retrieveAsyncStorage() {
        // Retrieve the item from AsyncStorage
        return AsyncStorage.getItem('state')
            .then(data => {
                // Check if there is actually data in the store
                if (data === null) {
                    // If not, throw an error so we can initialise correctly
                    throw new Error('No Data Saved');
                }

                // If there is data, parse the JSON
                const state = JSON.parse(data);
                // Then set the new state
                return this.setState(state);
            })
            .catch(err => {
                // If an error is caught, log it
                console.log('Error while retrieving state from AsyncStorage, setting empty state.')
                console.log(err);

                // Because the error could come from many sources, we just deal
                // with this by initialising the state with an empty cluster,
                // and using the rest of the default state
                this.setState({ clusters: [ emptyCluster ] });
            });
    }

    /**
     * Change the index of the cluster that is currently shown
     *
     * @memberof RoutineScreen
     */
    handleChangeCluster = index => this.setState({ currentCluster: index });

    /**
     * Edit the content of the current shown cluster
     *
     * @memberof RoutineScreen
     */
    handleEditCluster = cluster => {
        // Copy the cluster state to a new variable
        // NOTE: This is very important, as modifying the state directly will
        // subtly break the app
        const clusters = [...this.state.clusters];

        // Set the new cluster data
        clusters[this.state.currentCluster] = cluster;

        // Push it to the state
        this.setState({ clusters });
    }

    /**
     * Add a new cluster
     *
     * @memberof RoutineScreen
     */
    handleAddCluster = () => {
        // Check if there are already five clusters or more
        if (this.state.clusters.length >= 5) {
            // If there are, we cannot add a new one
            return;
        }

        // Push a new state
        this.setState({
            // Copy the old clusters, and add an empty one
            clusters: [
                ...this.state.clusters,
                emptyCluster,
            ],
            // Also set the current cluster to the one that has been created
            currentCluster: this.state.clusters.length,
        });
    }

    /**
     * Delete the currently selected cluster
     *
     * @memberof RoutineScreen
     */
    handleDeleteCluster = () => {
        // Create a copy of the cluster array, with the currently selected
        // cluster filtered from it.
        const clusters = this.state.clusters.filter((d, index) => 
            index !== this.state.currentCluster
        );

        // Push to state
        this.setState({
            // Check if there are any clusters left, if not, initialise an empty
            // cluster
            clusters: clusters.length ? clusters : [ emptyCluster ],
            currentCluster: 0,
        });
    };

    /**
     * Change the currently set sleepTime
     *
     * @memberof RoutineScreen
     */
    handleChangeSleepTime = sleepTime => {
        // Write new time to state
        this.setState({ sleepTime: sleepTime.toString() });
    }

    /**
     * When a cluster has been successfully updated, set the correct new flags
     * for it
     *
     * @memberof RoutineScreen
     */
    handleClusterCompletedUpdate = index => {
        // Copy the clusters
        const clusters = [ ...this.state.clusters ];

        // Set the correct new flags
        clusters[index].shouldUpdate = false;
        clusters[index].lastUpdated = new Date().toString();

        // Push to state
        this.setState({ clusters });
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
                <MQTTConnection 
                    clusters={this.state.clusters} 
                    onClusterCompletedUpdate={this.handleClusterCompletedUpdate}
                />
            </View>
        );
    }
}

// This is where all styles are defined
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

export default RoutineScreen;