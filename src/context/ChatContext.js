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

    // Smart conversational AI response engine
    setTimeout(() => {
      let botResponse = "I'm sorry, I didn't quite catch that. Could you try rephrasing? I can help with plans, claims, payments, dependents, and more!";
      let replies = ['Explain Features', 'View Plans', 'Help'];
      const lowerText = text.toLowerCase().trim();

      // --- Greetings ---
      if (/^(hi|hello|hey|hii+|hola|yo|sup|what'?s up|howdy|good morning|good afternoon|good evening)/.test(lowerText)) {
        botResponse = "Hey there! 👋 Welcome to InsurX. I'm your virtual insurance assistant. How can I help you today?";
        replies = ['Explain Features', 'View Plans', 'File a Claim', 'Help'];
      }
      // --- How are you ---
      else if (/how are you|how('s| is) it going|how do you do/.test(lowerText)) {
        botResponse = "I'm doing great, thanks for asking! 😊 I'm always ready to help you with your insurance needs. What can I do for you?";
        replies = ['View Plans', 'Help'];
      }
      // --- App quality / reviews ---
      else if (/how good|how is this app|is this app good|rate this app|app review|what do you think of this app|is insurix good|is this good/.test(lowerText)) {
        botResponse = "InsurX is designed to make insurance simple and stress-free! 🌟 With features like instant claim filing, AI-powered risk assessment, plan comparison, and real-time tracking — our users love it. We're rated 4.8/5 by our members!";
        replies = ['Explain Features', 'View Plans'];
      }
      // --- What is this app ---
      else if (/what is this app|what does this app do|tell me about this app|what is insurix|about this app/.test(lowerText)) {
        botResponse = "InsurX is a smart health insurance management app. You can manage your policy, file claims instantly, track your risk score, compare plans, add dependents, and much more — all from your phone! 📱";
        replies = ['Explain Features', 'View Plans'];
      }
      // --- Thank you ---
      else if (/thank|thanks|thx|ty|appreciate|gracias/.test(lowerText)) {
        botResponse = "You're welcome! 😊 Happy to help. Is there anything else I can assist you with?";
        replies = ['View Plans', 'Help'];
      }
      // --- Goodbye ---
      else if (/bye|goodbye|see you|later|cya|take care|good night/.test(lowerText)) {
        botResponse = "Goodbye! 👋 Take care and stay healthy. I'm here anytime you need help!";
        replies = [];
      }
      // --- Who are you ---
      else if (/who are you|what are you|your name|what's your name/.test(lowerText)) {
        botResponse = "I'm InsurX Assistant, your AI-powered insurance helper! 🤖 I can answer questions about your policy, help you file claims, compare plans, and more.";
        replies = ['Explain Features', 'Help'];
      }
      // --- Features ---
      else if (lowerText.includes('explain') || lowerText.includes('features') || lowerText.includes('what can you do')) {
        botResponse = "InsurX offers:\n\n📋 Seamless policy management\n⚡ Instant claim filing with auto-approval\n📊 AI-powered risk assessment\n🔄 Real-time premium tracking\n👨‍👩‍👧 Dependent management\n📈 Plan comparison tools\n\nWhat would you like to explore first?";
        replies = ['Claim Tracking', 'Premium Payment', 'Dependents'];
      }
      // --- Plans ---
      else if (lowerText.includes('plan') || lowerText.includes('coverage') || lowerText.includes('compare')) {
        botResponse = "We have Basic, Standard, and Premium health coverage plans tailored for you. Each plan comes with different coverage levels and benefits. Would you like to compare them?";
        replies = ['Compare Plans'];
      }
      // --- Claims ---
      else if (lowerText.includes('claim') || lowerText.includes('file') || lowerText.includes('submit')) {
        botResponse = "You can file a new claim from the Dashboard by tapping 'New Claim'. Once submitted, your claim is auto-approved and the amount will be credited to your account within 10 business days! 🎉";
        replies = ['File a Claim', 'Claim Tracking'];
      }
      // --- Dependents ---
      else if (lowerText.includes('dependent') || lowerText.includes('family') || lowerText.includes('member')) {
        botResponse = "You can manage your dependents (spouse, children, parents) from the Dashboard. Tap 'Dependents' to view, add, or update family members covered under your policy. 👨‍👩‍👧‍👦";
        replies = ['Add Dependent'];
      }
      // --- Payment / Premium ---
      else if (lowerText.includes('pay') || lowerText.includes('premium') || lowerText.includes('billing') || lowerText.includes('cost')) {
        botResponse = "You can pay your premium directly from the Dashboard. It's quick and secure! Your current plan renewal is coming up soon — would you like to lock in your current rate?";
        replies = ['Go to Dashboard', 'Lock Rate'];
      }
      // --- Risk score ---
      else if (lowerText.includes('risk') || lowerText.includes('score') || lowerText.includes('health score')) {
        botResponse = "Your risk score is calculated using AI based on your health profile, lifestyle, and medical history. A lower score means better health and potentially lower premiums! 📊";
        replies = ['View My Score'];
      }
      // --- Help ---
      else if (lowerText.includes('help') || lowerText.includes('support') || lowerText.includes('assist')) {
        botResponse = "I can help you with:\n\n🏥 Filing insurance claims\n📋 Viewing & comparing plans\n💳 Premium payments\n👨‍👩‍👧 Managing dependents\n📊 Understanding your risk score\n\nWhat would you like to know more about?";
        replies = ['Explain Features', 'View Plans', 'File a Claim'];
      }
      // --- Yes / OK ---
      else if (/^(yes|yeah|yep|ok|okay|sure|alright|yup|ya)$/.test(lowerText)) {
        botResponse = "Great! How can I help you? Feel free to ask me anything about your insurance. 😊";
        replies = ['Explain Features', 'View Plans', 'Help'];
      }
      // --- No ---
      else if (/^(no|nope|nah|not really|nothing)$/.test(lowerText)) {
        botResponse = "No worries! I'm here whenever you need me. Have a great day! 🌟";
        replies = [];
      }

      triggerBotMessage(botResponse, replies);
    }, 800);
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
