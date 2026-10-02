/**
 * Generates synthetic demonstration data for testing the Growth Command Center.
 * Every synthetic record is strictly flagged with is_synthetic = true.
 * Run with: node scripts/seed-synthetic.js
 */

export interface SyntheticRegistration {
  id: string;
  email: string;
  full_name: string;
  branch: string;
  college_name: string;
  referral_code: string;
  is_synthetic: true;
  status: 'verified';
  seat_number: number;
}

export const SYNTHETIC_STUDENTS: SyntheticRegistration[] = [
  {
    id: 'syn_reg_1',
    email: 'synthetic.student1@demo.edu',
    full_name: 'Aditya Varma',
    branch: 'CSE',
    college_name: 'JNTU Hyderabad',
    referral_code: 'SYN_ADV1',
    is_synthetic: true,
    status: 'verified',
    seat_number: 901,
  },
  {
    id: 'syn_reg_2',
    email: 'synthetic.student2@demo.edu',
    full_name: 'Pooja Hegde',
    branch: 'ECE',
    college_name: 'CBIT Hyderabad',
    referral_code: 'SYN_POO2',
    is_synthetic: true,
    status: 'verified',
    seat_number: 902,
  },
  {
    id: 'syn_reg_3',
    email: 'synthetic.student3@demo.edu',
    full_name: 'Suresh Raina',
    branch: 'MECH',
    college_name: 'COEP Pune',
    referral_code: 'SYN_SUR3',
    is_synthetic: true,
    status: 'verified',
    seat_number: 903,
  },
];

console.log(`Generated ${SYNTHETIC_STUDENTS.length} synthetic records (all is_synthetic = true).`);
