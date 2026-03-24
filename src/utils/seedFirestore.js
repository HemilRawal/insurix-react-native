// Firestore Seeding Utility
// Run this once to populate your Firestore with sample insurance plans
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const SAMPLE_PLANS = [
  {
    title: 'Health Guard Plus',
    monthlyPremium: 10000,
    minAge: 18,
    maxAge: 65,
    coveredDiseases: ['Diabetes', 'Heart Conditions', 'Hypertension', 'Asthma', 'Thyroid', 'Cancer History'],
    benefits: ['Unlimited ER', 'Dental & Vision', 'Zero-Copay Rx', 'Global Care', 'Cashless Hospitalization', 'Mental Health Support'],
    riskSupported: ['Low', 'Medium', 'High'],
    coverageLimit: '₹50 Lakh',
    claimRatio: 98.5,
    waitingPeriod: '30 Days',
    tier: 'premium',
  },
  {
    title: 'plan',
    monthlyPremium: 3000,
    minAge: 18,
    maxAge: 70,
    coveredDiseases: ['Diabetes', 'Heart Conditions', 'Hypertension', 'Asthma', 'Thyroid', 'Cancer History'],
    benefits: ['Unlimited ER', 'Dental & Vision', 'Zero-Copay Rx', 'Global Care', 'Cashless Hospitalization', 'Mental Health Support'],
    riskSupported: ['Low', 'High'],
    coverageLimit: '₹50 Lakh',
    claimRatio: 98.5,
    waitingPeriod: '30 Days',
    tier: 'premium',
  },
  {
    title: 'planx',
    monthlyPremium: 60000,
    minAge: 18,
    maxAge: 70,
    coveredDiseases: ['Diabetes', 'Heart Conditions', 'Hypertension', 'Asthma', 'Thyroid', 'Cancer History'],
    benefits: ['Unlimited ER', 'Dental & Vision', 'Zero-Copay Rx', 'Global Care', 'Cashless Hospitalization', 'Mental Health Support'],
    riskSupported: ['High'],
    coverageLimit: '₹50 Lakh',
    claimRatio: 98.5,
    waitingPeriod: '30 Days',
    tier: 'premium',
  },
  {
    title: 'Essential Care',
    monthlyPremium: 500,
    minAge: 18,
    maxAge: 55,
    coveredDiseases: ['Diabetes', 'Hypertension', 'Asthma'],
    benefits: ['Primary Care', 'Lab Services', 'Telehealth 24/7', 'Generic Prescriptions'],
    riskSupported: ['Low', 'Medium'],
    coverageLimit: '₹2.5 Lakh',
    claimRatio: 94.2,
    waitingPeriod: '2 Years',
    tier: 'starter',
  },
  {
    title: 'Secure Family',
    monthlyPremium: 3500,
    minAge: 21,
    maxAge: 60,
    coveredDiseases: ['Diabetes', 'Heart Conditions', 'Hypertension', 'Asthma', 'Thyroid'],
    benefits: ['4+ Dependents', 'Pediatric Care', 'Maternity Cover', 'Vaccination Cover', 'Cashless Hospitalization'],
    riskSupported: ['Low', 'Medium', 'High'],
    coverageLimit: '₹15 Lakh',
    claimRatio: 96.8,
    waitingPeriod: '10 days',
    tier: 'standard',
  },
  {
    title: 'Elite Care',
    monthlyPremium: 6000,
    minAge: 18,
    maxAge: 70,
    coveredDiseases: ['Diabetes', 'Heart Conditions', 'Hypertension', 'Asthma', 'Thyroid', 'Cancer History', 'Kidney Disease', 'Liver Disease'],
    benefits: ['Worldwide Emergency', 'Critical Illness Add-on', 'Premium Maternity', 'Personal Health Coach', 'Cashless at 5000+ Hospitals'],
    riskSupported: ['Low', 'Medium', 'High'],
    coverageLimit: '₹1 Crore',
    claimRatio: 99.1,
    waitingPeriod: '7 Days',
    tier: 'premium',
    isPopular: true,
  },
  {
    title: 'Infinity Premium',
    monthlyPremium: 12000,
    minAge: 18,
    maxAge: 80,
    coveredDiseases: ['Diabetes', 'Heart Conditions', 'Hypertension', 'Asthma', 'Thyroid', 'Cancer History', 'Kidney Disease', 'Liver Disease', 'Neurological Issues', 'Mental Health History', 'Autoimmune Disorders', 'Digestive Issues'],
    benefits: ['Personal Health Coach', 'Genetic Health Audit', 'Global Air Ambulance', 'Unlimited Coverage', 'VIP Hospital Suites', 'Annual Full-Body Checkup'],
    riskSupported: ['Low', 'Medium', 'High'],
    coverageLimit: 'Unlimited',
    claimRatio: 98.5,
    waitingPeriod: '1 Year',
    tier: 'premium',
  },
];

export async function seedInsurancePlans() {
  try {
    // Check if already seeded
    const snapshot = await getDocs(collection(db, 'insurances'));
    if (!snapshot.empty) {
      console.log('Insurance plans already seeded.');
      return;
    }

    for (const plan of SAMPLE_PLANS) {
      await addDoc(collection(db, 'insurances'), plan);
    }
    console.log('✅ Seeded 5 insurance plans successfully!');
  } catch (error) {
    console.error('Seed error:', error);
  }
}

export { SAMPLE_PLANS };
