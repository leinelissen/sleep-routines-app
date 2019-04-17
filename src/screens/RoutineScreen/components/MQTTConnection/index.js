import React from 'react';
import Paho from 'paho-mqtt';
import { Constants } from 'expo';
import { MQTT_HOST, MQTT_USER, MQTT_PASSWORD } from 'react-native-dotenv'

const connectMessage = {
    event: 'deviceConnected',
    deviceType: 'app',
    deviceUuid: Constants.installationId,
};

class MQTTConnection extends React.Component {
    client = null;
    isConnected = false;

    constructor() {
        super();

        this.client = new Paho.Client(MQTT_HOST, 'app');
        this.client.onConnectionLost = this.handleDisconnect;
        this.client.onMessageDelivered = this.handleMessage;
        // this.client.onConnected = this.handleConnect;
    }

    componentDidMount() {
        this.client.connect({
            userName: MQTT_USER,
            password: MQTT_PASSWORD,
            onSuccess: this.handleConnect,
            onFailure: (error) => console.log('CONNECT FAILED', error),
        });
    }

    componentWillUnmount() {
        return this.client.disconnect();
    }

    handleConnect = () => {
        // Log connection and set correct flag
        console.log('Succesfully connected to MQTT broker!');
        this.isConnected = true;
        
        // Subscribe to the relevant channels
        this.client.subscribe('/sleep-routines');

        // Send a connection message
        const message = new Paho.Message(JSON.stringify(connectMessage));
        message.destinationName = '/sleep-routines';
        this.client.send(message);
    }

    handleDisconnect = () => this.isConnected = false;

    handleMessage(message) {
        console.log('RECEIVED MESSAGE');
        console.log(message.payloadString);
    }

    render() {
        return null;
    }
}

export default MQTTConnection;