import { BloodCamp, BloodGroup, BloodRequest, DonorProfile, AppNotification } from '../types/blood';

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const COMPATIBILITY_MATRIX: Record<
  BloodGroup,
  { canDonateTo: BloodGroup[]; canReceiveFrom: BloodGroup[]; rarity: string; note: string }
> = {
  'O-': {
    canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    rarity: '7% of population',
    note: 'Universal red cell donor. Crucial in emergency trauma rooms when patient blood type is unknown.'
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    rarity: '37% of population',
    note: 'Most common blood type and highest in clinical demand for daily surgeries.'
  },
  'A-': {
    canDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    rarity: '6% of population',
    note: 'Universal platelet type. Ideal for whole blood and platelet donations.'
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    rarity: '34% of population',
    note: 'Second most common blood type. Vital for cancer therapies and scheduled procedures.'
  },
  'B-': {
    canDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    rarity: '2% of population',
    note: 'Very rare. Donors with B- are urgently needed whenever emergency trauma occurs.'
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    rarity: '9% of population',
    note: 'Essential blood group supporting sickle cell disease and complex surgical cases.'
  },
  'AB-': {
    canDonateTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    rarity: '1% of population',
    note: 'The rarest blood type on Earth. Universal plasma donor.'
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    rarity: '4% of population',
    note: 'Universal red cell recipient. Can receive blood from any group safely.'
  }
};

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'req-101',
    patientName: 'Sophia Martinez',
    patientAge: 29,
    bloodGroup: 'O-',
    unitsNeeded: 3,
    unitsPledged: 2,
    urgency: 'Critical',
    hospitalName: 'Metropolitan Trauma Center',
    hospitalAddress: '742 Healthcare Parkway, Tower B, 4th Floor ICU',
    city: 'Metro City',
    distanceKm: 2.4,
    contactName: 'Dr. Aaron Chen (Trauma Lead)',
    contactPhone: '+1 (555) 382-9012',
    reason: 'Emergency cesarean delivery complications with severe hemorrhage.',
    requiredBy: 'Today, within 2 hours',
    createdAt: '18 minutes ago',
    status: 'Open',
    donorsResponding: 3,
    isVerified: true
  },
  {
    id: 'req-102',
    patientName: 'David K. O’Connor',
    patientAge: 46,
    bloodGroup: 'B-',
    unitsNeeded: 2,
    unitsPledged: 0,
    urgency: 'Critical',
    hospitalName: 'St. Jude Regional Hospital',
    hospitalAddress: '1100 Pine Crest Boulevard, Emergency Ward',
    city: 'Metro City',
    distanceKm: 4.1,
    contactName: 'Nurse Patricia Vance',
    contactPhone: '+1 (555) 721-4490',
    reason: 'Multiple fracture surgery following highway motorcycle collision.',
    requiredBy: 'Today, within 4 hours',
    createdAt: '45 minutes ago',
    status: 'Open',
    donorsResponding: 1,
    isVerified: true
  },
  {
    id: 'req-103',
    patientName: 'Amara Patel',
    patientAge: 8,
    bloodGroup: 'A+',
    unitsNeeded: 2,
    unitsPledged: 1,
    urgency: 'Urgent',
    hospitalName: 'Childrens Health & Research Center',
    hospitalAddress: '320 University Ave, Pediatric Hematology',
    city: 'Metro City',
    distanceKm: 5.8,
    contactName: 'Rohit Patel (Father)',
    contactPhone: '+1 (555) 490-1288',
    reason: 'Routine scheduled transfusion for thalassemia treatment.',
    requiredBy: 'Tomorrow morning, 9:00 AM',
    createdAt: '2 hours ago',
    status: 'In Progress',
    donorsResponding: 2,
    isVerified: true
  },
  {
    id: 'req-104',
    patientName: 'Marcus Reynolds',
    patientAge: 62,
    bloodGroup: 'AB-',
    unitsNeeded: 2,
    unitsPledged: 0,
    urgency: 'Urgent',
    hospitalName: 'City Memorial Heart Institute',
    hospitalAddress: '880 Cardiac Pavilion Way',
    city: 'Metro City',
    distanceKm: 7.2,
    contactName: 'Coord. Elena Rostova',
    contactPhone: '+1 (555) 819-3304',
    reason: 'Coronary artery bypass graft procedure planned for 06:00 AM.',
    requiredBy: 'Tonight by 10:00 PM',
    createdAt: '3 hours ago',
    status: 'Open',
    donorsResponding: 0,
    isVerified: true
  },
  {
    id: 'req-105',
    patientName: 'Rachel Green',
    patientAge: 34,
    bloodGroup: 'O+',
    unitsNeeded: 4,
    unitsPledged: 3,
    urgency: 'Standard',
    hospitalName: 'Westside Community Hospital',
    hospitalAddress: '540 Oakridge Lane',
    city: 'Metro City',
    distanceKm: 9.5,
    contactName: 'James Green (Spouse)',
    contactPhone: '+1 (555) 234-9910',
    reason: 'Platelet replenishment following oncological chemotherapy cycle.',
    requiredBy: 'Thursday, Oct 4',
    createdAt: '5 hours ago',
    status: 'In Progress',
    donorsResponding: 4,
    isVerified: true
  }
];

export const INITIAL_CAMPS: BloodCamp[] = [
  {
    id: 'camp-201',
    title: 'Metro Civic Center Mega Blood Drive',
    organizer: 'National Red Cross & City Health Commission',
    date: 'Saturday, Oct 10, 2026',
    time: '09:00 AM – 04:00 PM',
    location: 'Civic Auditorium Main Concourse',
    address: '100 Government Plaza, Downtown',
    city: 'Metro City',
    targetUnits: 150,
    registeredDonors: 114,
    isRegistered: false,
    contactNumber: '+1 (555) 900-2440',
    description: 'Complimentary health screening, hemoglobin testing, refreshments, and commemorative donor pins provided to all attendees.'
  },
  {
    id: 'camp-202',
    title: 'University Youth Lifesaver Drive',
    organizer: 'Tech Institute Medical Student Association',
    date: 'Wednesday, Oct 14, 2026',
    time: '10:00 AM – 03:30 PM',
    location: 'Student Union Quad & Mobile Bus',
    address: '450 Campus Way, North Gate',
    city: 'Metro City',
    targetUnits: 80,
    registeredDonors: 62,
    isRegistered: true,
    contactNumber: '+1 (555) 412-8800',
    description: 'Special youth awareness camp with free blood typing and educational talks on rare antibodies.'
  },
  {
    id: 'camp-203',
    title: 'Rotary Club Weekend Donor Camp',
    organizer: 'Rotary International District 5200',
    date: 'Sunday, Oct 18, 2026',
    time: '08:30 AM – 02:00 PM',
    location: 'Community Recreation Center Hall',
    address: '77 Lakeview Blvd',
    city: 'Metro City',
    targetUnits: 100,
    registeredDonors: 43,
    isRegistered: false,
    contactNumber: '+1 (555) 677-3311',
    description: 'Family-friendly donation drive with on-site certified phlebotomists and donor certificate presentations.'
  }
];

export const TOP_DONORS: DonorProfile[] = [
  {
    id: 'donor-1',
    name: 'Sarah Lindqvist',
    bloodGroup: 'O-',
    city: 'Metro City',
    avatarSeed: 'sarah',
    totalDonations: 28,
    livesSaved: 84,
    lastDonationDate: '2026-07-15',
    streakMonths: 18,
    rank: 1,
    tier: 'Platinum Donor',
    badges: ['Universal Hero', '10+ Milestone', 'Emergency Responder', 'Lifesaver Pro']
  },
  {
    id: 'donor-2',
    name: 'Marcus Vance',
    bloodGroup: 'B+',
    city: 'Metro City',
    avatarSeed: 'marcus',
    totalDonations: 22,
    livesSaved: 66,
    lastDonationDate: '2026-08-02',
    streakMonths: 14,
    rank: 2,
    tier: 'Gold Donor',
    badges: ['Century Candidate', 'Rapid Responder', 'Golden Heart']
  },
  {
    id: 'donor-3',
    name: 'Elena Chen',
    bloodGroup: 'A-',
    city: 'Metro City',
    avatarSeed: 'elena',
    totalDonations: 19,
    livesSaved: 57,
    lastDonationDate: '2026-06-20',
    streakMonths: 11,
    rank: 3,
    tier: 'Gold Donor',
    badges: ['Platelet Champion', 'Summer Lifesaver', 'Community Pillar']
  },
  {
    id: 'donor-4',
    name: 'Julian Santos',
    bloodGroup: 'AB+',
    city: 'Metro City',
    avatarSeed: 'julian',
    totalDonations: 15,
    livesSaved: 45,
    lastDonationDate: '2026-09-01',
    streakMonths: 8,
    rank: 4,
    tier: 'Silver Donor',
    badges: ['Plasma Pioneer', 'Steady Donor']
  },
  {
    id: 'donor-5',
    name: 'You (Alex Reed)',
    bloodGroup: 'O+',
    city: 'Metro City',
    avatarSeed: 'alex',
    totalDonations: 6,
    livesSaved: 18,
    lastDonationDate: '2026-06-10',
    streakMonths: 6,
    rank: 12,
    tier: 'Bronze Hero',
    badges: ['First Drop', 'Three in a Row', 'Verified Donor']
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Emergency Blood Need: O- at Metro Trauma',
    message: '3 units needed urgently for trauma surgery. You are 2.4 km away.',
    type: 'emergency',
    timestamp: '15m ago',
    read: false,
    actionTarget: 'req-101'
  },
  {
    id: 'notif-2',
    title: 'Donation Eligibility Reached!',
    message: 'Congratulations! It has been over 90 days since your last whole blood donation. You are eligible to donate today.',
    type: 'reminder',
    timestamp: '2h ago',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Camp Registration Confirmed',
    message: 'Your slot at University Youth Lifesaver Drive has been confirmed for Oct 14.',
    type: 'camp',
    timestamp: 'Yesterday',
    read: true,
    actionTarget: 'camp-202'
  }
];
