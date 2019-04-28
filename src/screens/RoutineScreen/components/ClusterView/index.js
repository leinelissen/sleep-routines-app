import React from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    View,
    StyleSheet,
    Button,
    TouchableOpacity,
    ScrollView,
    Picker,
    ActivityIndicator,
} from 'react-native';
import { distanceInWordsToNow } from 'date-fns';

/**
 * This is the component that shows the current cluster. It makes heavy use of
 * the `this.props.onEditCluster` callback, as this is the generic way to update
 * a single cluster.
 *
 * @class ClusterView
 * @extends {React.Component}
 */
class ClusterView extends React.Component {
    /**
     * Change the title for the current cluster
     *
     * @memberof ClusterView
     */
    onChangeTitle = title => 
        this.props.onEditCluster({ ...this.props.cluster, title });

    /**
     * Change the location for the current cluster
     *
     * @memberof ClusterView
     */
    onChangeLocation = location => 
        this.props.onEditCluster({ ...this.props.cluster, location });

    /**
     * Change the duration for the current cluster
     *
     * @memberof ClusterView
     */
    onChangeDuration = duration => 
        this.props.onEditCluster({ 
            ...this.props.cluster, 
            duration,
            // Also set the shouldUpdate flag, as the new duration should be
            // pushed to the base
            shouldUpdate: true 
        });

    /**
     * Create a new activity for the current cluster
     *
     * @memberof ClusterView
     */
    onCreateNewActivity = () => {
        this.props.onEditCluster({ 
            ...this.props.cluster, 
            activities: [ ...this.props.cluster.activities, "" ]}
        );
    }

    /**
     * Delete an activity for the current cluster
     *
     * @memberof ClusterView
     */
    onDeleteActivity = index => {
        const activities = this.props.cluster.activities.filter(
            (d, i) => i !== index
        );

        this.props.onEditCluster({
            ...this.props.cluster,
            activities
        });
    }

    /**
     * Change the description for one of the activities in the current cluster
     *
     * @memberof ClusterView
     */
    onChangeActivity = (text, index) => {
        // Copy the activities to a new variable
        const activities = [ ...this.props.cluster.activities ];
        // Update the activity at the correct index
        activities[index] = text;

        // Push the new activities to the state
        this.props.onEditCluster({
            ...this.props.cluster,
            activities
        });
    }

    render() {
        // If there is no cluster yet, show a spinner.
        // This is because there will not be a selected cluster until the
        // AsyncStorage call returns. If it fails we init with a fresh, new cluster.
        if (!this.props.cluster) {
            return <ActivityIndicator />;
        }
        
        return (
            <ScrollView>
                <SafeAreaView style={{ flex: 1 }}>
                    <Text style={styles.title}>Cluster</Text>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input}
                            value={this.props.cluster.title} 
                            onChangeText={this.onChangeTitle}
                            placeholder="Title"
                            multiline={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input}
                            value={this.props.cluster.location} 
                            onChangeText={this.onChangeLocation}
                            placeholder="Location"
                            multiline
                        />
                    </View>
                    <Text style={styles.arrayTitle}>ACTIVITIES</Text>
                    <View style={styles.arrayInputContainer}>
                        {this.props.cluster.activities.map((activity, index) => 
                            <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }} key={index}>
                                <TouchableOpacity onPress={() => this.onDeleteActivity(index)}>
                                    <Text style={styles.buttonDelete}>-</Text>
                                </TouchableOpacity>
                                <TextInput 
                                    style={styles.arrayInput}
                                    value={activity} 
                                    onChangeText={(text) => this.onChangeActivity(text, index)}
                                    placeholder={"New activity"}
                                    multiline={false}
                                />
                            </View>
                        )}
                        <Button title="+" color="#4cd964" onPress={this.onCreateNewActivity} />
                    </View>
                    <View style={{ ...styles.inputContainer, position: 'relative'}}>
                        <View 
                            style={{ 
                                ...styles.pickerOverlay, 
                                display: this.props.cluster.shouldUpdate ? 'flex' : 'none'
                            }}
                        >
                            <ActivityIndicator />
                        </View>
                        <Text style={styles.arrayTitle}>DURATION</Text>
                        <Picker 
                            selectedValue={this.props.cluster.duration}
                            onValueChange={this.onChangeDuration}
                        >
                            {[...new Array(30)].map((n, i) => 
                                <Picker.Item 
                                    label={`${i + 1}${i >= 1 ? ' minutes' : ' minute'}`} 
                                    value={(i+1)*60*1000}
                                    key={i} />    
                            )}
                        </Picker>
                    </View>
                    <View style={styles.textCenter}>
                        <Text style={{color: '#ccc'}}>Last updated: {this.props.cluster.lastUpdated 
                            ? distanceInWordsToNow(new Date(this.props.cluster.lastUpdated), { includeSeconds: true })
                            : 'Never'
                        }</Text>
                    </View>
                    <Button title="Delete" color="#ff3b30" onPress={this.props.onDeleteCluster} />
                </SafeAreaView>      
            </ScrollView>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 35,
    },
    input: {
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingRight: 15,
        marginLeft: 10,
        paddingTop: 15,
        paddingBottom: 15,
    },
    title: {
        marginBottom: 35,
        marginTop: 20,
        marginLeft: 10,
    },
    arrayInput: {
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingRight: 15,
        marginLeft: 10,
        paddingTop: 15,
        paddingBottom: 15,
        width: '100%',
    },
    arrayInputContainer: {
        marginBottom: 35,
        borderTopColor: '#eee',
        borderTopWidth: 1,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    arrayTitle: {
        color: '#ccc',
        fontSize: 12,
        marginLeft: 10,
        marginBottom: 10,
        width: '100%',
    },
    buttonDelete: {
        backgroundColor: "#ff3b30",
        width: 15,
        height: 15,
        lineHeight: 15,
        textAlign: 'center',
        borderRadius: 7.5,
        overflow: 'hidden',
        color: 'white',
        marginLeft: 10,
    },
    textCenter: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 15,
    },
    pickerOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
});

export default ClusterView;