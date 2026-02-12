import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { Colors } from '../constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

interface ArcReactorProps {
    listening: boolean;
    speaking: boolean;
}

export const ArcReactor: React.FC<ArcReactorProps> = ({ listening, speaking }) => {
    const spinValue = new Animated.Value(0);
    const pulseValue = new Animated.Value(1);

    useEffect(() => {
        // Rotation Animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Pulse Animation based on state
        if (listening || speaking) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseValue, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseValue, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseValue.setValue(1);
        }
    }, [listening, speaking]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Svg height="200" width="200" viewBox="0 0 200 200">
                {/* Core Glow */}
                <AnimatedCircle
                    cx="100"
                    cy="100"
                    r="40"
                    fill={Colors.reactorCore}
                    opacity={0.8}
                    scale={pulseValue}
                />

                {/* Outer Ring */}
                <Circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke={Colors.primary}
                    strokeWidth="4"
                    fill="none"
                    opacity={0.5}
                />

                {/* Rotating Elements */}
                <AnimatedG rotation={spin} origin="100, 100">
                    <Circle
                        cx="100"
                        cy="100"
                        r="70"
                        stroke={Colors.primary}
                        strokeWidth="2"
                        strokeDasharray="20, 10"
                        fill="none"
                    />
                    <Path
                        d="M100 20 L100 40 M180 100 L160 100 M100 180 L100 160 M20 100 L40 100"
                        stroke={Colors.secondary}
                        strokeWidth="3"
                    />
                </AnimatedG>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 10,
    },
});
