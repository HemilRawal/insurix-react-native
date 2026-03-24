import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { COLORS, RADIUS } from '../config/theme';

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (uid) { const s = await getDoc(doc(db, 'users', uid)); if (s.exists()) setUser(s.data()); }
    } catch (e) { console.log(e); }
  };

  const riskScore = user?.riskScore || 42;
  const riskCat = user?.riskCategory || 'Medium';
  const dR = 50, dS = 14, dC = 2 * Math.PI * dR, dP = 0.70 * dC;

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <View style={s.hTop}><Text style={s.brand}>Insurix</Text>
          <TouchableOpacity style={s.notif}><Ionicons name="notifications-outline" size={22} color="#fff" /></TouchableOpacity></View>
        <View style={s.badge}><Text style={s.badgeT}>ACTIVE PLAN</Text></View>
        <Text style={s.planName}>Premium{'\n'}Health Shield</Text>
        <Text style={s.policyId}>Policy ID: IX-99203-BL</Text>
        <View style={s.hDetails}>
          <View><Text style={s.dLabel}>RENEWAL DATE</Text><Text style={s.dVal}>Oct 24, 2026</Text></View>
          <View><Text style={s.dLabel}>ANNUAL DEDUCTIBLE</Text>
            <View style={{flexDirection:'row',alignItems:'baseline'}}><Text style={s.dVal}>₹90,000</Text><Text style={s.dSub}> / ₹1,80,000</Text></View></View>
        </View>
      </View>
      <View style={s.body}>
        <View style={s.card}><Text style={s.cardT}>Benefit Usage</Text>
          <View style={s.donutW}>
            <Svg width={128} height={128}><Circle cx="64" cy="64" r={dR} stroke={COLORS.surfaceContainerHigh} strokeWidth={dS} fill="none" />
              <Circle cx="64" cy="64" r={dR} stroke={COLORS.primary} strokeWidth={dS} fill="none" strokeDasharray={`${dP} ${dC}`} strokeLinecap="round" rotation={-90} origin="64,64" /></Svg>
            <View style={s.donutC}><Text style={s.donutP}>70%</Text><Text style={s.donutL}>UTILIZED</Text></View>
          </View><Text style={s.cardSub}>You have ₹63,000 left in your wellness allowance</Text></View>

        <View style={s.card}><Text style={s.cardT}>Risk Score</Text>
          <View style={s.riskCircle}><Text style={s.riskNum}>{riskScore}</Text></View>
          <View style={[s.riskBadge, riskCat==='Low'&&{backgroundColor:COLORS.tertiaryFixed}, riskCat==='High'&&{backgroundColor:COLORS.errorContainer}]}>
            <Text style={s.riskBT}>{riskCat} Risk</Text></View>
          <Text style={s.cardSub}>Your profile indicates {riskCat.toLowerCase()} risk</Text></View>

        <View style={s.card}><Text style={s.cardT}>Renewal Window</Text>
          <View style={s.cdRow}>
            {[['42','DAYS'],['18','HRS'],['05','MIN']].map(([v,l],i)=>(
              <React.Fragment key={l}>{i>0&&<Text style={s.cdColon}>:</Text>}
                <View style={s.cdUnit}><Text style={s.cdVal}>{v}</Text><Text style={s.cdLbl}>{l}</Text></View></React.Fragment>))}
          </View>
          <TouchableOpacity style={s.outBtn}><Text style={s.outBtnT}>Lock Current Rate</Text></TouchableOpacity></View>

        <View style={s.card}>
          <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
            <Text style={s.cardT}>Recent Claim</Text><TouchableOpacity><Text style={s.link}>View →</Text></TouchableOpacity></View>
          <View style={s.claimRow}>
            <View style={s.claimIc}><Ionicons name="medkit" size={20} color={COLORS.primary}/></View>
            <View style={{flex:1}}><Text style={{fontWeight:'600',fontSize:14}}>Dental Cleaning</Text><Text style={{fontSize:11,color:COLORS.outline}}>ID: #CLM-81821</Text></View>
            <View style={{alignItems:'flex-end'}}><View style={s.appBadge}><Text style={s.appBadgeT}>Approved</Text></View><Text style={{fontWeight:'700',fontSize:14,marginTop:4}}>₹18,000</Text></View>
          </View>
        </View>

        <Text style={{fontSize:18,fontWeight:'700',marginBottom:12}}>Manage Account</Text>
        <View style={s.tiles}>
          {[{i:'add-circle-outline',l:'New Claim'},{i:'headset',l:'Live Support'},{i:'document-text-outline',l:'Documents'},{i:'people-outline',l:'Dependents'}].map(t=>(
            <TouchableOpacity key={t.l} style={s.tile}><Ionicons name={t.i} size={28} color={COLORS.primary}/><Text style={s.tileT}>{t.l}</Text></TouchableOpacity>))}
        </View>

        <View style={s.wellness}><Text style={s.wTag}>WELLNESS BONUS</Text><Text style={s.wTitle}>Daily Activity Goal</Text>
          <Text style={s.wBody}>Maintain a 7-day streak to lower premium by 5%.</Text>
          <View style={s.streak}><Ionicons name="flame" size={16} color="orange"/><Text style={s.streakT}>4 days streak</Text></View></View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.surface},
  header:{backgroundColor:'#0A2E5C',borderBottomLeftRadius:32,borderBottomRightRadius:32,paddingTop:50,paddingHorizontal:24,paddingBottom:32},
  hTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:28},
  brand:{fontSize:22,fontWeight:'800',color:'#fff'},
  notif:{width:40,height:40,borderRadius:20,backgroundColor:'rgba(255,255,255,0.15)',justifyContent:'center',alignItems:'center'},
  badge:{backgroundColor:'rgba(147,242,242,0.2)',paddingHorizontal:12,paddingVertical:6,borderRadius:10,alignSelf:'flex-start',marginBottom:12},
  badgeT:{fontSize:10,fontWeight:'700',color:COLORS.tertiaryFixedDim,letterSpacing:1.5},
  planName:{fontSize:30,fontWeight:'800',color:'#fff',lineHeight:36,marginBottom:8},
  policyId:{fontSize:12,color:'rgba(255,255,255,0.6)',marginBottom:16},
  hDetails:{flexDirection:'row',gap:40},
  dLabel:{fontSize:9,fontWeight:'600',color:'rgba(255,255,255,0.5)',letterSpacing:1},
  dVal:{fontSize:14,fontWeight:'700',color:'#fff',marginTop:4},
  dSub:{fontSize:10,color:'rgba(255,255,255,0.4)'},
  body:{padding:20},
  card:{backgroundColor:COLORS.surfaceContainerLowest,borderRadius:20,padding:24,marginBottom:16,elevation:2,alignItems:'center'},
  cardT:{fontSize:16,fontWeight:'700',marginBottom:16},
  cardSub:{fontSize:12,color:COLORS.onSurfaceVariant,textAlign:'center',marginTop:12},
  donutW:{position:'relative',width:128,height:128,justifyContent:'center',alignItems:'center'},
  donutC:{position:'absolute',alignItems:'center'},
  donutP:{fontSize:28,fontWeight:'800',color:COLORS.primary},
  donutL:{fontSize:9,fontWeight:'600',color:COLORS.outline,letterSpacing:1},
  riskCircle:{width:80,height:80,borderRadius:40,borderWidth:6,borderColor:COLORS.primary,justifyContent:'center',alignItems:'center'},
  riskNum:{fontSize:28,fontWeight:'800',color:COLORS.primary},
  riskBadge:{backgroundColor:COLORS.secondaryContainer,paddingHorizontal:16,paddingVertical:6,borderRadius:12,marginTop:12},
  riskBT:{fontSize:11,fontWeight:'700'},
  cdRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:16},
  cdUnit:{backgroundColor:COLORS.surfaceContainerLow,borderRadius:12,paddingHorizontal:16,paddingVertical:12,alignItems:'center'},
  cdVal:{fontSize:24,fontWeight:'800'},cdLbl:{fontSize:9,fontWeight:'600',color:COLORS.outline,letterSpacing:1},
  cdColon:{fontSize:24,fontWeight:'800',color:COLORS.outline},
  outBtn:{width:'100%',borderWidth:1,borderColor:COLORS.primary,borderRadius:RADIUS.full,paddingVertical:14,alignItems:'center'},
  outBtnT:{color:COLORS.primary,fontWeight:'700',fontSize:14},
  link:{fontSize:12,color:COLORS.primary,fontWeight:'600'},
  claimRow:{flexDirection:'row',alignItems:'center',backgroundColor:COLORS.surfaceContainerLow,borderRadius:12,padding:16,width:'100%',marginTop:8},
  claimIc:{width:40,height:40,borderRadius:10,backgroundColor:'rgba(218,226,255,0.2)',justifyContent:'center',alignItems:'center',marginRight:12},
  appBadge:{backgroundColor:'rgba(147,242,242,0.2)',paddingHorizontal:8,paddingVertical:3,borderRadius:6},
  appBadgeT:{fontSize:10,fontWeight:'600',color:COLORS.tertiary},
  tiles:{flexDirection:'row',flexWrap:'wrap',gap:12,marginBottom:16},
  tile:{width:'47%',backgroundColor:COLORS.surfaceContainerLowest,borderRadius:16,padding:20,alignItems:'center',borderWidth:1,borderColor:'rgba(195,198,214,0.2)'},
  tileT:{fontSize:12,fontWeight:'600',marginTop:8},
  wellness:{borderRadius:20,padding:20,marginBottom:80,backgroundColor:'rgba(147,242,242,0.1)',borderWidth:1,borderColor:'rgba(118,214,213,0.2)'},
  wTag:{fontSize:10,fontWeight:'700',color:COLORS.tertiary,letterSpacing:2,marginBottom:8},
  wTitle:{fontSize:18,fontWeight:'700',marginBottom:4},
  wBody:{fontSize:13,color:COLORS.onSurfaceVariant,lineHeight:20,marginBottom:16},
  streak:{flexDirection:'row',alignItems:'center',backgroundColor:COLORS.tertiary,paddingHorizontal:16,paddingVertical:10,borderRadius:12,alignSelf:'flex-start',gap:6},
  streakT:{fontSize:12,fontWeight:'600',color:'#fff'},
});
