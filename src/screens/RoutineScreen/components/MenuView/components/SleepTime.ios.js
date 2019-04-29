import React, { PureComponent } from 'react';
import {
    Modal,
    Text,
    Button,
    DatePickerIOS,
    View,
    SafeAreaView
} from 'react-native';
import { format } from 'date-fns';

/**
 * The SleepTime button in the left-hand Menu
 *
 * @class SleepTime
 * @extends {PureComponent}
 */
class SleepTime extends PureComponent {
    /**
     * The default state for the component
     *
     * @memberof SleepTime
     */
    state = {
        // The modal is closed by default
        modalIsOpen: false,
    }

    /**
     * Open the moal
     *
     * @memberof SleepTime
     */
    openModal = () => this.setState({ modalIsOpen: true });

    /**
     * Close the modal
     *
     * @memberof SleepTime
     */
    closeModal = () => this.setState({ modalIsOpen: false });

    render() {
        return (
            <View>
                <Button 
                    title={format(this.props.sleepTime, 'HH:mm')} 
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

// The stylesheet
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

export default SleepTime;