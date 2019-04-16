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
    }
});

class MenuView extends React.Component {
    render() {
        return (
            <ScrollView style={{ ...this.props.style, ...styles.scrollView }} contentContainerStyle={{ flexGrow: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        {this.props.clusters.map((cluster, index) =>
                            <Cluster 
                                cluster={cluster} 
                                isActive={this.props.currentCluster === index} 
                                index={index}
                                onPress={this.props.onChangeCluster}
                                key={index} />
                        )}
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