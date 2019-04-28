import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// These are the colors for the five clusters. They are used in the order as
// listed here. These should match the base stations
const colors = [
    "#f08566",
    "#f5d2a4",
    "#af8157",
    "#91d0d4",
    "#1b7e90"
];

/**
 * A single cluster in the left-hand MenuView
 *
 * @class Cluster
 * @extends {PureComponent}
 */
class Cluster extends PureComponent {
    /**
     * Return the index of this cluster to the MenuView whenever it is clicked.
     * This is neccessary so that we do not create too many functions in place.
     *
     * @memberof Cluster
     */
    handlePress = () => this.props.onPress(this.props.index);

    render() {
        // Set the correct styles for this cluster
        const clusterStyles = {
            // Apply the default container styles
            ...styles.container,
            // Set the border color
            borderColor: colors[this.props.index],
            // Add the active styles when the cluster is selected
            ...(this.props.isActive ? styles.isActive : {}),
            // And change the backgroundColor when it is selected
            ...(this.props.isActive ? { backgroundColor: colors[this.props.index] } : {}),
        };

        // Same thing for the text styles
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

// The Stylesheet
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

export default Cluster;