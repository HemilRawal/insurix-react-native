import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../context/ChatContext';
import { COLORS, FONTS, SPACING, RADIUS } from '../config/theme';

export default function ChatWindow() {
  const { isOpen, toggleChat, messages, sendMessage } = useChat();
  const [inputText, setInputText] = useState('');
  const translateY = useSharedValue(1000);
  const opacity = useSharedValue(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 150,
      });
    } else {
      translateY.value = withTiming(1000, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isOpen]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const renderMessage = ({ item }) => {
    const isBot = !item.isUser;
    return (
      <View style={styles.messageWrapper}>
        <View style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble
        ]}>
          <Text style={[
            styles.messageText,
            isBot ? styles.botMessageText : styles.userMessageText
          ]}>
            {item.text}
          </Text>
        </View>
        
        {isBot && item.quickReplies && item.quickReplies.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.quickRepliesContainer}
            contentContainerStyle={{ paddingRight: SPACING.md }}
          >
            {item.quickReplies.map((reply, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickReplyButton}
                onPress={() => handleQuickReply(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  // If completely closed and animation finished, unmount to save resources
  if (!isOpen && translateY.value === 1000) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents={isOpen ? "auto" : "none"}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.avatar}>
              <Ionicons name="sparkles" size={16} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.headerTitle}>InsurX Assistant</Text>
              <Text style={styles.headerSubtitle}>Always here to help</Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleChat} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.micButton}>
            <Ionicons name="mic-outline" size={24} color={COLORS.outline} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.outline}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={200}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  keyboardView: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    height: '80%',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainer,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  headerTitle: {
    ...FONTS.labelBold,
    fontSize: 16,
    color: COLORS.onSurface,
  },
  headerSubtitle: {
    ...FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  messageList: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  messageWrapper: {
    marginBottom: SPACING.lg,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surfaceContainerLow,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    ...FONTS.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
  },
  botMessageText: {
    color: COLORS.onSurface,
  },
  userMessageText: {
    color: COLORS.onPrimary,
  },
  quickRepliesContainer: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
  },
  quickReplyButton: {
    backgroundColor: COLORS.primaryFixedDim,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
  },
  quickReplyText: {
    color: COLORS.primary,
    ...FONTS.labelBold,
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainer,
    backgroundColor: COLORS.surfaceContainerLowest,
  },
  micButton: {
    padding: SPACING.sm,
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 100,
    ...FONTS.bodyRegular,
    fontSize: 15,
    color: COLORS.onSurface,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.outlineVariant,
  },
});
