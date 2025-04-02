export interface UserProfile {
  firstName: string;
  lastName: string;
  role: string;
  relationship: string;
  dateOfBirth: string;
  phoneNumber: string;
  alertPreference: AlertPreference | null;
  healthConditions: string[];
  medications: Medication[];
  lovedOne: LovedOneProfile;
}

export interface LovedOneProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  alertPreference: AlertPreference | null;
}

export interface Medication {
  id: string;
  name: string;
  strength: string;
  form: string;
  doses: Dose[];
  asNeeded?: {
    maxPerDay: number;
  } | null;
}

export interface Dose {
  id: string;
  days: string[];
  times: string[];
  quantity: number;
}

export enum OnboardingStep {
  Welcome = 0,
  PersonalInfo = 1,
  LovedOneInfo = 2,
  HealthConditions = 3,
  Medications = 4,
  Review = 5,
  Complete = 6
}

export enum UserRole {
  PrimaryUser = "primary_user",
  Caregiver = "caregiver"
}

export enum AlertPreference {
  Text = "text",
  PhoneCall = "phone_call",
  AppNotification = "app_notification"
}

export const DAYS_OPTIONS = [
  { value: 'everyday', label: 'Everyday' },
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
];

export const MEDICATION_FORMS = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'injection', label: 'Injection' },
  { value: 'cream', label: 'Cream' },
  { value: 'patch', label: 'Patch' },
  { value: 'inhaler', label: 'Inhaler' },
  { value: 'other', label: 'Other' },
];

export const USER_ROLES = [
  { value: UserRole.PrimaryUser, label: 'Primary User' },
  { value: UserRole.Caregiver, label: 'Caregiver' },
];

export const RELATIONSHIP_OPTIONS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' },
];

export const ALERT_PREFERENCES = [
  { value: AlertPreference.Text, label: 'Text Message' },
  { value: AlertPreference.PhoneCall, label: 'Phone Call' },
  { value: AlertPreference.AppNotification, label: 'App Notification' },
];
