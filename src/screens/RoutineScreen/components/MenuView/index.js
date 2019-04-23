import React from 'react';
import { 
    ScrollView, 
    View, 
    StyleSheet, 
    Text, 
    SafeAreaView, 
    Button 
} from 'react-native';
import Cluster from './components/Cluster';
import SleepTime from './components/SleepTime';
import getTime from '../../../../helpers/getTime';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    scrollView: {
        borderRightColor: '#efefef',
        borderRightWidth: 1,
        backgroundColor: '#f9f9f9',
    },
    button: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    text: {
        color: '#666',
        textAlign: 'center',
        marginTop: 15,
    }
});

class MenuView extends React.Component {
    render() {
        const totalRoutineTime = this.props.clusters.reduce((sum, cluster) => {
            return isNaN(cluster.duration) ? sum : sum + parseInt(cluster.duration);
        }, 0);

        const routineStartTime = new Date(this.props.sleepTime - totalRoutineTime);

        return (
            <ScrollView style={{ ...this.props.style, ...styles.scrollView }} contentContainerStyle={{ flexGrow: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <Text style={styles.text}>{getTime(routineStartTime)}</Text>
                        {this.props.clusters.map((cluster, index) =>
                            <Cluster 
                                cluster={cluster} 
                                isActive={this.props.currentCluster === index} 
                                index={index}
                                onPress={this.props.onChangeCluster}
                                key={index} />
                        )}
                        <SleepTime 
                            sleepTime={this.props.sleepTime} 
                            onChangeSleepTime={this.props.onChangeSleepTime}
                            />
                    </View>
                    <View style={styles.button}>
                        <Button 
                            title="Add" 
                            onPress={this.props.onAddCluster} 
                            style={{ marginTop: 'auto' }} 
                            disabled={this.props.clusters.length >= 5}
                        />
                    </View>
                </SafeAreaView>
            </ScrollView>
        );
    }
}

export default MenuView;