import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, AsyncStorage } from 'react-native';
import MenuView from './components/MenuView';
import ClusterView from './components/ClusterView';
import MQTTConnection from './components/MQTTConnection';

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
}

class RoutineScreen extends React.Component {
    state = {
        clusters: [],
        currentCluster: 0,
    };
    
    componentDidMount() {
        AsyncStorage.getItem('clusters')
            .then(data => {
                console.log('DATALOADED', data);
                if (data === null) {
                    throw new Error('No Data Saved');
                }
                const clusters = JSON.parse(data);
                this.setState({ clusters });
            })
            .catch(err => {
                this.setState({ clusters: [ emptyCluster ] });
            });
    }

    componentDidUpdate() {
        AsyncStorage.setItem('clusters', JSON.stringify(this.state.clusters));
    }

    // Change the current cluster index
    handleChangeCluster = index => this.setState({ currentCluster: index });


    // Replace the current cluster with new data
    handleEditCluster = cluster => {
        const clusters = this.state.clusters;
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

    render() {
        return (
            <View style={styles.container}>
                <MenuView 
                    style={styles.menu} 
                    clusters={this.state.clusters} 
                    currentCluster={this.state.currentCluster}
                    onChangeCluster={this.handleChangeCluster}
                    onAddCluster={this.handleAddCluster} 
                />
                <ClusterView
                    cluster={this.state.clusters[this.state.currentCluster]}
                    onEditCluster={this.handleEditCluster}
                    onDeleteCluster={this.handleDeleteCluster}
                />
                <MQTTConnection />
            </View>
        );
    }
}

export default RoutineScreen;