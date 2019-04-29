import React, { PureComponent } from 'react';
import { TimePickerAndroid, View, Button } from 'react-native';
import { format, setHours, setMinutes } from 'date-fns';

/**
 * The SleepTime button in the left-hand Menu
 *
 * @class SleepTime
 * @extends {PureComponent}
 */
class SleepTime extends PureComponent {
    /**
     * Open the Android TimePicker and call the component callback when it is completed
     *
     * @returns {Promise}
     * @memberof SleepTime
     */
    pickDate = () => {
        // Call the Android TimePicker
        return TimePickerAndroid.open({ 
                hour: this.props.sleepTime.getHours(),
                minute: this.props.sleepTime.getMinutes(),
                is24Hour: true
            })
            // Deal with the results
            .then(({ action, hour, minute }) => {
                // Check if the dialog has not been dismissed, because if it is,
                // we cannot do anything
                if (action === TimePickerAndroid.dismissedAction) {
                    throw new Error('DatePicker was dismissed')
                }

                // Calculate the new SleepTime date
                const date = setMinutes(
                    setHours(this.props.sleepTime, hour),
                    minute
                );

                // Pass this date to the callback
                return this.props.onChangeSleepTime(date);
            })
            .catch(() => console.log('Date picker failed'))
    }
    
    render() {
        return (
            <View style={{ marginTop: 15, marginBottom: 5 }}>
                <Button 
                    title={format(this.props.sleepTime, 'HH:mm')} 
                    onPress={this.pickDate} 
                />
            </View>
        );
    }
}
    
export default SleepTime;