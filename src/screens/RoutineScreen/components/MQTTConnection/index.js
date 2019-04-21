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

    componentDidUpdate(prevProps) {
        // Create an array with all clusters that need to be updated. This could be multiple clusters
        const updateableClusters = this.props.clusters.filter((cluster, index) => {
            // Check if the updated cluster existed previously
            return typeof prevProps.clusters[index] !== 'undefined'
                // Check if the cluster needs to be updated now
                && cluster.shouldUpdate === true 
                // Check if it didn't need to be updated previously
                && prevProps.clusters[index].shouldUpdate === false;
        });

        // Send off a message for each cluster
        updateableClusters.forEach(this.updateCluster);
    }

    /**
     * Update a single cluster duration
     */
    updateCluster = cluster => {
        const data = {
            event: 'updateInterval',
            deviceType: 'app',
            deviceUuid: Constants.installationId,
            interval: cluster.duration,
            sombreroId: this.props.clusters.indexOf(cluster),
        };

        const message = new Paho.Message(JSON.stringify(data));
        message.destinationName = '/sleep-routines';
        this.client.send(message);
    }

    /**
     * Handle a successful connection to the MQTT Broker
     */
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

    /** Handle MQTT disconnection */
    handleDisconnect = () => this.isConnected = false;

    /**
     * Handle an incoming MQTT message on a subscribed channel
     *
     * @param {*} message
     */
    handleMessage(message) {
        console.log('RECEIVED MESSAGE');
        console.log(message.payloadString);
    }

    render() {
        return null;
    }
}

export default MQTTConnection;