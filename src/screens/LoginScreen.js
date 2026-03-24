import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { COLORS, RADIUS } from '../config/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutExpiry, setLockoutExpiry] = useState(null);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedAttempts = await AsyncStorage.getItem('login_failed_attempts');
        const storedExpiry = await AsyncStorage.getItem('login_lockout_expiry');
        if (storedAttempts) setFailedAttempts(parseInt(storedAttempts, 10));
        if (storedExpiry) setLockoutExpiry(parseInt(storedExpiry, 10));
      } catch (e) { }
    };
    loadState();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');

    let currentAttempts = failedAttempts;
    let currentExpiry = lockoutExpiry;

    if (currentExpiry && Date.now() >= currentExpiry) {
      currentAttempts = 0;
      currentExpiry = null;
      setFailedAttempts(0);
      setLockoutExpiry(null);
      await AsyncStorage.removeItem('login_failed_attempts');
      await AsyncStorage.removeItem('login_lockout_expiry');
    }

    if (currentExpiry && Date.now() < currentExpiry) {
      return Alert.alert('Account Locked', 'Please try again after half hour.');
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      await AsyncStorage.removeItem('login_failed_attempts');
      await AsyncStorage.removeItem('login_lockout_expiry');
      navigation.replace('MainTabs');
    } catch (e) {
      const newAttempts = currentAttempts + 1;
      if (newAttempts >= 10) {
        const expiry = Date.now() + 30 * 60 * 1000;
        setLockoutExpiry(expiry);
        setFailedAttempts(newAttempts);
        await AsyncStorage.setItem('login_failed_attempts', newAttempts.toString());
        await AsyncStorage.setItem('login_lockout_expiry', expiry.toString());
        Alert.alert('Account Locked', 'Please try again after half hour.');
      } else {
        setFailedAttempts(newAttempts);
        await AsyncStorage.setItem('login_failed_attempts', newAttempts.toString());
        Alert.alert('Login Failed', 'incorrect credentials please try again');
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerRow}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
          <Text style={styles.headerBrand}>Insurix</Text>
        </View>

        {/* Welcome */}
        <Text style={styles.welcomeTitle}>Welcome{'\n'}Back</Text>
        <Text style={styles.subtitle}>Securely access your insurance portfolio{'\n'}with Insurix.</Text>

        {/* Email */}
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={20} color={COLORS.outline} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={COLORS.outline}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.outline} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.outline}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPwd}
          />
          <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
            <Ionicons name={showPwd ? 'eye-outline' : 'eye-off-outline'} size={20} color={COLORS.outline} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotWrap}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginBtnText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>



        {/* Sign Up */}
        <View style={styles.signupRow}>
          <Text style={styles.signupLabel}>Don't have an account?  </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 28, paddingTop: 50 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 48 },
  headerBrand: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  welcomeTitle: { fontSize: 42, fontWeight: '800', color: COLORS.primary, lineHeight: 48, marginBottom: 12 },
  subtitle: { fontSize: 14, color: COLORS.onSurfaceVariant, lineHeight: 21, marginBottom: 40 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceContainerLow, borderRadius: RADIUS.md, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: COLORS.onSurface },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  loginBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 18, alignItems: 'center', marginBottom: 24 },
  loginBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },

  signupRow: { flexDirection: 'row', justifyContent: 'center' },
  signupLabel: { fontSize: 14, color: COLORS.onSurfaceVariant },
  signupLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
