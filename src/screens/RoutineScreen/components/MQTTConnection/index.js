import React, { Component } from 'react';
import Paho from 'paho-mqtt';
import { Constants, Notifications } from 'expo';
import { MQTT_HOST, MQTT_USER, MQTT_PASSWORD } from 'react-native-dotenv'

/**
 * The handler component for the MQTT connection.
 *
 * @class MQTTConnection
 * @extends {React.Component}
 */
class MQTTConnection extends Component {
    /**
     * This will store the MQTT Client
     *
     * @memberof MQTTConnection
     */
    client = null;

    /**
     * Flag for whether the client is connected or not
     *
     * @memberof MQTTConnection
     */
    isConnected = false;

    constructor() {
        super();

        // Init the client with the MQTT server
        this.client = new Paho.Client(MQTT_HOST, 'app');

        // Set the handlers for the client
        this.client.onConnectionLost = this.handleDisconnect;
        this.client.onMessageArrived = this.handleMessage;
    }

    /**
     * Actually connect to the MQTT Server when the component is mounted
     *
     * @memberof MQTTConnection
     */
    componentDidMount() {
        this.client.connect({
            userName: MQTT_USER,
            password: MQTT_PASSWORD,
            onSuccess: this.handleConnect,
        });
    }

    /**
     * Disconnect the component when the component is unmounted
     *
     * @returns Promise
     * @memberof MQTTConnection
     */
    componentWillUnmount() {
        return this.client.disconnect();
    }

    /**
     * Whenever the component is updated, we will need to check if there are
     * clusters which need to be updated.
     *
     * @param {*} prevProps
     * @memberof MQTTConnection
     */
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
     * Update the duration data for a single cluster
     *
     * @memberof MQTTConnection
     */
    updateCluster = cluster => {
        // The message data
        const data = {
            // Set the correct event name
            event: 'updateInterval',
            deviceType: 'app',
            deviceUuid: Constants.installationId,
            // Set the correct interval
            interval: cluster.duration,
            // Infer the correct clusterId
            sombreroId: this.props.clusters.indexOf(cluster),
        };

        // Create the message
        const message = new Paho.Message(JSON.stringify(data));
        // Set the name for the topic the message should be sent to
        message.destinationName = '/sleep-routines';
        // Require an acknowledgement for this message
        message.qos = 1;
        // Retain the message, so that any base connecting to the network will
        // receive the message regardless
        message.retained = true;

        // Actually send out the message
        this.client.send(message);
    }

    /**
     * Handle a successful connection to the MQTT Broker
     * 
     * @memberof MQTTConnection
     */
    handleConnect = async () => {
        // Log connection and set correct flag
        console.log('Succesfully connected to MQTT broker!');
        this.isConnected = true;
        
        // Subscribe to the relevant channels
        this.client.subscribe('/sleep-routines', {
            qos: 1,
        });

        // Construct a device connected event
        const connectMessage = {
            event: 'deviceConnected',
            deviceType: 'app',
            deviceUuid: Constants.installationId,
            pushToken: Constants.isDevice ? await Notifications.getExpoPushTokenAsync() : undefined,
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
        // Return null, because the component does not actually render anything
        return null;
    }
}

export default MQTTConnection;