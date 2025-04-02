export interface UserProfile {
  firstName: string;
  lastName: string;
  role: string;
  dateOfBirth: string;
  phoneNumber: string;
  healthConditions: string[];
  medications: Medication[];
}

export interface Medication {
  id: string;
  name: string;
  strength: string;
  form: string;
  doses: Dose[];
}

export interface Dose {
  id: string;
  days: string[];
  times: string[];
  quantity: number;
}

export enum OnboardingStep {
  Welcome = 0,
  Examples = 1,
  PersonalInfo = 2,
  HealthConditions = 3,
  Medications = 4,
  Review = 5,
  Complete = 6
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
