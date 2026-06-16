export interface PositionAppliedFor {
  position: string;
  preferredLocation: string;
  startDate: string;
  noticePeriod: string;
  employmentType: string; // Full-time, Part-time, Bank / Zero Hours, Nights
  trafficSource: string; // How did you hear...
  workedHereBefore: 'Yes' | 'No' | '';
  workedHereBeforeDetails: string;
}

export interface PersonalDetails {
  title: string; // Mr, Mrs, Miss, Ms, Other
  titleOther: string;
  fullName: string;
  previousNames: string;
  dob: string;
  niNumber: string;
  homeAddress: string;
  mobileNumber: string;
  emailAddress: string;
  preferredContact: string; // Phone, Email, Text Message
}

export interface NextOfKin {
  name: string;
  relationship: string;
  phoneNumber: string;
  emailAddress: string;
}

export interface BankDetails {
  bankName: string;
  holderName: string;
  sortCode: string;
  accountNumber: string;
}

export interface RightToWork {
  legallyEntitled: 'Yes' | 'No' | '';
  evidenceProvided: string; // UK/Irish Passport, Birth Certificate...
  shareCodeRef: string;
  visaExpiry: string;
  restrictions: 'No' | 'Yes' | '';
  restrictionDetails: string;
  sponsorshipRequired: 'No' | 'Yes' | '';
  officeCopiedChecked: 'Yes' | 'No' | '';
  officeCheckedBy: string;
  officeCheckedDate: string;
}

export interface DriveTravel {
  holdLicence: 'Yes' | 'No' | '';
  licenceNo: string;
  accessToVehicle: 'Yes' | 'No' | '';
  businessInsurance: string; // Yes, No, Will arrange
  drivingEndorsements: 'No' | 'Yes' | '';
  endorsementDetails: string;
  maxHoursPerWeek: string;
  preferredShifts: string[]; // Days, Evenings, Waking Nights, Sleep ins, Weekends, Bank Holidays
}

export interface AvailabilitySlot {
  am: boolean;
  pm: boolean;
  night: boolean;
}

export interface WeekAvailability {
  Monday: AvailabilitySlot;
  Tuesday: AvailabilitySlot;
  Wednesday: AvailabilitySlot;
  Thursday: AvailabilitySlot;
  Friday: AvailabilitySlot;
  Saturday: AvailabilitySlot;
  Sunday: AvailabilitySlot;
}

export interface EducationEntry {
  id: string;
  school: string;
  qualification: string;
  grade: string;
  dateCompleted: string;
}

export interface CareCertificateEntry {
  completed: 'Yes' | 'No' | '';
  provider: string;
  expiryDate: string;
}

export interface RelevantTraining {
  careCertificateInduction: CareCertificateEntry;
  safeguardingAdults: CareCertificateEntry;
  movingHandling: CareCertificateEntry;
  medicationAdministration: CareCertificateEntry;
  mentalHealthPBS: CareCertificateEntry;
  otherSpecialist: CareCertificateEntry;
}

export interface EmploymentEntry {
  id: string;
  employerNameAddress: string;
  jobTitle: string;
  startDateEndDate: string;
  mainDuties: string;
  reasonForLeaving: string;
  managerContactName: string;
  employerContactDetails: string; // Phone / Email
}

export interface CareSkills {
  personalCare: 'Yes' | 'No' | '';
  medicationSupport: 'Yes' | 'No' | '';
  movingHandling: 'Yes' | 'No' | '';
  dementiaCare: 'Yes' | 'No' | '';
  learningDisabilityAutism: 'Yes' | 'No' | '';
  mentalHealthBehaviours: 'Yes' | 'No' | '';
  supportedLivingDomiciliary: 'Yes' | 'No' | '';
  careSummary: string;
}

export interface Referee {
  name: string;
  jobTitleRelationship: string;
  organisation: string;
  address: string;
  telephone: string;
  email: string;
  mayContact: 'Yes' | 'No' | 'Only after conditional offer' | '';
}

export interface DbsSaferRecruitment {
  hasDbs: 'Yes' | 'No' | '';
  dbsNo: string;
  registeredUpdateService: 'Yes' | 'No' | '';
  updateServiceChecked: 'Yes' | 'No' | '';
  everBarred: 'No' | 'Yes' | '';
  barDetails: string;
  hasConvictions: 'No' | 'Yes' | '';
  convictionDetails: string;
  subjectToDisciplinary: 'No' | 'Yes' | '';
  disciplinaryDetails: string;
  applicantAcknowledged: boolean;
}

export interface HealthAdjustments {
  requireAdjustments: 'No' | 'Yes' | '';
  adjustmentDetails: string;
  healthConditions: 'No' | 'Yes' | '';
  healthDetails: string;
  otherSupportNeeds: 'No' | 'Yes' | '';
  otherNeedsDetails: string;
}

export interface ChecklistItem {
  received: 'Yes' | 'No' | '';
  verifiedBy: string;
  date: string;
}

export interface DocumentsChecklist {
  proofOfIdentity: ChecklistItem;
  rightToWorkEvidence: ChecklistItem;
  proofOfAddress: ChecklistItem;
  niEvidence: ChecklistItem;
  dbsCertificate: ChecklistItem;
  trainingCertificates: ChecklistItem;
  bankDetailsChecked: ChecklistItem;
}

export interface ApplicantDeclaration {
  signature: string; // Data URL or Image representation
  date: string;
  printName: string;
}

export interface OfficeUseOnly {
  receivedDate: string;
  shortlisted: 'Yes' | 'No' | '';
  interviewDateTime: string;
  interviewedBy: string;
  outcome: 'Offer' | 'Reserve' | 'Unsuccessful' | '';
  conditionalOfferSent: 'Yes' | 'No' | '';
  conditionalOfferDate: string;
  referencesStatus: 'Requested' | 'Received' | 'Satisfactory' | '';
  rtwCompleted: 'Yes' | 'No' | '';
  dbsChecked: 'Yes' | 'No' | '';
  dbsCheckedDate: string;
  inductionBookedCompleted: 'Booked' | 'Completed' | '';
  startDateAgreed: string;
  recruitingManagerSignature: string;
  recruitingManagerName: string;
  recruitingManagerDate: string;
  decisionNotes: string;
}

export interface FullApplicationForm {
  positionApplied: PositionAppliedFor;
  personalDetails: PersonalDetails;
  nextOfKin: NextOfKin;
  bankDetails: BankDetails;
  rightToWork: RightToWork;
  driveTravel: DriveTravel;
  availability: WeekAvailability;
  education: EducationEntry[];
  relevantTraining: RelevantTraining;
  employmentHistory: EmploymentEntry[];
  employmentGaps: string;
  careSkills: CareSkills;
  referee1: Referee;
  referee2: Referee;
  dbsSafety: DbsSaferRecruitment;
  healthAdjustments: HealthAdjustments;
  checklist: DocumentsChecklist;
  declaration: ApplicantDeclaration;
  officeUse: OfficeUseOnly;
}
