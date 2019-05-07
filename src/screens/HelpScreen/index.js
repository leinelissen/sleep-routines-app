import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet, Button } from 'react-native';
import { Linking, WebBrowser } from 'expo';

/**
 * This screen will display help info
 *
 * @class HelpScreen
 * @extends {React.Component}
 */
class HelpScreen extends React.Component {
    callAxel = () => {
        return Linking.openURL('https://wa.me/31681148378');
    }

    openYoutubeVideo = () => {
        return WebBrowser.openBrowserAsync('https://www.youtube.com/embed/OtZH6B4wdGQ');
    }

    render() {
        return (
            <SafeAreaView>
                <ScrollView style={styles.container}>
                    <Heading>Help!</Heading>
                    <Paragraph>If you need any help, please do not hesitate to contact Axel directly:</Paragraph>
                    <Link onPress={this.callAxel}>Axel: +31 6 81148378</Link>
                    <Link onPress={this.openYoutubeVideo}>View the Instruction Video</Link>
                    <Heading>How-to</Heading>
                    <Paragraph>Howto info</Paragraph>
                    <Heading>Troubleshooting</Heading>
                    <Question>There is a spinner in one of my clusters, and I cannot edit its duration.</Question>
                    <Paragraph>Please make sure to connect all the docks first, before you try to change any of the cluster durations. If you have done so, you need to delete this particular cluster, and create it from scratch.</Paragraph>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

// These contain all styles
const styles = StyleSheet.create({
    container: {
        padding: 25,
        height: '100%',
    },
    title: {
        fontSize: 24,
        marginBottom: 15,
        marginTop: 30,
        fontWeight: '800'
    },
    paragraph: {
        textAlign: 'justify',
        marginBottom: 15,
        lineHeight: 22,
    },
    question: {
        marginBottom: 10,
        lineHeight: 22,
        fontStyle: 'italic',
    }
});

// We'll create some helpers elements, so that it is easier to write text
const Heading = ({ children, ...props }) => <Text style={styles.title} {...props}>{children}</Text>;
const Paragraph = ({ children, ...props }) => <Text style={styles.paragraph} {...props}>{children}</Text>;
const Link = ({ children, ...props }) => <Button style={styles.link} title={children} {...props} />;
const Question = ({ children }) => <Text style={styles.question}>{children}</Text>

export default HelpScreen;