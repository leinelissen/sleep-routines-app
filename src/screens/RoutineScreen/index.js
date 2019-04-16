import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import MenuView from './components/MenuView';
import ClusterView from './components/ClusterView';

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
        clusters: [
            emptyCluster,
        ],
        currentCluster: 0,
    };

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
            </View>
        );
    }
}

export default RoutineScreen;