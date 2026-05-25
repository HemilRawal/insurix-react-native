import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLORS, RADIUS } from '../config/theme';

export default function DependentsScreen({ navigation }) {
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newAge, setNewAge] = useState('');

  useEffect(() => {
    loadDependents();
  }, []);

  const loadDependents = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        const docRef = doc(db, 'users', uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setDependents(data.dependents || []);
        }
      }
    } catch (e) {
      console.log('Error loading dependents:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDependent = async () => {
    if (!newName || !newRelation || !newAge) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const newDependent = {
        id: Math.random().toString(36).substring(7),
        name: newName,
        relation: newRelation,
        age: newAge
      };

      const updatedDependents = [...dependents, newDependent];
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, { dependents: updatedDependents });
      
      setDependents(updatedDependents);
      setIsAdding(false);
      setNewName('');
      setNewRelation('');
      setNewAge('');
    } catch (e) {
      console.log("Error adding dependent:", e);
      Alert.alert("Error", "Could not add dependent.");
    }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Dependents</Text>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : dependents.length === 0 ? (
          <View style={s.emptyState}>
            <Ionicons name="people" size={64} color={COLORS.outline} />
            <Text style={s.emptyT}>No dependents found</Text>
          </View>
        ) : (
          dependents.map(dep => (
            <View key={dep.id} style={s.card}>
              <View style={s.iconWrap}>
                <Ionicons name="person" size={24} color={COLORS.primary} />
              </View>
              <View style={s.infoWrap}>
                <Text style={s.depName}>{dep.name}</Text>
                <Text style={s.depRel}>{dep.relation} • {dep.age} yrs</Text>
              </View>
            </View>
          ))
        )}

        {isAdding ? (
          <View style={s.addForm}>
            <Text style={s.formTitle}>Add New Dependent</Text>
            <TextInput style={s.input} placeholder="Full Name" value={newName} onChangeText={setNewName} />
            <TextInput style={s.input} placeholder="Relationship (e.g., Spouse, Child)" value={newRelation} onChangeText={setNewRelation} />
            <TextInput style={s.input} placeholder="Age" keyboardType="numeric" value={newAge} onChangeText={setNewAge} />
            
            <View style={s.btnRow}>
              <TouchableOpacity style={[s.btn, { backgroundColor: COLORS.surfaceContainerLow }]} onPress={() => setIsAdding(false)}>
                <Text style={[s.btnText, { color: COLORS.onSurfaceVariant }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btn} onPress={handleAddDependent}>
                <Text style={s.btnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={s.addBtn} onPress={() => setIsAdding(true)}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={s.addBtnT}>Add Dependent</Text>
          </TouchableOpacity>
        )}
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
  content: { padding: 20 },
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(218,226,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  infoWrap: { flex: 1 },
  depName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  depRel: { fontSize: 13, color: COLORS.onSurfaceVariant },
  emptyState: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  emptyT: { fontSize: 16, color: COLORS.outline, marginTop: 12, fontWeight: '600' },
  addBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: RADIUS.full,
    marginTop: 20
  },
  addBtnT: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  addForm: {
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    elevation: 2
  },
  formTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  input: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 14
  },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center'
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});
