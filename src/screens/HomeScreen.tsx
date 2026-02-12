import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { Strings } from '../constants/Strings';
import { ArcReactor } from '../components/ArcReactor';
import { LinearGradient } from 'expo-linear-gradient';
import { voiceService } from '../services/VoiceService';
import { LLMService } from '../services/LLMService';
import { TtsService } from '../services/TtsService';
import { CommandService } from '../services/CommandService';
import { PermissionHelper } from '../utils/PermissionHelper';
import { NetworkHelper } from '../utils/NetworkHelper';
import { HindiHelper } from '../utils/HindiHelper';

export const HomeScreen = () => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const [logs, setLogs] = useState<{ type: 'user' | 'system' | 'error', text: string }[]>([
        { type: 'system', text: Strings.SYSTEM_ONLINE }
    ]);

    // Initialize on mount
    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        // Initialize network monitoring
        NetworkHelper.initialize();

        // Check network status
        const online = await NetworkHelper.checkConnection();
        setIsOnline(online);

        // Request permissions
        const permissions = await PermissionHelper.requestAllPermissions();
        console.log('Permissions:', permissions);

        // Add greeting
        const greeting = HindiHelper.getGreeting();
        addLog('system', greeting);
    };

    const addLog = (type: 'user' | 'system' | 'error', text: string) => {
        setLogs(prev => [...prev, { type, text }]);
    };

    const handleToggleListening = async () => {
        if (isListening) {
            // Stop Listening
            await voiceService.stopListening();
            setIsListening(false);
        } else {
            // Check network first
            if (!isOnline) {
                addLog('error', Strings.ERROR_NO_INTERNET);
                Alert.alert('Offline', Strings.ERROR_NO_INTERNET);
                return;
            }

            // Start Listening
            try {
                addLog('system', Strings.SYSTEM_LISTENING);

                await voiceService.startListening((text, isFinal) => {
                    if (isFinal) {
                        setIsListening(false);
                        setIsProcessing(true);
                        addLog('user', text);
                        handleAIResponse(text);
                    }
                }, (error) => {
                    console.error(error);
                    setIsListening(false);
                    addLog('error', Strings.ERROR_VOICE_FAILED);
                });

                setIsListening(true);
            } catch (e) {
                console.error(e);
                addLog('error', Strings.ERROR_VOICE_FAILED);
                Alert.alert('Error', Strings.ERROR_VOICE_FAILED);
            }
        }
    };

    const handleAIResponse = async (userText: string) => {
        try {
            // Get AI response
            const aiResponse = await LLMService.getResponse(userText);
            let textToSpeak = aiResponse;

            // Check for action commands
            const actionRegex = /\[ACTION:([A-Z_]+):?(.*?)\]/g;
            let match;
            const actions: { action: string; value: string }[] = [];

            // Extract all actions
            while ((match = actionRegex.exec(aiResponse)) !== null) {
                actions.push({
                    action: match[1],
                    value: match[2] || ''
                });
            }

            // Remove action tags from speech text
            textToSpeak = aiResponse.replace(actionRegex, '').trim();

            // Execute all actions
            for (const { action, value } of actions) {
                try {
                    const result = await CommandService.executeCommand(action, value);
                    console.log(`Command ${action} result:`, result);
                } catch (error) {
                    console.error(`Command ${action} failed:`, error);
                }
            }

            setIsProcessing(false);
            setIsSpeaking(true);
            addLog('system', textToSpeak);

            // Speak the response
            TtsService.speak(textToSpeak, () => {
                setIsSpeaking(false);
            });
        } catch (error) {
            console.error('AI Response error:', error);
            setIsProcessing(false);
            addLog('error', Strings.ERROR_UNKNOWN);
        }
    };

    const getStatusText = (): string => {
        if (!isOnline) return Strings.STATUS_OFFLINE;
        if (isListening) return Strings.STATUS_LISTENING;
        if (isProcessing) return Strings.STATUS_PROCESSING;
        if (isSpeaking) return Strings.STATUS_SPEAKING;
        return Strings.STATUS_STANDBY;
    };

    const getStatusColor = (): string => {
        if (!isOnline) return Colors.secondary;
        if (isListening) return Colors.primary;
        if (isProcessing || isSpeaking) return '#ffaa00';
        return Colors.primary;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
            <LinearGradient
                colors={[Colors.background, '#1a1a1a']}
                style={styles.background}
            />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{Strings.APP_NAME}</Text>
                <Text style={styles.headerSubtitle}>{Strings.APP_SUBTITLE}</Text>

                {/* Network Status Indicator */}
                <View style={styles.networkIndicator}>
                    <View style={[
                        styles.networkDot,
                        { backgroundColor: isOnline ? '#00ff00' : '#ff0000' }
                    ]} />
                    <Text style={styles.networkText}>
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </Text>
                </View>
            </View>

            {/* Arc Reactor */}
            <View style={styles.reactorContainer}>
                <TouchableOpacity
                    onPress={handleToggleListening}
                    disabled={isSpeaking || isProcessing || !isOnline}
                    activeOpacity={0.8}
                >
                    <ArcReactor
                        listening={isListening}
                        speaking={isSpeaking || isProcessing}
                    />
                </TouchableOpacity>

                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    {getStatusText()}
                </Text>

                <Text style={styles.hintText}>
                    {isListening ? 'Suniye Sir...' : 'Tap to Speak'}
                </Text>
            </View>

            {/* Conversation Logs */}
            <ScrollView
                style={styles.logContainer}
                contentContainerStyle={styles.logContent}
                ref={ref => ref?.scrollToEnd({ animated: true })}
            >
                {logs.map((log, index) => (
                    <View key={index} style={[
                        styles.logItem,
                        log.type === 'user' && styles.logItemUser
                    ]}>
                        <Text style={[
                            styles.logText,
                            log.type === 'user' && styles.userLog,
                            log.type === 'system' && styles.systemLog,
                            log.type === 'error' && styles.errorLog
                        ]}>
                            {log.type === 'system' ? '> ' : ''}
                            {log.type === 'error' ? '⚠ ' : ''}
                            {log.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* Quick Actions (Optional - can be added later) */}
            {/* <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickButton}>
                    <Text style={styles.quickButtonText}>⚙️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickButton}>
                    <Text style={styles.quickButtonText}>📜</Text>
                </TouchableOpacity>
            </View> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    header: {
        paddingTop: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        letterSpacing: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.textDim,
        letterSpacing: 2,
        marginTop: 5,
    },
    networkIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    networkDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    networkText: {
        fontSize: 10,
        color: Colors.textDim,
        letterSpacing: 1,
    },
    reactorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    statusText: {
        marginTop: 20,
        fontSize: 18,
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    hintText: {
        marginTop: 8,
        fontSize: 12,
        color: Colors.textDim,
        letterSpacing: 1,
    },
    logContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    logContent: {
        paddingBottom: 20,
    },
    logItem: {
        marginBottom: 12,
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 212, 255, 0.05)',
    },
    logItemUser: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignSelf: 'flex-end',
        maxWidth: '80%',
    },
    logText: {
        fontSize: 15,
        fontFamily: 'monospace',
        lineHeight: 20,
    },
    userLog: {
        color: Colors.textDim,
        textAlign: 'right',
    },
    systemLog: {
        color: Colors.text,
        textAlign: 'left',
    },
    errorLog: {
        color: Colors.secondary,
        textAlign: 'left',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 40,
        paddingBottom: 20,
    },
    quickButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.hudBorder,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickButtonText: {
        fontSize: 24,
    },
});
