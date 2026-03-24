import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLORS, RADIUS } from '../config/theme';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (uid) { const s = await getDoc(doc(db, 'users', uid)); if (s.exists()) setUser(s.data()); }
    } catch(e) { console.log(e); }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await signOut(auth);
        navigation.replace('Login');
      }},
    ]);
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={st.infoRow}>
      <View style={st.infoIcon}><Ionicons name={icon} size={18} color={COLORS.primary} /></View>
      <View style={{ flex: 1 }}><Text style={st.infoLabel}>{label}</Text><Text style={st.infoValue}>{value || '—'}</Text></View>
    </View>
  );

  const bmi = user?.bmi?.toFixed(1) || '—';
  const conditions = (user?.conditions || []).join(', ') || 'None';

  return (
    <ScrollView style={st.container} contentContainerStyle={st.content}>
      {/* Avatar */}
      <View style={st.avatarWrap}>
        <View style={st.avatar}><Ionicons name="person" size={40} color={COLORS.primaryFixedDim} /></View>
        <Text style={st.userName}>{user?.name || 'User'}</Text>
        <Text style={st.userEmail}>{user?.email || auth.currentUser?.email}</Text>
        {user?.riskCategory && (
          <View style={[st.riskBadge, user.riskCategory==='Low'&&{backgroundColor:COLORS.tertiaryFixed}, user.riskCategory==='High'&&{backgroundColor:COLORS.errorContainer}]}>
            <Text style={st.riskBadgeText}>{user.riskCategory} Risk · Score {user.riskScore}</Text>
          </View>
        )}
      </View>

      {/* Personal Info */}
      <Text style={st.section}>Personal Info</Text>
      <View style={st.card}>
        <InfoRow icon="person-outline" label="Full Name" value={user?.name} />
        <InfoRow icon="calendar-outline" label="Age" value={user?.age?.toString()} />
        <InfoRow icon="transgender-outline" label="Gender" value={user?.gender} />
      </View>

      {/* Health Info */}
      <Text style={st.section}>Health Profile</Text>
      <View style={st.card}>
        <InfoRow icon="resize-outline" label="Height" value={user?.height ? `${user.height} cm` : '—'} />
        <InfoRow icon="scale-outline" label="Weight" value={user?.weight ? `${user.weight} kg` : '—'} />
        <InfoRow icon="analytics-outline" label="BMI" value={bmi} />
        <InfoRow icon="medkit-outline" label="Conditions" value={conditions} />
      </View>

      {/* Lifestyle */}
      <Text style={st.section}>Lifestyle</Text>
      <View style={st.card}>
        <InfoRow icon="flame-outline" label="Tobacco" value={user?.smoking ? 'Yes' : 'No'} />
        <InfoRow icon="beer-outline" label="Alcohol" value={user?.alcohol ? 'Yes' : 'No'} />
        <InfoRow icon="barbell-outline" label="Exercise" value={user?.exerciseFreq || '—'} />
        <InfoRow icon="restaurant-outline" label="Diet Quality" value={user?.dietQuality ? `${user.dietQuality}/10` : '—'} />
      </View>

      {/* Actions */}
      <TouchableOpacity style={st.editBtn} onPress={() => navigation.navigate('HealthDetails')}>
        <Ionicons name="create-outline" size={18} color={COLORS.primary} />
        <Text style={st.editBtnText}>Update Health Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={st.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
        <Text style={st.logoutBtnText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 24, paddingTop: 50, paddingBottom: 100 },
  avatarWrap: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryContainer, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  userName: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  userEmail: { fontSize: 13, color: COLORS.onSurfaceVariant },
  riskBadge: { backgroundColor: COLORS.secondaryContainer, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12, marginTop: 12 },
  riskBadgeText: { fontSize: 11, fontWeight: '700' },
  section: { fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 16, padding: 8, marginBottom: 20, elevation: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(195,198,214,0.1)' },
  infoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primaryFixed, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoLabel: { fontSize: 11, color: COLORS.outline, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.full, paddingVertical: 16, gap: 8, marginBottom: 16 },
  editBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.error, borderRadius: RADIUS.full, paddingVertical: 16, gap: 8 },
  logoutBtnText: { color: COLORS.error, fontWeight: '700', fontSize: 14 },
});
