import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLORS, RADIUS } from '../config/theme';

const GENDERS = ['Male', 'Female', 'Other'];

export default function ProfileSetupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Please enter your name');
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        await updateDoc(doc(db, 'users', uid), {
          name: name.trim(),
          age: parseInt(age) || 25,
          gender,
        });
      }
      navigation.navigate('HealthDetails');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Profile Setup</Text>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color={COLORS.outline} />
        </View>
      </View>

      <Text style={styles.headline}>Welcome to Insurix.</Text>
      <Text style={styles.subtitle}>Let's build your health profile to find the perfect plan for you.</Text>

      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.label}>FULL NAME</Text>
        <View style={styles.inputWrap}>
          <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor={COLORS.outline} value={name} onChangeText={setName} />
          <Ionicons name="person-outline" size={20} color={COLORS.outline} />
        </View>

        <Text style={styles.label}>AGE</Text>
        <View style={styles.inputWrap}>
          <TextInput style={styles.input} placeholder="25" placeholderTextColor={COLORS.outline} value={age} onChangeText={setAge} keyboardType="numeric" />
          <Ionicons name="calendar-outline" size={20} color={COLORS.outline} />
        </View>

        <Text style={styles.label}>GENDER</Text>
        <View style={styles.chipRow}>
          {GENDERS.map(g => (
            <TouchableOpacity key={g} style={[styles.chip, gender === g && styles.chipActive]} onPress={() => setGender(g)}>
              <Ionicons name={g === 'Male' ? 'male' : g === 'Female' ? 'female' : 'transgender'} size={14} color={gender === g ? COLORS.white : COLORS.onSurfaceVariant} />
              <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Security Notice */}
      <View style={styles.securityCard}>
        <View style={styles.securityIcon}>
          <Ionicons name="shield-checkmark" size={22} color={COLORS.tertiary} />
        </View>
        <View style={styles.securityContent}>
          <Text style={styles.securityTitle}>Secure & Private</Text>
          <Text style={styles.securityText}>Your data is encrypted with bank-level security protocols. We never share your health info without permission.</Text>
        </View>
      </View>

      {/* Bottom */}
      <View style={styles.bottomRow}>
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} disabled={loading}>
          <Text style={styles.nextBtnText}>{loading ? 'Saving...' : 'Next'}</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 24, paddingBottom: 40 },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  appBarTitle: { fontSize: 17, fontWeight: '700', color: COLORS.onSurface },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  headline: { fontSize: 28, fontWeight: '800', color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.onSurfaceVariant, lineHeight: 21, marginBottom: 32 },
  card: { backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 20, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2 },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.primary, letterSpacing: 1.5, marginBottom: 8, marginTop: 16 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceContainerLow, borderRadius: RADIUS.md, paddingHorizontal: 16, paddingVertical: 14 },
  input: { flex: 1, fontSize: 15, color: COLORS.onSurface },
  chipRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.surfaceContainerLow },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.onSurfaceVariant },
  chipTextActive: { color: COLORS.white },
  securityCard: { flexDirection: 'row', backgroundColor: 'rgba(147, 242, 242, 0.1)', borderRadius: 16, padding: 20, gap: 16 },
  securityIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(0, 76, 76, 0.1)', justifyContent: 'center', alignItems: 'center' },
  securityContent: { flex: 1 },
  securityTitle: { fontWeight: '700', fontSize: 14, color: COLORS.tertiary, marginBottom: 4 },
  securityText: { fontSize: 11, color: COLORS.onSurfaceVariant, lineHeight: 16 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 32 },
  dotsRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.outlineVariant },
  dotActive: { width: 24, backgroundColor: COLORS.primary },
  nextBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 28, paddingVertical: 16, gap: 8 },
  nextBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
