import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../context/ChatContext';
import { COLORS, SHADOWS } from '../config/theme';

export default function FloatingChatIcon() {
  const { toggleChat, isOpen, unreadCount } = useChat();
  
  // Animation values
  const scale = useSharedValue(0);
  const bounce = useSharedValue(1);

  useEffect(() => {
    // Initial pop-in
    scale.value = withSpring(1, { damping: 12, stiffness: 90 });
  }, []);

  useEffect(() => {
    if (unreadCount > 0 && !isOpen) {
      // Gentle bounce when a new message arrives
      bounce.value = withSequence(
        withTiming(1.1, { duration: 150 }),
        withTiming(1, { duration: 150 }),
        withTiming(1.05, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [unreadCount, isOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value * bounce.value }],
    };
  });

  if (isOpen) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={toggleChat}
      >
        <Ionicons name="chatbubbles" size={28} color={COLORS.onPrimary} />
        
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100, // Above bottom tab bar
    right: 20,
    zIndex: 999,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.error,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surfaceContainerLowest,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
