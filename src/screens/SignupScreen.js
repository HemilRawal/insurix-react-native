import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLORS, RADIUS } from '../config/theme';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    if (password !== confirmPwd) return Alert.alert('Error', 'Passwords do not match');
    if (password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters');

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Create user document in Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        email: email.trim(),
        createdAt: new Date().toISOString(),
        profileComplete: false,
      });
      navigation.replace('ProfileSetup');
    } catch (e) {
      Alert.alert('Signup Failed', e.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
          <Text style={styles.headerBrand}>Insurix</Text>
        </View>

        <Text style={styles.title}>Create{'\n'}Account</Text>
        <Text style={styles.subtitle}>Join thousands of users who have streamlined{'\n'}their health coverage.</Text>

        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={20} color={COLORS.outline} style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={COLORS.outline} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.outline} style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor={COLORS.outline} value={password} onChangeText={setPassword} secureTextEntry />
        </View>

        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.outline} style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor={COLORS.outline} value={confirmPwd} onChangeText={setConfirmPwd} secureTextEntry />
        </View>

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
          <Text style={styles.signupBtnText}>{loading ? 'Creating...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginLabel}>Already have an account?  </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
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
  title: { fontSize: 42, fontWeight: '800', color: COLORS.primary, lineHeight: 48, marginBottom: 12 },
  subtitle: { fontSize: 14, color: COLORS.onSurfaceVariant, lineHeight: 21, marginBottom: 40 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceContainerLow, borderRadius: RADIUS.md, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: COLORS.onSurface },
  signupBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 18, alignItems: 'center', marginTop: 8, marginBottom: 32 },
  signupBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginLabel: { fontSize: 14, color: COLORS.onSurfaceVariant },
  loginLink: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
