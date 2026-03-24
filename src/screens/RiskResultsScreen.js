import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, RADIUS } from '../config/theme';

export default function RiskResultsScreen({ navigation, route }) {
  const { riskScore = 42, riskCategory = 'Medium', bmi = 24.5 } = route.params || {};

  const radius = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75; // 270 degree arc
  const progress = (riskScore / 100) * arcLength;

  let badgeColor = COLORS.secondaryContainer;
  if (riskCategory === 'Low') badgeColor = COLORS.tertiaryFixed;
  else if (riskCategory === 'High') badgeColor = COLORS.errorContainer;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Analysis Results</Text>
        <View style={styles.avatarSmall}>
          <Ionicons name="person" size={16} color={COLORS.white} />
        </View>
      </View>

      {/* SVG Gauge */}
      <View style={styles.gaugeWrap}>
        <Svg width={220} height={220} viewBox="0 0 220 220">
          {/* Background arc */}
          <Circle cx="110" cy="110" r={radius} stroke={COLORS.surfaceContainerHigh} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${arcLength} ${circumference}`} strokeDashoffset={0} strokeLinecap="round"
            rotation={135} origin="110, 110" />
          {/* Progress arc */}
          <Circle cx="110" cy="110" r={radius} stroke={COLORS.primary} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${progress} ${circumference}`} strokeDashoffset={0} strokeLinecap="round"
            rotation={135} origin="110, 110" />
        </Svg>
        <View style={styles.gaugeCenter}>
          <Text style={styles.scoreText}>{riskScore}</Text>
          <Text style={styles.scoreLabel}>out of 100</Text>
        </View>
      </View>

      {/* Risk Badge */}
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Ionicons name="shield-checkmark" size={16} color={COLORS.onSurface} />
        <Text style={styles.badgeText}>{riskCategory} Risk</Text>
      </View>

      <Text style={styles.description}>
        Based on your biometric data and history, your health profile falls within the {riskCategory.toLowerCase()} risk spectrum.
      </Text>

      {/* Recommendation Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommendation Summary</Text>
        <Text style={styles.cardBody}>
          Your current "{riskCategory} Risk" status is primarily driven by your cardiovascular metrics. We recommend a plan that prioritizes{' '}
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>preventative screenings</Text> and provides{' '}
          <Text style={{ color: COLORS.tertiary, fontWeight: '600' }}>wellness incentives</Text> to maintain your profile's stability.
        </Text>
      </View>

      {/* Update Habits Card */}
      <View style={styles.habitCard}>
        <View style={styles.habitHeader}>
          <Ionicons name="leaf" size={22} color={COLORS.primary} />
          <Text style={styles.habitTitle}>Update Your Habits</Text>
        </View>
        <Text style={styles.habitBody}>Have you recently improved your diet or reduced smoking and alcohol consumption?</Text>
        <Text style={styles.habitNote}>Updating your habits can help recalculate and potentially lower your risk score.</Text>
        <View style={styles.habitActions}>
          <TouchableOpacity style={styles.habitBtnPrimary} onPress={() => navigation.navigate('HealthDetails')}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
            <Text style={styles.habitBtnPrimaryText}>Yes, I've improved</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.habitBtnSecondary}>
            <Text style={styles.habitBtnSecondaryText}>No changes yet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Health Factors */}
      <View style={styles.factorsRow}>
        <View style={styles.factorCard}>
          <View style={styles.factorHeader}>
            <Ionicons name="heart" size={18} color={COLORS.primary} />
            <Text style={styles.factorTitle}>Vital Stability</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '65%', backgroundColor: COLORS.primary }]} />
          </View>
          <Text style={styles.factorNote}>Strong cardiovascular foundation</Text>
        </View>
        <View style={styles.factorCard}>
          <View style={styles.factorHeader}>
            <Ionicons name="brain" size={18} color={COLORS.tertiary} />
            <Text style={styles.factorTitle}>Stress Quotient</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '30%', backgroundColor: COLORS.tertiary }]} />
          </View>
          <Text style={styles.factorNote}>Minimal stressors detected</Text>
        </View>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('MainTabs', { screen: 'PlansTab' })}>
        <Text style={styles.ctaBtnText}>View Recommended Plans</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Calculated in real-time using Insurix AI v4.2. Results are for information purposes and do not constitute a medical diagnosis.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 24, paddingBottom: 100, alignItems: 'center' },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 24 },
  appBarTitle: { fontSize: 17, fontWeight: '700' },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryContainer, justifyContent: 'center', alignItems: 'center' },
  gaugeWrap: { position: 'relative', width: 220, height: 220, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  gaugeCenter: { position: 'absolute', alignItems: 'center' },
  scoreText: { fontSize: 56, fontWeight: '800', color: COLORS.primary },
  scoreLabel: { fontSize: 12, fontWeight: '600', color: COLORS.outline, letterSpacing: 2, textTransform: 'uppercase' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 10, borderRadius: RADIUS.full, gap: 8, marginBottom: 16 },
  badgeText: { fontWeight: '700', fontSize: 14, color: COLORS.onSurface },
  description: { fontSize: 14, color: COLORS.onSurfaceVariant, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  card: { width: '100%', backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(195, 198, 214, 0.15)', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: 12 },
  cardBody: { fontSize: 14, color: COLORS.onSurfaceVariant, lineHeight: 22 },
  habitCard: { width: '100%', backgroundColor: COLORS.white, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(0, 61, 155, 0.1)', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2 },
  habitHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  habitTitle: { fontSize: 16, fontWeight: '700' },
  habitBody: { fontSize: 14, color: COLORS.onSurfaceVariant, lineHeight: 21, marginBottom: 4 },
  habitNote: { fontSize: 11, color: COLORS.outline, fontStyle: 'italic', marginBottom: 20 },
  habitActions: { flexDirection: 'row', gap: 12 },
  habitBtnPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 14, gap: 6 },
  habitBtnPrimaryText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  habitBtnSecondary: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surfaceContainerLow, borderRadius: RADIUS.full, paddingVertical: 14 },
  habitBtnSecondaryText: { color: COLORS.onSurfaceVariant, fontWeight: '600', fontSize: 13 },
  factorsRow: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 32 },
  factorCard: { flex: 1, backgroundColor: COLORS.surfaceContainerLow, borderRadius: 16, padding: 16 },
  factorHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  factorTitle: { fontSize: 13, fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: COLORS.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 6, borderRadius: 3 },
  factorNote: { fontSize: 10, color: COLORS.outline },
  ctaBtn: { width: '100%', backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 20, alignItems: 'center', marginBottom: 16, shadowColor: COLORS.primary, shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  ctaBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  disclaimer: { fontSize: 10, color: COLORS.outline, textAlign: 'center' },
});
