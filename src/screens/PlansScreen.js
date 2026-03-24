import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLORS, RADIUS } from '../config/theme';
import { getRecommendedPlans } from '../utils/recommendationEngine';
import { SAMPLE_PLANS } from '../utils/seedFirestore';

export default function PlansScreen({ navigation }) {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => {
    try {
      const uid = auth.currentUser?.uid;
      let userProfile = { age: 30, conditions: [], riskCategory: 'Medium' };
      if (uid) {
        const uSnap = await getDoc(doc(db, 'users', uid));
        if (uSnap.exists()) userProfile = uSnap.data();
      }
      // Try Firestore first, fallback to local
      const snap = await getDocs(collection(db, 'insurances'));
      let allPlans = [];
      if (!snap.empty) {
        snap.forEach(d => allPlans.push({ id: d.id, ...d.data() }));
      } else {
        allPlans = SAMPLE_PLANS.map((p, i) => ({ id: String(i), ...p }));
      }
      const recommended = getRecommendedPlans(userProfile, allPlans);
      setPlans(recommended);
    } catch (e) {
      console.log(e);
      setPlans(SAMPLE_PLANS.map((p, i) => ({ id: String(i), ...p })));
    }
  };

  const openDetail = (plan) => { setSelectedPlan(plan); setModalVisible(true); };

  const getTierColor = (plan) => {
    if (plan.isBestMatch) return COLORS.primary;
    if (plan.tier === 'premium') return COLORS.secondaryFixedDim;
    return COLORS.tertiaryContainer;
  };

  const getTierLabel = (plan) => {
    if (plan.isBestMatch) return 'BEST MATCH';
    if (plan.isPopular) return 'MOST POPULAR';
    if (plan.tier === 'starter') return 'LOW RISK CHOICE';
    return 'FAMILY SCALE';
  };

  return (
    <View style={st.container}>
      <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
        <Text style={st.brandTitle}>Insurix</Text>
        <Text style={st.subtitle}>Tailored protection based on your digital profile.</Text>

        {plans.map((plan, idx) => (
          <View key={plan.id} style={[st.card, plan.isBestMatch && st.cardBest]}>
            <View style={[st.tag, { backgroundColor: getTierColor(plan) }]}>
              <Text style={st.tagText}>{getTierLabel(plan)}</Text>
            </View>
            <View style={st.cardHeader}>
              <View>
                <Text style={st.planTitle}>{plan.title}</Text>
                <Text style={st.planSub}>{plan.tier === 'premium' ? 'Premium Coverage' : plan.tier === 'starter' ? 'Core Essentials' : 'Multi-Member Benefits'}</Text>
              </View>
              <View style={st.priceWrap}>
                <Text style={[st.price, plan.isBestMatch && { color: COLORS.primary }]}>₹{plan.monthlyPremium.toLocaleString()}</Text>
                <Text style={st.priceLabel}>Per Month</Text>
              </View>
            </View>

            <View style={st.benefitsGrid}>
              {(plan.benefits || []).slice(0, 4).map((b, i) => (
                <View key={i} style={st.benefitChip}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.primaryContainer} />
                  <Text style={st.benefitText}>{b}</Text>
                </View>
              ))}
            </View>

            <View style={st.actions}>
              <TouchableOpacity style={st.selectBtn} onPress={() => openDetail(plan)}>
                <Text style={st.selectBtnText}>Select Plan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.compareBtn} onPress={() => navigation.navigate('ComparePlans')}>
                <Text style={st.compareBtnText}>Compare</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Plan Detail Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={st.modalOverlay}>
          <View style={st.modalContent}>
            <View style={st.modalHandle} />
            {selectedPlan && (<>
              <Text style={st.modalTitle}>{selectedPlan.title}</Text>
              <Text style={st.modalPrice}>₹{selectedPlan.monthlyPremium.toLocaleString()}/mo</Text>
              <View style={st.modalRow}><Text style={st.modalLabel}>Coverage</Text><Text style={st.modalVal}>{selectedPlan.coverageLimit}</Text></View>
              <View style={st.modalRow}><Text style={st.modalLabel}>Claim Ratio</Text><Text style={st.modalVal}>{selectedPlan.claimRatio}%</Text></View>
              <View style={st.modalRow}><Text style={st.modalLabel}>Waiting Period</Text><Text style={st.modalVal}>{selectedPlan.waitingPeriod}</Text></View>
              <Text style={st.modalBenTitle}>Benefits</Text>
              {(selectedPlan.benefits||[]).map((b,i)=>(<View key={i} style={st.modalBenRow}><Ionicons name="checkmark-circle" size={16} color={COLORS.primary}/><Text style={st.modalBenText}>{b}</Text></View>))}
              <TouchableOpacity style={st.modalClose} onPress={()=>setModalVisible(false)}><Text style={st.modalCloseText}>Close</Text></TouchableOpacity>
            </>)}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const st = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.surface},
  content:{padding:24,paddingTop:50,paddingBottom:100},
  brandTitle:{fontSize:32,fontWeight:'800',color:COLORS.primary,marginBottom:4},
  subtitle:{fontSize:14,color:COLORS.onSurfaceVariant,marginBottom:24},
  card:{backgroundColor:COLORS.surfaceContainerLowest,borderRadius:20,padding:24,marginBottom:20,elevation:2,overflow:'hidden'},
  cardBest:{borderWidth:1,borderColor:'rgba(0,61,155,0.15)',shadowColor:COLORS.primary,shadowOpacity:0.08,shadowRadius:20},
  tag:{position:'absolute',top:0,right:0,paddingHorizontal:14,paddingVertical:8,borderBottomLeftRadius:16},
  tagText:{fontSize:10,fontWeight:'700',color:'#fff',letterSpacing:1},
  cardHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginTop:8,marginBottom:16},
  planTitle:{fontSize:22,fontWeight:'800'},
  planSub:{fontSize:12,color:COLORS.onSurfaceVariant,marginTop:2},
  priceWrap:{alignItems:'flex-end'},
  price:{fontSize:26,fontWeight:'800',color:COLORS.onSurfaceVariant},
  priceLabel:{fontSize:9,fontWeight:'600',color:COLORS.outline,letterSpacing:1.5,textTransform:'uppercase'},
  benefitsGrid:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:20},
  benefitChip:{flexDirection:'row',alignItems:'center',backgroundColor:COLORS.surfaceContainerLow,paddingHorizontal:12,paddingVertical:8,borderRadius:10,gap:6},
  benefitText:{fontSize:11,fontWeight:'600'},
  actions:{flexDirection:'row',gap:12},
  selectBtn:{flex:1,backgroundColor:COLORS.primary,borderRadius:RADIUS.full,paddingVertical:16,alignItems:'center'},
  selectBtnText:{color:'#fff',fontWeight:'700',fontSize:14},
  compareBtn:{flex:1,borderWidth:1,borderColor:COLORS.outlineVariant,borderRadius:RADIUS.full,paddingVertical:16,alignItems:'center'},
  compareBtnText:{color:COLORS.primary,fontWeight:'700',fontSize:14},
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'flex-end'},
  modalContent:{backgroundColor:'#fff',borderTopLeftRadius:28,borderTopRightRadius:28,padding:28,paddingBottom:40,maxHeight:'80%'},
  modalHandle:{width:40,height:4,borderRadius:2,backgroundColor:COLORS.outlineVariant,alignSelf:'center',marginBottom:20},
  modalTitle:{fontSize:24,fontWeight:'800',marginBottom:4},
  modalPrice:{fontSize:20,fontWeight:'700',color:COLORS.primary,marginBottom:20},
  modalRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:12,borderBottomWidth:1,borderBottomColor:'rgba(195,198,214,0.2)'},
  modalLabel:{fontSize:13,color:COLORS.onSurfaceVariant,fontWeight:'600'},
  modalVal:{fontSize:13,fontWeight:'700'},
  modalBenTitle:{fontSize:16,fontWeight:'700',marginTop:20,marginBottom:12},
  modalBenRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8},
  modalBenText:{fontSize:13,color:COLORS.onSurfaceVariant},
  modalClose:{backgroundColor:COLORS.primary,borderRadius:RADIUS.full,paddingVertical:16,alignItems:'center',marginTop:24},
  modalCloseText:{color:'#fff',fontWeight:'700',fontSize:15},
});
