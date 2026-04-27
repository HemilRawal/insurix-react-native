import React, { createContext, useState, useContext, useCallback } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi there! I am your InsurX virtual assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date().toISOString(),
      quickReplies: ['Explain Features', 'View Plans', 'Pay Premium', 'Help'],
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        setUnreadCount(0); // Clear unread when opening
      }
      return !prev;
    });
  }, []);

  const triggerBotMessage = useCallback((text, quickReplies = []) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      isUser: false,
      timestamp: new Date().toISOString(),
      quickReplies,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    setIsOpen((prevIsOpen) => {
      if (!prevIsOpen) {
        setUnreadCount((prevCount) => prevCount + 1);
      }
      return prevIsOpen;
    });
  }, []);

  const sendMessage = useCallback((text) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Simple mock AI response engine
    setTimeout(() => {
      let botResponse = "I'm sorry, I didn't quite catch that. Could you try asking in another way?";
      let replies = [];
      const lowerText = text.toLowerCase();

      if (lowerText.includes('explain') || lowerText.includes('features')) {
        botResponse = "InsurX offers seamless policy management, instant claim filing, and real-time premium tracking. What would you like to explore first?";
        replies = ['Claim Tracking', 'Premium Payment'];
      } else if (lowerText.includes('plan') || lowerText.includes('coverage')) {
        botResponse = "We have Basic, Standard, and Premium health coverage plans tailored for you. Would you like to compare them?";
        replies = ['Compare Plans'];
      } else if (lowerText.includes('pay') || lowerText.includes('premium')) {
        botResponse = "You can pay your premium directly from the Dashboard. It's quick and secure!";
        replies = ['Go to Dashboard'];
      } else if (lowerText.includes('help')) {
        botResponse = "I can guide you through our features, help you compare plans, or remind you about upcoming payments. What do you need?";
        replies = ['Explain Features', 'View Plans'];
      } else if (lowerText.includes('claim')) {
         botResponse = "Claim tracking lets you monitor the real-time status of your submitted claims directly from your profile.";
      }

      triggerBotMessage(botResponse, replies);
    }, 1000);
  }, [triggerBotMessage]);

  const value = {
    isOpen,
    toggleChat,
    messages,
    sendMessage,
    unreadCount,
    triggerBotMessage,
    setIsOpen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
