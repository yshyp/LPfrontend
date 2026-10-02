export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'Critical' | 'Urgent' | 'Standard';

export type RequestStatus = 'Open' | 'In Progress' | 'Fulfilled' | 'Cancelled';

export interface BloodRequest {
  id: string;
  patientName: string;
  patientAge: number;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  unitsPledged: number;
  urgency: UrgencyLevel;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  distanceKm: number;
  contactName: string;
  contactPhone: string;
  reason: string;
  requiredBy: string;
  createdAt: string;
  status: RequestStatus;
  donorsResponding: number;
  isVerified: boolean;
}

export interface BloodCamp {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  address: string;
  city: string;
  targetUnits: number;
  registeredDonors: number;
  isRegistered?: boolean;
  contactNumber: string;
  description: string;
}

export interface DonorProfile {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  city: string;
  avatarSeed: string;
  totalDonations: number;
  livesSaved: number;
  lastDonationDate: string; // ISO date
  streakMonths: number;
  rank: number;
  tier: 'Platinum Donor' | 'Gold Donor' | 'Silver Donor' | 'Bronze Hero';
  badges: string[];
}

export interface ChatMessage {
  id: string;
  requestId: string;
  sender: 'user' | 'coordinator';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'request' | 'camp' | 'reminder';
  timestamp: string;
  read: boolean;
  actionTarget?: string;
}
