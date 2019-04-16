import React from 'react';
import { SafeAreaView, Text, TextInput, View, StyleSheet, Button, TouchableOpacity, ScrollView } from 'react-native';

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
    }
})

class ClusterView extends React.Component {
    onChangeTitle = title => 
        this.props.onEditCluster({ ...this.props.cluster, title });

    onChangeLocation = location => 
        this.props.onEditCluster({ ...this.props.cluster, location });

    onChangeDuration = duration => 
        this.props.onEditCluster({ ...this.props.cluster, duration });

    onCreateNewActivity = () =>
        this.props.onEditCluster({ ...this.props.cluster, activities: [ ...this.props.cluster.activities, "" ]});

    onDeleteActivity = index => this.props.onEditCluster({
        ...this.props.cluster,
        activities: this.props.cluster.activities.filter(
            (d, i) => i !== index
        )
    });

    onChangeActivity = (text, index) => {
        const activities = this.props.cluster.activities;
        activities[index] = text;

        this.props.onEditCluster({
            ...this.props.cluster,
            activities
        });
    }

    render() {
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
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.input}
                            value={this.props.cluster.duration} 
                            onChangeText={this.onChangeDuration}
                            keyboardType="number-pad"
                            placeholder="Duration"
                            multiline={false}
                        />
                    </View>
                    <Button title="Delete" color="#ff3b30" onPress={this.props.onDeleteCluster} />
                </SafeAreaView>      
            </ScrollView>
        );
    }
}

export default ClusterView;