import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../config/theme';
import { SAMPLE_PLANS } from '../utils/seedFirestore';

const COMPARE = [SAMPLE_PLANS[1], SAMPLE_PLANS[3], SAMPLE_PLANS[4]]; // Essential, Elite, Infinity
const ROWS = [
  { label: 'Premium', key: 'monthlyPremium', fmt: v => `₹${v.toLocaleString()}/mo` },
  { label: 'Coverage', key: 'coverageLimit' },
  { label: 'Claim Ratio', key: 'claimRatio', fmt: v => `${v}%` },
  { label: 'Waiting Period', key: 'waitingPeriod' },
];

export default function ComparePlansScreen({ navigation }) {
  return (
    <ScrollView style={st.container} contentContainerStyle={st.content}>
      <View style={st.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={st.appBarTitle}>Compare Plans</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={st.headline}>Choose your shield.</Text>
      <Text style={st.subtitle}>Our top performing tiers side-by-side to help you find the perfect balance.</Text>

      {/* Column Headers */}
      <View style={st.headerRow}>
        {COMPARE.map((p, i) => (
          <View key={i} style={[st.colHeader, i === 1 && st.colHeaderFeatured]}>
            <Text style={[st.tierLabel, i === 1 && { color: COLORS.primaryFixedDim }]}>
              {i === 0 ? 'Starter' : i === 1 ? 'Most Popular' : 'Premium'}
            </Text>
            <Text style={[st.colTitle, i === 1 && { color: '#fff' }]}>{p.title.split(' ').slice(-1)[0]}</Text>
            {i === 1 && <View style={st.bestBadge}><Text style={st.bestBadgeT}>Best Value</Text></View>}
          </View>
        ))}
      </View>

      {/* Rows */}
      {ROWS.map(row => (
        <View key={row.label} style={st.dataRow}>
          {COMPARE.map((p, i) => {
            const val = row.fmt ? row.fmt(p[row.key]) : p[row.key];
            return (
              <View key={i} style={[st.cell, i === 1 && st.cellFeatured]}>
                <Text style={st.cellLabel}>{row.label}</Text>
                <Text style={[st.cellValue, i === 1 && { fontWeight: '800' }]}>{val}</Text>
              </View>
            );
          })}
        </View>
      ))}

      {/* Benefits */}
      <View style={st.dataRow}>
        {COMPARE.map((p, i) => (
          <View key={i} style={[st.cell, st.benefitCell, i === 1 && st.cellFeatured]}>
            <Text style={st.cellLabel}>Benefits</Text>
            {(p.benefits || []).slice(0, 3).map((b, j) => (
              <View key={j} style={st.benRow}>
                <Ionicons name="checkmark-circle" size={14} color={i === 1 ? COLORS.tertiaryFixedDim : COLORS.primaryContainer} />
                <Text style={[st.benText, i === 1 && { color: '#fff' }]}>{b}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* CTA Row */}
      <View style={st.dataRow}>
        {COMPARE.map((p, i) => (
          <View key={i} style={[st.cell, { paddingVertical: 16 }]}>
            <TouchableOpacity style={[st.ctaBtn, i === 1 && st.ctaBtnFeatured]}>
              <Text style={[st.ctaBtnText, i === 1 && { color: COLORS.primary }]}>{i === 1 ? 'Get Started' : 'Select'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Coverage Promise */}
      <View style={st.promise}>
        <Ionicons name="shield-checkmark" size={28} color={COLORS.tertiary} />
        <View style={{ flex: 1 }}>
          <Text style={st.promiseTitle}>Our Coverage Promise</Text>
          <Text style={st.promiseBody}>All plans include cashless hospitalization at 5,000+ network hospitals and digital claim filing via the Insurix App.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 20, paddingTop: 50, paddingBottom: 100 },
  appBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  appBarTitle: { fontSize: 17, fontWeight: '700' },
  headline: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 13, color: COLORS.onSurfaceVariant, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  headerRow: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  colHeader: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: COLORS.surfaceContainerLowest, alignItems: 'center' },
  colHeaderFeatured: { backgroundColor: COLORS.primaryContainer, borderRadius: 12, zIndex: 1 },
  tierLabel: { fontSize: 10, fontWeight: '700', color: COLORS.primary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  colTitle: { fontSize: 16, fontWeight: '800' },
  bestBadge: { backgroundColor: COLORS.tertiaryFixed, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 6 },
  bestBadgeT: { fontSize: 8, fontWeight: '700', color: COLORS.tertiary, letterSpacing: 0.5 },
  dataRow: { flexDirection: 'row', gap: 4 },
  cell: { flex: 1, padding: 12, backgroundColor: COLORS.surfaceContainerLowest, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,214,0.1)' },
  cellFeatured: { backgroundColor: COLORS.primaryContainer },
  cellLabel: { fontSize: 9, fontWeight: '600', color: COLORS.outline, letterSpacing: 0.5, marginBottom: 4 },
  cellValue: { fontSize: 14, fontWeight: '600' },
  benefitCell: { paddingVertical: 12, alignItems: 'flex-start' },
  benRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  benText: { fontSize: 10, color: COLORS.onSurfaceVariant },
  ctaBtn: { width: '100%', paddingVertical: 12, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.primary, alignItems: 'center' },
  ctaBtnFeatured: { backgroundColor: '#fff', borderColor: '#fff' },
  ctaBtnText: { fontWeight: '700', fontSize: 12, color: COLORS.primary },
  promise: { flexDirection: 'row', backgroundColor: COLORS.surfaceContainer, borderRadius: 16, padding: 20, gap: 16, marginTop: 24, alignItems: 'center' },
  promiseTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  promiseBody: { fontSize: 12, color: COLORS.onSurfaceVariant, lineHeight: 18 },
});
