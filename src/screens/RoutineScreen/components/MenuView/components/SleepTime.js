import React, { Component } from 'react';
import {
    Picker,
    Modal,
    Text,
    TouchableOpacity,
    StyleSheet,
    Button,
    DatePickerIOS,
    View,
    SafeAreaView
} from 'react-native';
import getTime from '../../../../../helpers/getTime';

const styles = {
    modal: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    }
};

class SleepTime extends Component {
    state = {
        modalIsOpen: false,
    }

    openModal = () => this.setState({ modalIsOpen: true });

    closeModal = () => this.setState({ modalIsOpen: false });

    render() {
        return (
            <View>
                <Button 
                    title={getTime(this.props.sleepTime)} 
                    onPress={this.openModal} 
                />
                <Modal visible={this.state.modalIsOpen} animationType="slide">
                    <View style={styles.modal}>
                        <SafeAreaView style={styles.closeButton}>
                            <Button title={"\u00D7"} color="#aaa" onPress={this.closeModal} />
                        </SafeAreaView>
                        <Text style={styles.text}>Choose a sleeptime:</Text>
                        <DatePickerIOS 
                            mode="time" 
                            date={this.props.sleepTime} 
                            onDateChange={this.props.onChangeSleepTime}
                        />
                        <Button title="Save" onPress={this.closeModal} />
                    </View>
                </Modal>
            </View>
        );
    }
}

export default SleepTime;