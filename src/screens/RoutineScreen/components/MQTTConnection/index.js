import React from 'react';
import Paho from 'paho-mqtt';
import { Constants, Notifications } from 'expo';
import { MQTT_HOST, MQTT_USER, MQTT_PASSWORD } from 'react-native-dotenv'

class MQTTConnection extends React.Component {
    client = null;
    isConnected = false;

    constructor() {
        super();

        this.client = new Paho.Client(MQTT_HOST, 'app');
        this.client.onConnectionLost = this.handleDisconnect;
        this.client.onMessageArrived = this.handleMessage;
    }

    componentDidMount() {
        this.client.connect({
            userName: MQTT_USER,
            password: MQTT_PASSWORD,
            onSuccess: this.handleConnect,
            onFailure: (error) => console.error('CONNECT FAILED', error),
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
        message.qos = 1;
        message.retained = true;
        this.client.send(message);
    }

    /**
     * Handle a successful connection to the MQTT Broker
     */
    handleConnect = async () => {
        // Log connection and set correct flag
        console.log('Succesfully connected to MQTT broker!');
        this.isConnected = true;
        
        // Subscribe to the relevant channels
        this.client.subscribe('/sleep-routines', {
            qos: 1,
        });

        // Construct message
        const connectMessage = {
            event: 'deviceConnected',
            deviceType: 'app',
            deviceUuid: Constants.installationId,
            pushToken: await Notifications.getExpoPushTokenAsync(),
        };

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
    handleMessage = (data) => {
        // Parse incoming JSON
        const message = JSON.parse(data.payloadString);

        // Log message
        console.log('RECEIVED MESSAGE');
        console.log(message);

        if (message.event === 'updateIntervalAcknowledge') {
            // When an update has been received by a sombrero, pass a completion
            // handler. 
            this.props.onClusterCompletedUpdate(message.sombreroId);
        }
    }

    render() {
        return null;
    }
}

export default MQTTConnection;