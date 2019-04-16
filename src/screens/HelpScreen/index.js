import React from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 25,
        height: '100%',
    },
    title: {
        fontSize: 24,
        marginBottom: 15,
    },
    paragraph: {
        textAlign: 'justify',
        marginBottom: 15,
        lineHeight: 22,
    }
});

const Heading = ({ children }) => <Text style={styles.title}>{children}</Text>;
const Paragraph = ({ children }) => <Text style={styles.paragraph}>{children}</Text>;

class HelpScreen extends React.Component {
    render() {
        return (
            <SafeAreaView>
                <ScrollView style={styles.container}>
                    <Heading>Help!</Heading>
                    <Paragraph>We trust you can figure out how to work with our stuffs. When in dire need, contact Axel.</Paragraph>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default HelpScreen;