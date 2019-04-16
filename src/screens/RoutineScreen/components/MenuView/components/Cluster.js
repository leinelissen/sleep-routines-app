import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        marginTop: 10,
        padding: 10,
        backgroundColor: 'transparent',
        borderWidth: 5,
    },
    text: {
        marginLeft: 'auto',
        textAlign: 'right',
    },
    isActive: {
        borderWidth: 0,
        padding: 15,
    } 
});

const colors = [
    "#f08566",
    "#f5d2a4",
    "#af8157",
    "#91d0d4",
    "#1b7e90"
];

class Cluster extends React.Component {
    handlePress = () => this.props.onPress(this.props.index);

    render() {
        const clusterStyles = {
            ...styles.container,
            borderColor: colors[this.props.index],
            ...(this.props.isActive ? styles.isActive : {}),
            ...(this.props.isActive ? { backgroundColor: colors[this.props.index] } : {}),
        };

        const textStyles = {
            ...styles.text,
            color: this.props.isActive ? 'white' : 'grey',
        };

        return (
            <TouchableOpacity onPress={this.handlePress}>
                <View style={clusterStyles}>
                    <Text style={textStyles}>{this.props.index + 1}</Text>
                    <Text style={textStyles}>{this.props.cluster.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default Cluster;