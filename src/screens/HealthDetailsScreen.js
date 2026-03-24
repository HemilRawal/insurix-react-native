import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLORS, RADIUS } from '../config/theme';
import { calculateRisk } from '../utils/riskCalculator';

const ALL_CONDITIONS = [
  { name: 'Heart Conditions', icon: 'heart' },
  { name: 'Diabetes', icon: 'water' },
  { name: 'Asthma', icon: 'cloud' },
  { name: 'Hypertension', icon: 'speedometer' },
  { name: 'Cancer History', icon: 'medkit' },
  { name: 'Kidney Disease', icon: 'water' },
  { name: 'Liver Disease', icon: 'fitness' },
  { name: 'Thyroid', icon: 'pulse' },
  { name: 'Neurological Issues', icon: 'brain' },
  { name: 'Mental Health History', icon: 'happy' },
  { name: 'Autoimmune Disorders', icon: 'shield' },
  { name: 'Digestive Issues', icon: 'restaurant' },
];

const EXERCISE_OPTIONS = [
  { label: 'NEVER', value: 'never', icon: 'bed' },
  { label: 'OCCASIONAL', value: 'occasional', icon: 'walk' },
  { label: 'OFTEN', value: 'often', icon: 'barbell' },
  { label: 'DAILY', value: 'daily', icon: 'bicycle' },
];

export default function HealthDetailsScreen({ navigation }) {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [smoking, setSmoking] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const [medication, setMedication] = useState(false);
  const [exerciseFreq, setExerciseFreq] = useState('often');
  const [dietQuality, setDietQuality] = useState(8);
  const [analyzing, setAnalyzing] = useState(false);

  const toggleCondition = (name) => {
    setSelectedConditions(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const profile = {
        height, weight,
        conditions: selectedConditions,
        smoking, alcohol, medication,
        exerciseFreq, dietQuality,
      };

      const { riskScore, riskCategory, bmi } = calculateRisk(profile);

      const uid = auth.currentUser?.uid;
      if (uid) {
        await updateDoc(doc(db, 'users', uid), {
          height: Number(height),
          weight: Number(weight),
          bmi: Number(bmi),
          conditions: selectedConditions || [],
          smoking: Boolean(smoking),
          alcohol: Boolean(alcohol),
          regularMedication: Boolean(medication),
          exerciseFreq: String(exerciseFreq),
          dietQuality: Number(dietQuality),
          riskScore: Number(riskScore),
          riskCategory: String(riskCategory),
          profileComplete: true,
        });
      }

      navigation.navigate('RiskResults', { riskScore, riskCategory, bmi });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setAnalyzing(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Health Details</Text>
        <View style={styles.avatarSmall}>
          <Ionicons name="person" size={16} color={COLORS.primary} />
        </View>
      </View>

      <Text style={styles.headline}>Vital Statistics</Text>
      <Text style={styles.subtitle}>Provide your basic physical metrics for a precise risk profile.</Text>

      {/* Height & Weight */}
      <View style={styles.metricRow}>
        <View style={[styles.metricCard, { backgroundColor: 'rgba(0, 61, 155, 0.08)' }]}>
          <Ionicons name="resize-outline" size={20} color={COLORS.primary} />
          <Text style={[styles.metricLabel, { color: COLORS.primary }]}>HEIGHT</Text>
          <Text style={styles.metricValue}>{Math.round(height)}<Text style={styles.metricUnit}> cm</Text></Text>
        </View>
        <View style={[styles.metricCard, { backgroundColor: 'rgba(0, 82, 204, 0.08)' }]}>
          <Ionicons name="scale-outline" size={20} color={COLORS.primaryContainer} />
          <Text style={[styles.metricLabel, { color: COLORS.primaryContainer }]}>WEIGHT</Text>
          <Text style={styles.metricValue}>{Math.round(weight)}<Text style={styles.metricUnit}> kg</Text></Text>
        </View>
      </View>

      <Slider style={styles.slider} minimumValue={120} maximumValue={220} value={height} onValueChange={setHeight} minimumTrackTintColor={COLORS.primary} maximumTrackTintColor={COLORS.surfaceContainerHigh} thumbTintColor={COLORS.primary} />
      <Slider style={styles.slider} minimumValue={30} maximumValue={150} value={weight} onValueChange={setWeight} minimumTrackTintColor={COLORS.primaryContainer} maximumTrackTintColor={COLORS.surfaceContainerHigh} thumbTintColor={COLORS.primaryContainer} />

      {/* Pre-existing Conditions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pre-existing Conditions</Text>
        <Ionicons name="information-circle-outline" size={18} color={COLORS.outline} />
      </View>

      <View style={styles.chipGrid}>
        {ALL_CONDITIONS.map(c => {
          const selected = selectedConditions.includes(c.name);
          return (
            <TouchableOpacity key={c.name} style={[styles.condChip, selected ? styles.condChipActive : undefined]} onPress={() => toggleCondition(c.name)}>
              <Ionicons name={c.icon} size={14} color={selected ? COLORS.white : COLORS.onSurfaceVariant} />
              <Text style={[styles.condChipText, selected ? { color: COLORS.white } : undefined]}>{c.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Lifestyle Indicators */}
      <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Lifestyle Indicators</Text>

      <View style={styles.toggleRow}>
        <Ionicons name="flame-outline" size={20} color={COLORS.onSurfaceVariant} />
        <Text style={styles.toggleLabel}>Tobacco Usage</Text>
        <Switch value={!!smoking} onValueChange={setSmoking} />
      </View>
      <View style={styles.toggleRow}>
        <Ionicons name="beer-outline" size={20} color={COLORS.onSurfaceVariant} />
        <Text style={styles.toggleLabel}>Alcohol Consumption</Text>
        <Switch value={!!alcohol} onValueChange={setAlcohol} />
      </View>
      <View style={styles.toggleRow}>
        <Ionicons name="medical-outline" size={20} color={COLORS.onSurfaceVariant} />
        <Text style={styles.toggleLabel}>Regular Medication</Text>
        <Switch value={!!medication} onValueChange={setMedication} />
      </View>

      {/* Exercise Frequency */}
      <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Exercise Frequency</Text>
      <View style={styles.exerciseRow}>
        {EXERCISE_OPTIONS.map(opt => {
          const active = exerciseFreq === opt.value;
          return (
            <TouchableOpacity key={opt.value} style={[styles.exerciseChip, active ? styles.exerciseChipActive : undefined]} onPress={() => setExerciseFreq(opt.value)}>
              <Ionicons name={opt.icon} size={22} color={active ? COLORS.white : COLORS.onSurfaceVariant} />
              <Text style={[styles.exerciseLabel, active ? { color: COLORS.white } : undefined]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Diet Quality */}
      <View style={styles.dietHeader}>
        <Ionicons name="restaurant-outline" size={20} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Diet Quality</Text>
        <Text style={styles.dietScore}>{Math.round(dietQuality)}/10</Text>
      </View>
      <Slider style={styles.slider} minimumValue={1} maximumValue={10} step={1} value={dietQuality} onValueChange={setDietQuality} minimumTrackTintColor={COLORS.primary} maximumTrackTintColor={COLORS.surfaceContainerHigh} thumbTintColor={COLORS.primary} />
      <View style={styles.dietLabels}>
        <Text style={styles.dietLabelText}>PROCESSED</Text>
        <Text style={styles.dietLabelText}>BALANCED</Text>
        <Text style={styles.dietLabelText}>ORGANIC</Text>
      </View>

      {/* Analyze Button */}
      <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze} disabled={!!analyzing}>
        <Ionicons name="shield-checkmark" size={20} color={COLORS.white} />
        <Text style={styles.analyzeBtnText}>{analyzing ? 'Analyzing...' : 'Analyze Risk'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingBottom: 100 },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  appBarTitle: { fontSize: 17, fontWeight: '700' },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryFixed, justifyContent: 'center', alignItems: 'center' },
  headline: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.onSurfaceVariant, lineHeight: 20, marginBottom: 24 },
  metricRow: { flexDirection: 'row', gap: 12 },
  metricCard: { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center' },
  metricLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginTop: 4 },
  metricValue: { fontSize: 28, fontWeight: '800', color: COLORS.onSurface, marginTop: 8 },
  metricUnit: { fontSize: 14, fontWeight: '400', color: COLORS.onSurfaceVariant },
  slider: { width: '100%', height: 40 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  condChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: COLORS.surfaceContainerLowest, borderWidth: 1, borderColor: 'rgba(195, 198, 214, 0.5)' },
  condChipActive: { backgroundColor: COLORS.primaryContainer, borderColor: COLORS.primaryContainer },
  condChipText: { fontSize: 12, fontWeight: '500', color: COLORS.onSurfaceVariant },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  toggleLabel: { flex: 1, fontSize: 14, color: COLORS.onSurface },
  exerciseRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 8 },
  exerciseChip: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: COLORS.surfaceContainerLowest, borderWidth: 1, borderColor: 'rgba(195, 198, 214, 0.3)' },
  exerciseChipActive: { backgroundColor: COLORS.primaryContainer, borderColor: COLORS.primaryContainer },
  exerciseLabel: { fontSize: 9, fontWeight: '700', color: COLORS.outline, letterSpacing: 0.5, marginTop: 6 },
  dietHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 28, marginBottom: 12 },
  dietScore: { marginLeft: 'auto', fontSize: 20, fontWeight: '800', color: COLORS.primary },
  dietLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  dietLabelText: { fontSize: 10, fontWeight: '600', color: COLORS.outline },
  analyzeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 20, gap: 10, marginTop: 32 },
  analyzeBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
