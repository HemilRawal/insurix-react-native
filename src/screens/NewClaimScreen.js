import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLORS, RADIUS } from '../config/theme';

export default function NewClaimScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    providerName: '',
    dateOfService: '',
    diagnosis: '',
    amount: ''
  });

  const handleSubmit = async () => {
    if (!form.patientName || !form.providerName || !form.diagnosis || !form.amount) {
      Alert.alert("Required Fields", "Please fill out all required fields to process the claim.");
      return;
    }

    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const claimId = 'CLM-' + Math.floor(10000 + Math.random() * 90000);
        const newClaim = {
          id: claimId,
          patientName: form.patientName,
          providerName: form.providerName,
          dateOfService: form.dateOfService || new Date().toLocaleDateString(),
          diagnosis: form.diagnosis,
          amount: form.amount,
          status: 'Approved',
          timestamp: new Date().toISOString()
        };

        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, { recentClaim: newClaim });
        
        Alert.alert(
          "Claim Approved!", 
          `Your claim #${claimId} has been auto-approved.\n\nThe account will be credited in 10 business days.`,
          [{ text: "Back to Dashboard", onPress: () => navigation.navigate("DashboardTab") }]
        );
      }
    } catch (e) {
      console.log('Error submitting claim:', e);
      Alert.alert("Error", "Could not submit claim. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>New Insurance Claim</Text>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <View style={s.noticeWrap}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <Text style={s.noticeText}>Please ensure all details match your official invoice for automated processing.</Text>
        </View>

        <Text style={s.label}>Patient Name</Text>
        <TextInput 
          style={s.input} 
          placeholder="e.g. John Doe"
          value={form.patientName}
          onChangeText={(t) => setForm({...form, patientName: t})}
        />

        <Text style={s.label}>Healthcare Provider Name</Text>
        <TextInput 
          style={s.input} 
          placeholder="e.g. City General Hospital"
          value={form.providerName}
          onChangeText={(t) => setForm({...form, providerName: t})}
        />

        <Text style={s.label}>Date of Service</Text>
        <TextInput 
          style={s.input} 
          placeholder="MM/DD/YYYY"
          value={form.dateOfService}
          onChangeText={(t) => setForm({...form, dateOfService: t})}
        />

        <Text style={s.label}>Diagnosis / Reason for Visit</Text>
        <TextInput 
          style={s.input} 
          placeholder="e.g. Dental Cleaning, Consultation"
          value={form.diagnosis}
          onChangeText={(t) => setForm({...form, diagnosis: t})}
        />

        <Text style={s.label}>Total Amount Billed (₹)</Text>
        <TextInput 
          style={s.input} 
          placeholder="e.g. 15000"
          keyboardType="numeric"
          value={form.amount}
          onChangeText={(t) => setForm({...form, amount: t})}
        />

        <TouchableOpacity 
          style={[s.submitBtn, loading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={s.submitBtnT}>Submit & Process Claim</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    backgroundColor: '#0A2E5C',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  content: { padding: 20, paddingBottom: 60 },
  noticeWrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(218,226,255,0.4)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center'
  },
  noticeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#0A2E5C',
    lineHeight: 20
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.onSurface,
    marginBottom: 8,
    marginLeft: 4
  },
  input: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(195,198,214,0.3)',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    marginBottom: 20
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2
  },
  submitBtnT: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  }
});
