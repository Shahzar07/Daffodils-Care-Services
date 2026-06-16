import React, { useState } from 'react';
import { FullApplicationForm, WeekAvailability, EducationEntry, EmploymentEntry } from '../types';
import { POSITIONS, LOCATIONS, SHIFTS, EVIDENCE_TYPES } from '../data';
import SignatureCanvas from './SignatureCanvas';

interface FormWizardProps {
  data: FullApplicationForm;
  onChange: (newData: FullApplicationForm) => void;
  onSubmit: () => void;
  onLoadDemo?: () => void;
}

export default function FormWizard({ data, onChange, onSubmit, onLoadDemo }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [validationError, setValidationError] = useState<string>('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>('');

  // Individual update helper methods to avoid nested spreadsheet state merging bugs
  const updatePositionField = (key: keyof typeof data.positionApplied, value: any) => {
    onChange({
      ...data,
      positionApplied: { ...data.positionApplied, [key]: value },
    });
  };

  const updatePersonalField = (key: keyof typeof data.personalDetails, value: any) => {
    onChange({
      ...data,
      personalDetails: { ...data.personalDetails, [key]: value },
    });
  };

  const updateNokField = (key: keyof typeof data.nextOfKin, value: any) => {
    onChange({
      ...data,
      nextOfKin: { ...data.nextOfKin, [key]: value },
    });
  };

  const updateBankField = (key: keyof typeof data.bankDetails, value: any) => {
    onChange({
      ...data,
      bankDetails: { ...data.bankDetails, [key]: value },
    });
  };

  const updateRtwField = (key: keyof typeof data.rightToWork, value: any) => {
    onChange({
      ...data,
      rightToWork: { ...data.rightToWork, [key]: value },
    });
  };

  const updateDriveField = (key: keyof typeof data.driveTravel, value: any) => {
    onChange({
      ...data,
      driveTravel: { ...data.driveTravel, [key]: value },
    });
  };

  const togglePreferredShift = (shiftId: string) => {
    const current = [...data.driveTravel.preferredShifts];
    const index = current.indexOf(shiftId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(shiftId);
    }
    updateDriveField('preferredShifts', current);
  };

  const updateAvailabilityCell = (day: keyof WeekAvailability, timeOfDay: 'am' | 'pm' | 'night', checked: boolean) => {
    onChange({
      ...data,
      availability: {
        ...data.availability,
        [day]: {
          ...data.availability[day],
          [timeOfDay]: checked,
        },
      },
    });
  };

  const updateEducationRow = (index: number, key: keyof EducationEntry, value: string) => {
    const nextEducation = [...data.education];
    nextEducation[index] = {
      ...nextEducation[index],
      [key]: value,
    };
    onChange({ ...data, education: nextEducation });
  };

  const addEducationRow = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        { id: `edu-${Date.now()}`, school: '', qualification: '', grade: '', dateCompleted: '' },
      ],
    });
  };

  const removeEducationRow = (id: string) => {
    if (data.education.length <= 1) return;
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    });
  };

  const updateTrainingField = (section: keyof typeof data.relevantTraining, field: 'completed' | 'provider' | 'expiryDate', value: string) => {
    onChange({
      ...data,
      relevantTraining: {
        ...data.relevantTraining,
        [section]: {
          ...data.relevantTraining[section],
          [field]: value,
        },
      },
    });
  };

  const updateEmploymentRow = (index: number, key: keyof EmploymentEntry, value: string) => {
    const nextEmployment = [...data.employmentHistory];
    nextEmployment[index] = {
      ...nextEmployment[index],
      [key]: value,
    };
    onChange({ ...data, employmentHistory: nextEmployment });
  };

  const addEmploymentRow = () => {
    onChange({
      ...data,
      employmentHistory: [
        ...data.employmentHistory,
        {
          id: `emp-${Date.now()}`,
          employerNameAddress: '',
          jobTitle: '',
          startDateEndDate: '',
          mainDuties: '',
          reasonForLeaving: '',
          managerContactName: '',
          employerContactDetails: '',
        },
      ],
    });
  };

  const removeEmploymentRow = (id: string) => {
    if (data.employmentHistory.length <= 1) return;
    onChange({
      ...data,
      employmentHistory: data.employmentHistory.filter((emp) => emp.id !== id),
    });
  };

  const updateCareSkillField = (key: keyof typeof data.careSkills, value: any) => {
    onChange({
      ...data,
      careSkills: { ...data.careSkills, [key]: value },
    });
  };

  const updateRefereeField = (refNo: 1 | 2, key: keyof typeof data.referee1, value: any) => {
    const refereeKey = refNo === 1 ? 'referee1' : 'referee2';
    onChange({
      ...data,
      [refereeKey]: { ...data[refereeKey], [key]: value },
    });
  };

  const updateDbsField = (key: keyof typeof data.dbsSafety, value: any) => {
    onChange({
      ...data,
      dbsSafety: { ...data.dbsSafety, [key]: value },
    });
  };

  const updateHealthField = (key: keyof typeof data.healthAdjustments, value: any) => {
    onChange({
      ...data,
      healthAdjustments: { ...data.healthAdjustments, [key]: value },
    });
  };

  const updateChecklistField = (key: keyof typeof data.checklist, field: 'received' | 'verifiedBy' | 'date', value: string) => {
    onChange({
      ...data,
      checklist: {
        ...data.checklist,
        [key]: {
          ...data.checklist[key],
          [field]: value,
        },
      },
    });
  };

  const updateDeclarationField = (key: keyof typeof data.declaration, value: any) => {
    onChange({
      ...data,
      declaration: { ...data.declaration, [key]: value },
    });
  };

  // Helper validation logic before jumping steps
  const handleNextStep = () => {
    setValidationError('');
    
    // Step 1 check
    if (currentStep === 1) {
      if (!data.positionApplied.position) {
        setValidationError('Please select the Position Applied For before continuing.');
        return;
      }
      if (!data.personalDetails.fullName) {
        setValidationError('Full Name is required in Section 2.');
        return;
      }
      if (!data.personalDetails.emailAddress || !data.personalDetails.emailAddress.includes('@')) {
        setValidationError('A valid Email Address is required in Section 2.');
        return;
      }
      if (!data.personalDetails.dob) {
        setValidationError('Date of Birth is required.');
        return;
      }
    }

    // Step 2 check
    if (currentStep === 2) {
      if (data.rightToWork.legallyEntitled === '') {
        setValidationError('Please answer if you are legally entitled to work in the UK.');
        return;
      }
      if (data.driveTravel.holdLicence === 'Yes' && !data.driveTravel.licenceNo) {
        setValidationError('Please enter your Driving Licence Number, or set Licence answer to "No".');
        return;
      }
    }

    // Step 4 check
    if (currentStep === 3) {
      // Allow moving next
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Safe Final Submission to Web3Forms
  const handleFinalSubmit = async () => {
    setValidationError('');
    if (!data.declaration.signature) {
      setValidationError('Please sign the applicant declaration signature pad before submitting.');
      return;
    }
    if (!data.declaration.printName) {
      setValidationError('Please type your print name to authorize consent.');
      return;
    }
    if (!data.dbsSafety.applicantAcknowledged) {
      setValidationError('Please tick the applicant acknowledgement box for DBS check checks.');
      return;
    }

    setSubmitStatus('loading');
    setSubmitErrorMessage('');

    try {
      const availabilitySummary = Object.entries(data.availability)
        .map(([day, slots]) => {
          const active = [];
          if (slots.am) active.push("AM");
          if (slots.pm) active.push("PM");
          if (slots.night) active.push("NIGHT");
          return `${day}: ${active.length > 0 ? active.join('/') : 'Unavailable'}`;
        })
        .join(', ');

      const educationSummary = data.education
        .map((edu, i) => `#${i + 1} School: ${edu.school}, Qualification: ${edu.qualification}, Grade: ${edu.grade}, Completed: ${edu.dateCompleted}`)
        .join(' | ');

      const employmentSummary = data.employmentHistory
        .map((emp, idx) => `Employer ${idx + 1}: ${emp.employerNameAddress}, Role: ${emp.jobTitle} (${emp.startDateEndDate}), Duties: ${emp.mainDuties}, Reason for Leaving: ${emp.reasonForLeaving}`)
        .join(' || ');

      const trainingSummary = Object.entries(data.relevantTraining)
        .map(([key, cert]) => {
          const readableKey = key.replace(/([A-Z])/g, ' $1').trim();
          return `${readableKey}: Completed=${cert.completed || 'No'} (${cert.provider || 'N/A'}, Expiry: ${cert.expiryDate || 'N/A'})`;
        })
        .join(' | ');

      const careSkillsSummary = [
        data.careSkills.personalCare === 'Yes' ? 'Personal Care' : '',
        data.careSkills.medicationSupport === 'Yes' ? 'Medication Support' : '',
        data.careSkills.movingHandling === 'Yes' ? 'Moving & Handling' : '',
        data.careSkills.dementiaCare === 'Yes' ? 'Dementia Care' : '',
        data.careSkills.learningDisabilityAutism === 'Yes' ? 'Learning Disability & Autism' : '',
        data.careSkills.mentalHealthBehaviours === 'Yes' ? 'Mental Health & Complex Behaviours' : '',
        data.careSkills.supportedLivingDomiciliary === 'Yes' ? 'Supported Living & Domiciliary' : ''
      ].filter(Boolean).join(', ') + ` (Summary: ${data.careSkills.careSummary || 'None provided'})`;

      const referee1Summary = `Referee 1: ${data.referee1.name} (${data.referee1.jobTitleRelationship}) at ${data.referee1.organisation}. Email: ${data.referee1.email}, Tel: ${data.referee1.telephone}. Allow Contact: ${data.referee1.mayContact || 'Yes'}`;
      const referee2Summary = `Referee 2: ${data.referee2.name} (${data.referee2.jobTitleRelationship}) at ${data.referee2.organisation}. Email: ${data.referee2.email}, Tel: ${data.referee2.telephone}. Allow Contact: ${data.referee2.mayContact || 'Yes'}`;

      const payload = {
        access_key: "02781a8a-9ad5-4b65-9cfe-aef6a44e8f11",
        subject: `New Care Assistant Application: ${data.personalDetails.fullName} - ${data.positionApplied.position}`,
        from_name: "Daffodils Care Services Portal",
        
        "Applicant Full Name": data.personalDetails.fullName,
        "Applicant Email Address": data.personalDetails.emailAddress,
        "Applicant Mobile Number": data.personalDetails.mobileNumber,
        "NI Number": data.personalDetails.niNumber || "N/A",
        "Position Applied": data.positionApplied.position,
        "Notice Period Required": data.positionApplied.noticePeriod || "None",
        "Date Available to Start": data.positionApplied.startDate || "Immediate",
        "Preferred Location": data.positionApplied.preferredLocation || "Not specified",
        "Employment Type Preferred": data.positionApplied.employmentType || "Not specified",
        "Right to Work UK": `${data.rightToWork.legallyEntitled} (${data.rightToWork.evidenceProvided || 'No details'})`,
        "Sponsorship Required": data.rightToWork.sponsorshipRequired || "No",
        "Driving License held": `${data.driveTravel.holdLicence} (Licence No: ${data.driveTravel.licenceNo || 'N/A'})`,
        "Access to Vehicle": data.driveTravel.accessToVehicle || "No",
        "Availability Weeks Grid": availabilitySummary,
        "Education Background": educationSummary,
        "Relevant Training Completed": trainingSummary,
        "Employment Portfolio": employmentSummary || "None listed",
        "Care Sector Competencies": careSkillsSummary,
        "Referee Contact 1": referee1Summary,
        "Referee Contact 2": referee2Summary,
        "DBS Check Status": `Active: ${data.dbsSafety.hasDbs || 'No'} (DBS No: ${data.dbsSafety.dbsNo || 'N/A'}), Update Service: ${data.dbsSafety.registeredUpdateService || 'No'}. Disciplinary: ${data.dbsSafety.subjectToDisciplinary || 'No'}. Ever Barred: ${data.dbsSafety.everBarred || 'No'}`,
        "Reasonable Adjustments Required": `${data.healthAdjustments.requireAdjustments} (${data.healthAdjustments.adjustmentDetails || 'None'})`,
        "Declaration Authorized Name": data.declaration.printName,
        "Declaration Date Signed": data.declaration.date,
        "Digitally Signed": data.declaration.signature ? "Yes, secure electronic signature registered" : "No"
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        const timestampMsg = `[Electronically transmitted to Daffodils Recruitment Team via Web3Forms on ${new Date().toLocaleString()}]`;
        onChange({
          ...data,
          officeUse: {
            ...data.officeUse,
            decisionNotes: (data.officeUse.decisionNotes || '') + '\n' + timestampMsg
          }
        });
        
        setTimeout(() => {
          setSubmitStatus('idle');
          onSubmit();
        }, 1800);
      } else {
        throw new Error(result.message || "Failed to submit. Please try again.");
      }
    } catch (err: any) {
      console.error("Web3Forms submission error", err);
      setSubmitStatus('error');
      setSubmitErrorMessage(err.message || "Network error. Please check your internet connection.");
    }
  };

  const stepLabels = [
    { num: 1, name: 'Position & Personal' },
    { num: 2, name: 'Eligibility & Driving' },
    { num: 3, name: 'Education & Employment' },
    { num: 4, name: 'Care Skills & References' },
    { num: 5, name: 'DBS, Health & Sign' },
  ];

  return (
    <div className="bg-white border border-slate-150 rounded-3xl p-6 sm:p-10 shadow-elegant">
      
      {/* Daffodils Styled Header embedded in the Wizard container */}
      <div className="border-b border-slate-100 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center border border-primary-border shrink-0 select-none">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50,85 C50,85 45,70 48,55 C49,50 51,50 52,55 C55,70 50,85 50,85" fill="#233D04" />
              <path d="M45,85 C45,85 30,73 40,58 C45,63 45,85 45,85" fill="#4B6E2C" />
              <path d="M50,45 C45,30 35,25 50,15 C65,25 55,30 50,45 Z" fill="#EAB308" />
              <path d="M50,55 C45,70 35,75 50,85 C65,75 55,70 50,55 Z" fill="#EAB308" />
              <path d="M45,50 C30,45 25,35 15,50 C25,65 30,55 45,50 Z" fill="#CA8A04" />
              <path d="M55,50 C70,45 75,35 85,50 C75,65 70,55 55,50 Z" fill="#CA8A04" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 uppercase font-sans">
              Daffodils Care Services
            </h1>
            <p className="text-3xs text-primary font-mono uppercase tracking-wider font-bold">Compassion • Care • Community</p>
          </div>
        </div>
        
        {/* prefill option */}
        {onLoadDemo && (
          <button
            type="button"
            onClick={onLoadDemo}
            className="px-3.5 py-1.5 bg-primary-light hover:bg-primary-border text-primary border border-primary-border text-2xs font-mono font-bold rounded-lg shadow-2xs active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            title="Pre-populate form with valid demonstration data"
          >
            <span>⚡ Prefill Demo Portfolio</span>
          </button>
        )}
      </div>

      {/* High-End Elegant Progress Timeline Tracker */}
      <div className="relative mb-10 w-full">
        {/* Line connecting nodes */}
        <div className="absolute top-4 left-4 right-4 h-[2px] bg-slate-100 z-0 hidden md:block" />
        <div 
          className="absolute top-4 left-4 h-[2px] bg-primary z-0 transition-all duration-300 hidden md:block"
          style={{ width: `${((currentStep - 1) / 4) * 92}%` }}
        />
        
        {/* Nodes wrapper */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          {stepLabels.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = s.num < currentStep;
            return (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < currentStep) {
                    setCurrentStep(s.num);
                  }
                }}
                className={`flex items-center md:flex-col gap-3 md:gap-1.5 p-1 rounded-xl transition-all md:text-center shrink-0 md:w-36 ${
                  s.num < currentStep ? 'cursor-pointer' : ''
                }`}
              >
                {/* Node Bubble */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-primary text-white ring-4 ring-primary-light scale-105 shadow-md'
                    : isCompleted
                    ? 'bg-primary text-white'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}>
                  {isCompleted ? '✓' : s.num}
                </div>
                {/* Tag */}
                <div className="min-w-0">
                  <span className={`block text-3xs font-black uppercase tracking-widest leading-none ${
                    isActive ? 'text-primary' : isCompleted ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    Step 0{s.num}
                  </span>
                  <span className={`block text-2xs font-bold mt-0.5 leading-tight ${
                    isActive ? 'text-slate-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                  }`}>
                    {s.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-805 flex items-center gap-2.5 shadow-2xs font-mono">
          <span className="text-base text-red-600">⚠️</span>
          <span><strong>Validation Warning:</strong> {validationError}</span>
        </div>
      )}

      {/* STEP 1: POSITION APPLIED FOR, PERSONAL DETAILS, NOK */}
      {currentStep === 1 && (
        <div className="space-y-8 animate-fade-in">
          {/* Section 1: POSITION APPLIED FOR */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              1. POSITION APPLIED FOR
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Position / Role Applied For *</label>
                <select
                  value={data.positionApplied.position}
                  onChange={(e) => updatePositionField('position', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                >
                  <option value="">— Select Position —</option>
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Location / Service</label>
                <select
                  value={data.positionApplied.preferredLocation}
                  onChange={(e) => updatePositionField('preferredLocation', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                >
                  <option value="">— Select Regional Area —</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date Available to Start</label>
                <input
                  type="date"
                  value={data.positionApplied.startDate}
                  onChange={(e) => updatePositionField('startDate', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notice Period required from current employer</label>
                <input
                  type="text"
                  placeholder="e.g. 4 weeks, Immediate, None"
                  value={data.positionApplied.noticePeriod}
                  onChange={(e) => updatePositionField('noticePeriod', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Employment Type Preferred</label>
                <div className="flex flex-wrap gap-2.5">
                  {['Full-time', 'Part-time', 'Bank / Zero Hours', 'Nights'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => updatePositionField('employmentType', opt)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        data.positionApplied.employmentType === opt
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">How did you hear about this vacancy?</label>
                <input
                  type="text"
                  placeholder="e.g. Indeed, Friend Referral, Website, Facebook"
                  value={data.positionApplied.trafficSource}
                  onChange={(e) => updatePositionField('trafficSource', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
              <label className="block text-xs font-semibold text-emerald-950 mb-1.5">
                Have you worked for Daffodils Care Services LTD before?
              </label>
              <div className="flex gap-4">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 font-semibold select-none">
                    <input
                      type="radio"
                      name="workedBefore"
                      value={opt}
                      checked={data.positionApplied.workedHereBefore === opt}
                      onChange={() => updatePositionField('workedHereBefore', opt)}
                      className="accent-emerald-600 w-3.5 h-3.5"
                    />
                    {opt}
                  </label>
                ))}
              </div>

              {data.positionApplied.workedHereBefore === 'Yes' && (
                <div className="mt-3">
                  <label className="block text-2xs font-semibold text-emerald-800 mb-1">If yes, please list roles & dates:</label>
                  <input
                    type="text"
                    placeholder="e.g. Care assistant in 2024 at Blackburn Branch"
                    value={data.positionApplied.workedHereBeforeDetails}
                    onChange={(e) => updatePositionField('workedHereBeforeDetails', e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: PERSONAL DETAILS */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              2. PERSONAL DETAILS
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title *</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={data.personalDetails.title}
                    onChange={(e) => updatePersonalField('title', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  >
                    <option value="">— Choose —</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Ms">Ms</option>
                    <option value="Other">Other</option>
                  </select>
                  {data.personalDetails.title === 'Other' && (
                    <input
                      type="text"
                      placeholder="Specify"
                      value={data.personalDetails.titleOther}
                      onChange={(e) => updatePersonalField('titleOther', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name (Legal Name) *</label>
                <input
                  type="text"
                  placeholder="e.g. Johnathan Smith"
                  value={data.personalDetails.fullName}
                  onChange={(e) => updatePersonalField('fullName', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-bold"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Previous / Other Names</label>
                <input
                  type="text"
                  placeholder="Maiden names or previous legal monikers"
                  value={data.personalDetails.previousNames}
                  onChange={(e) => updatePersonalField('previousNames', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={data.personalDetails.dob}
                  onChange={(e) => updatePersonalField('dob', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">National Insurance Number</label>
                <input
                  type="text"
                  placeholder="e.g. QQ 12 34 56 C"
                  value={data.personalDetails.niNumber}
                  onChange={(e) => updatePersonalField('niNumber', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm tracking-widest font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="UK contact mobile number"
                  value={data.personalDetails.mobileNumber}
                  onChange={(e) => updatePersonalField('mobileNumber', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                />
              </div>

              <div className="col-span-1 sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Home Address *</label>
                <textarea
                  rows={2}
                  placeholder="Complete current home street address, city, and postcode"
                  value={data.personalDetails.homeAddress}
                  onChange={(e) => updatePersonalField('homeAddress', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="applicant@example.com"
                  value={data.personalDetails.emailAddress}
                  onChange={(e) => updatePersonalField('emailAddress', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-emerald-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Preferred Contact Method</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Phone', 'Email', 'Text'].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => updatePersonalField('preferredContact', opt)}
                      className={`px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                        data.personalDetails.preferredContact === opt
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: NEXT OF KIN DETAILS */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              3. NEXT OF KIN DETAILS
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Name of Next of Kin</label>
                <input
                  type="text"
                  placeholder="Primary contact name during service"
                  value={data.nextOfKin.name}
                  onChange={(e) => updateNokField('name', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Relationship to Employee</label>
                <input
                  type="text"
                  placeholder="e.g. Spouse, Parent, Sibling, Friend"
                  value={data.nextOfKin.relationship}
                  onChange={(e) => updateNokField('relationship', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Phone Number</label>
                <input
                  type="tel"
                  placeholder="Emergency telephone contact"
                  value={data.nextOfKin.phoneNumber}
                  onChange={(e) => updateNokField('phoneNumber', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="nextofkin@example.com"
                  value={data.nextOfKin.emailAddress}
                  onChange={(e) => updateNokField('emailAddress', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: FINANCIALS, RIGHT TO WORK, DRIVING LICENCE & SCHEDULE GRID */}
      {currentStep === 2 && (
        <div className="space-y-8 animate-fade-in">
          {/* Section 4: BANK ACCOUNT DETAILS */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              4. BANK ACCOUNT DETAILS (Payroll Setup)
            </div>
            <p className="text-3xs text-gray-500 italic mt-1 bg-yellow-50/50 p-2 border border-yellow-101 rounded-lg">
              🔒 Safe HR submission clause: Daffodils Care Services LTD handles payment details confidentiality under UK GDPR rules.
            </p>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. Barclays, HSBC, Lloyds"
                  value={data.bankDetails.bankName}
                  onChange={(e) => updateBankField('bankName', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  placeholder="Name EXACTLY as printed on card / statement"
                  value={data.bankDetails.holderName}
                  onChange={(e) => updateBankField('holderName', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm tracking-wide uppercase font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sort Code</label>
                <input
                  type="text"
                  placeholder="e.g. 20-30-40"
                  value={data.bankDetails.sortCode}
                  onChange={(e) => updateBankField('sortCode', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm tracking-widest font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="8 digits account number"
                  value={data.bankDetails.accountNumber}
                  onChange={(e) => updateBankField('accountNumber', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm tracking-widest font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 5: RIGHT TO WORK */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              5. RIGHT TO WORK IN THE UK
            </div>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Are you legally entitled to work in the UK? *</label>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none font-bold">
                      <input
                        type="radio"
                        name="rtwEntitled"
                        value={opt}
                        checked={data.rightToWork.legallyEntitled === opt}
                        onChange={() => updateRtwField('legallyEntitled', opt)}
                        className="accent-emerald-600 w-3.5 h-3.5"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Right-to-work evidence standard *</label>
                  <select
                    value={data.rightToWork.evidenceProvided}
                    onChange={(e) => updateRtwField('evidenceProvided', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-2 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
                  >
                    <option value="">— Choose Document Provided —</option>
                    {EVIDENCE_TYPES.map((ev) => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Share Code / Visa / Passport Reference Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 9-character share code or passport number"
                    value={data.rightToWork.shareCodeRef}
                    onChange={(e) => updateRtwField('shareCodeRef', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm tracking-widest font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Visa / Permission Expiry Date (if applicable)</label>
                  <input
                    type="date"
                    value={data.rightToWork.visaExpiry}
                    onChange={(e) => updateRtwField('visaExpiry', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Do you require employer sponsorship? *</label>
                  <div className="flex gap-4">
                    {['No', 'Yes'].map((opt) => (
                      <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none">
                        <input
                          type="radio"
                          name="rtwSponsorship"
                          value={opt}
                          checked={data.rightToWork.sponsorshipRequired === opt}
                          onChange={() => updateRtwField('sponsorshipRequired', opt)}
                          className="accent-emerald-600 w-3.5 h-3.5"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Any restrictions on your right to work?</label>
                <div className="flex gap-4 mb-2">
                  {['No', 'Yes'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none">
                      <input
                        type="radio"
                        name="rtwRestrictions"
                        value={opt}
                        checked={data.rightToWork.restrictions === opt}
                        onChange={() => updateRtwField('restrictions', opt)}
                        className="accent-emerald-600 w-3.5 h-3.5"
                      />
                      {opt}
                    </label>
                  ))}
                </div>

                {data.rightToWork.restrictions === 'Yes' && (
                  <input
                    type="text"
                    placeholder="Give specific details..."
                    value={data.rightToWork.restrictionDetails}
                    onChange={(e) => updateRtwField('restrictionDetails', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 6: DRIVING & AVAILABILITY */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              6. DRIVING, TRAVEL AND AVAILABILITY
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Do you hold a valid UK driving licence?</label>
                <div className="flex gap-4 mb-2">
                  {['Yes', 'No'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none font-bold">
                      <input
                        type="radio"
                        name="driveLicence"
                        value={opt}
                        checked={data.driveTravel.holdLicence === opt}
                        onChange={() => updateDriveField('holdLicence', opt)}
                        className="accent-emerald-600 w-3.5 h-3.5"
                      />
                      {opt}
                    </label>
                  ))}
                </div>

                {data.driveTravel.holdLicence === 'Yes' && (
                  <input
                    type="text"
                    placeholder="Licence number (e.g. SMITH9501...)"
                    value={data.driveTravel.licenceNo}
                    onChange={(e) => updateDriveField('licenceNo', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm font-mono tracking-wider"
                  />
                )}
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Do you have access to a vehicle for work?</label>
                <div className="flex gap-4">
                  {['Yes', 'No'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none">
                      <input
                        type="radio"
                        name="driveVehicle"
                        value={opt}
                        checked={data.driveTravel.accessToVehicle === opt}
                        onChange={() => updateDriveField('accessToVehicle', opt)}
                        className="accent-emerald-600 w-3.5 h-3.5"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-bold">Business check insurance clause *</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'Yes', label: 'Yes (Active)' },
                    { id: 'No', label: 'No' },
                    { id: 'Will arrange if required', label: 'Will arrange if required' },
                  ].map((it) => (
                    <label key={it.id} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none">
                      <input
                        type="radio"
                        name="businessIns"
                        value={it.id}
                        checked={data.driveTravel.businessInsurance === it.id}
                        onChange={() => updateDriveField('businessInsurance', it.id)}
                        className="accent-emerald-600 w-3.5 h-3.5"
                      />
                      {it.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Any current driving endorsements / penalty points?</label>
                <div className="flex gap-4 mb-2">
                  {['No', 'Yes'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none">
                      <input
                        type="radio"
                        name="driveEndorsements"
                        value={opt}
                        checked={data.driveTravel.drivingEndorsements === opt}
                        onChange={() => updateDriveField('drivingEndorsements', opt)}
                        className="accent-emerald-600 w-3.5 h-3.5"
                      />
                      {opt}
                    </label>
                  ))}
                </div>

                {data.driveTravel.drivingEndorsements === 'Yes' && (
                  <input
                    type="text"
                    placeholder="Describe endorsements (e.g. SP30 speeding, 3 points)"
                    value={data.driveTravel.endorsementDetails}
                    onChange={(e) => updateDriveField('endorsementDetails', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Maximum hours available per week</label>
                <input
                  type="number"
                  placeholder="e.g. 37, 48, 20"
                  value={data.driveTravel.maxHoursPerWeek}
                  onChange={(e) => updateDriveField('maxHoursPerWeek', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-sm font-bold text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Preferred shifts (Multiselect)</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {SHIFTS.map((sh) => (
                    <label key={sh.id} className="inline-flex items-center gap-2 p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={data.driveTravel.preferredShifts.includes(sh.id)}
                        onChange={() => togglePreferredShift(sh.id)}
                        className="rounded-sm accent-emerald-600"
                      />
                      <span className="font-semibold text-gray-700 text-2xs">{sh.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Availability Matrix Table */}
            <div className="mt-6">
              <h4 className="text-sm font-bold text-emerald-950 uppercase tracking-widest mb-1.5">Availability to Work Schedule Grid</h4>
              <p className="text-3xs text-gray-500 italic mb-4">Please tick Yes for all the timeshops you can work over the standard Monday - Sunday hiring week.</p>
              
              <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-2xs">
                <table className="w-full border-collapse text-xs text-center">
                  <thead>
                    <tr className="bg-emerald-50/75 text-emerald-900 font-bold border-b border-gray-200">
                      <th className="p-3 text-left border-r border-gray-200 w-1/4">Day</th>
                      <th className="p-3 border-r border-gray-200">AM Available?</th>
                      <th className="p-3 border-r border-gray-200">PM Available?</th>
                      <th className="p-3">Night Available?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.keys(data.availability) as Array<keyof WeekAvailability>).map((day) => (
                      <tr key={day} className="border-b border-gray-100 hover:bg-gray-50/55">
                        <td className="p-2.5 text-left font-bold border-r border-gray-200 bg-gray-50/40">{day}</td>
                        <td className="p-2.5 border-r border-gray-200">
                          <label className="flex items-center justify-center gap-1.5 cursor-pointer p-1 rounded hover:bg-emerald-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={data.availability[day].am}
                              onChange={(e) => updateAvailabilityCell(day, 'am', e.target.checked)}
                              className="accent-emerald-600 scale-110"
                            />
                            <span className={data.availability[day].am ? 'text-emerald-700 font-bold font-mono' : 'text-gray-400 font-mono'}>
                              {data.availability[day].am ? 'Yes' : 'No'}
                            </span>
                          </label>
                        </td>
                        <td className="p-2.5 border-r border-gray-200">
                          <label className="flex items-center justify-center gap-1.5 cursor-pointer p-1 rounded hover:bg-emerald-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={data.availability[day].pm}
                              onChange={(e) => updateAvailabilityCell(day, 'pm', e.target.checked)}
                              className="accent-emerald-600 scale-110"
                            />
                            <span className={data.availability[day].pm ? 'text-emerald-700 font-bold font-mono' : 'text-gray-400 font-mono'}>
                              {data.availability[day].pm ? 'Yes' : 'No'}
                            </span>
                          </label>
                        </td>
                        <td className="p-2.-5">
                          <label className="flex items-center justify-center gap-1.5 cursor-pointer p-1 rounded hover:bg-emerald-50 transition-colors">
                            <input
                              type="checkbox"
                              checked={data.availability[day].night}
                              onChange={(e) => updateAvailabilityCell(day, 'night', e.target.checked)}
                              className="accent-emerald-600 scale-110"
                            />
                            <span className={data.availability[day].night ? 'text-emerald-700 font-bold font-mono' : 'text-gray-400 font-mono'}>
                              {data.availability[day].night ? 'Yes' : 'No'}
                            </span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: EDUCATION, SPECIAL TRAINING & EMPLOYMENT HISTORY */}
      {currentStep === 3 && (
        <div className="space-y-8 animate-fade-in">
          {/* Section 7: EDUCATION, QUALIFICATIONS */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center justify-between">
              <span>7. EDUCATION, QUALIFICATIONS AND TRAINING</span>
              <button
                type="button"
                onClick={addEducationRow}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-4xs font-mono font-bold rounded shadow-xs active:scale-95 transition-all text-white cursor-pointer"
              >
                + Add Qualification
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="p-4 border border-gray-200 rounded-2xl bg-gray-50/50 flex flex-col gap-3 relative shadow-3xs hover:border-emerald-250 transition-colors">
                  <div className="flex justify-between items-center border-b pb-1 border-gray-201/50">
                    <span className="text-3xs tracking-wider uppercase font-bold text-gray-500 font-mono">Row #{idx + 1}</span>
                    {data.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducationRow(edu.id)}
                        className="text-3xs font-semibold text-red-500 hover:text-red-700 cursor-pointer p-1 px-2 rounded hover:bg-red-50"
                      >
                        ✕ Remove Row
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-1">
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">School / College Provider</label>
                      <input
                        type="text"
                        placeholder="e.g. Nelson Secondary School"
                        value={edu.school}
                        onChange={(e) => updateEducationRow(idx, 'school', e.target.value)}
                        className="w-full bg-white border border-gray-202 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Qualification / Course</label>
                      <input
                        type="text"
                        placeholder="e.g. GCSEs or BTEC Care Level 2"
                        value={edu.qualification}
                        onChange={(e) => updateEducationRow(idx, 'qualification', e.target.value)}
                        className="w-full bg-white border border-gray-202 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Grade / Level achieved</label>
                      <input
                        type="text"
                        placeholder="e.g. Grade A, Merit, Pass"
                        value={edu.grade}
                        onChange={(e) => updateEducationRow(idx, 'grade', e.target.value)}
                        className="w-full bg-white border border-gray-202 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Date Completed</label>
                      <input
                        type="text"
                        placeholder="e.g. June 2021"
                        value={edu.dateCompleted}
                        onChange={(e) => updateEducationRow(idx, 'dateCompleted', e.target.value)}
                        className="w-full bg-white border border-gray-202 rounded-lg py-1.5 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Relevant Care Certificates Subform */}
            <div className="mt-8">
              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-widest mb-1">Relevant Care Training & certificates (Mandatory Checks)</h4>
              <p className="text-3xs text-gray-500 italic mb-4">Are you in possession of these core care qualifications? Answer Yes/No and details below.</p>
              
              <div className="space-y-4">
                {[
                  { key: 'careCertificateInduction', label: 'Care Certificate / Induction' },
                  { key: 'safeguardingAdults', label: 'Safeguarding Adults' },
                  { key: 'movingHandling', label: 'Moving & Handling' },
                  { key: 'medicationAdministration', label: 'Medication Administration' },
                  { key: 'mentalHealthPBS', label: 'Mental Health / PBS' },
                  { key: 'otherSpecialist', label: 'Other Specialist Training/Certificates' },
                ].map((trainingRow) => {
                  const entryKey = trainingRow.key as keyof typeof data.relevantTraining;
                  const item = data.relevantTraining[entryKey];
                  return (
                    <div key={trainingRow.key} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 border border-gray-200/50 bg-gray-50/25 rounded-2xl items-center text-xs">
                      <div className="font-bold text-gray-700">{trainingRow.label}</div>
                      <div className="flex gap-4 p-1">
                        {['Yes', 'No'].map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer font-sans select-none text-2xs font-bold text-gray-600">
                            <input
                              type="radio"
                              name={`training-${trainingRow.key}`}
                              value={opt}
                              checked={item.completed === opt}
                              onChange={() => updateTrainingField(entryKey, 'completed', opt)}
                              className="accent-emerald-600 w-3.5 h-3.5"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                      <div className="col-span-1">
                        <input
                          type="text"
                          placeholder="Provider / Certificate Number"
                          value={item.provider}
                          onChange={(e) => updateTrainingField(entryKey, 'provider', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg py-1 px-2 text-2xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                      <div className="col-span-1 animate-fade-in">
                        <input
                          type="text"
                          placeholder="Expiry / Renewal Date"
                          value={item.expiryDate}
                          onChange={(e) => updateTrainingField(entryKey, 'expiryDate', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg py-1 px-2 text-2xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 8: EMPLOYMENT HISTORY */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center justify-between">
              <span>8. EMPLOYMENT HISTORY (Current / Recent first)</span>
              <button
                type="button"
                onClick={addEmploymentRow}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-4xs font-mono font-bold rounded shadow-xs active:scale-95 transition-all text-white cursor-pointer"
              >
                + Add Employer
              </button>
            </div>
            <p className="text-3xs text-gray-500 italic mt-1.5 mb-4">Please list any employment history. You must fully explain any gaps in care employment history in the box below.</p>

            <div className="space-y-6">
              {data.employmentHistory.map((work, idx) => (
                <div key={work.id} className="p-5 border-2 border-emerald-100 rounded-2xl bg-emerald-50/10 flex flex-col gap-4 relative shadow-2xs">
                  <div className="flex justify-between items-center border-b pb-2 border-emerald-100">
                    <span className="text-3xs tracking-widest uppercase font-black text-emerald-800 font-mono">
                      {idx === 0 ? "💼 Current / Most Recent Employer" : `💼 Employer #${idx + 1}`}
                    </span>
                    {data.employmentHistory.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeEmploymentRow(work.id)}
                        className="text-2xs font-extrabold text-red-500 hover:text-red-700 cursor-pointer p-1 rounded bg-red-50 hover:bg-red-100/50"
                      >
                        ✕ Delete Employer
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Employer Name and Address</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Care UK Nelson Branch, BB9 9XX"
                        value={work.employerNameAddress}
                        onChange={(e) => updateEmploymentRow(idx, 'employerNameAddress', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Healthcare Assistant"
                        value={work.jobTitle}
                        onChange={(e) => updateEmploymentRow(idx, 'jobTitle', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Start Date - End Date</label>
                      <input
                        type="text"
                        placeholder="e.g. Jan 2022 - Mar 2025 (or Present)"
                        value={work.startDateEndDate}
                        onChange={(e) => updateEmploymentRow(idx, 'startDateEndDate', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Main Duties & Care Responsibilities</label>
                      <textarea
                        rows={2}
                        placeholder="Briefly describe what you did, medication charts managed, or personal care..."
                        value={work.mainDuties}
                        onChange={(e) => updateEmploymentRow(idx, 'mainDuties', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Reason for Leaving</label>
                      <input
                        type="text"
                        placeholder="e.g. Relocated / Career Progression"
                        value={work.reasonForLeaving}
                        onChange={(e) => updateEmploymentRow(idx, 'reasonForLeaving', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Manager / Contact Name</label>
                      <input
                        type="text"
                        placeholder="For regulatory reference checks"
                        value={work.managerContactName}
                        onChange={(e) => updateEmploymentRow(idx, 'managerContactName', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-4xs font-bold text-gray-500 uppercase mb-1">Employer Telephone / Email Contact Details</label>
                      <input
                        type="text"
                        placeholder="e.g. hr@careuknelson.co.uk or 01282 123456"
                        value={work.employerContactDetails}
                        onChange={(e) => updateEmploymentRow(idx, 'employerContactDetails', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Employment Gaps / Additional Information (Write None if N/A)</label>
              <textarea
                rows={3}
                placeholder="Explain any intervals between qualifications or care sector jobs, or other details you wish us to account for..."
                value={data.employmentGaps}
                onChange={(e) => onChange({ ...data, employmentGaps: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: CARE SKILLS, SUMMARY, & TWO DETAILED REFERENCES */}
      {currentStep === 4 && (
        <div className="space-y-8 animate-fade-in">
          {/* Section 9: CARE EXPERIENCE AND SKILLS */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              9. CARE EXPERIENCE AND SKILLS
            </div>
            <p className="text-3xs text-gray-500 italic mt-1.5 mb-4">Please tick any areas where you have active field experience and provide a brief summary of suitability.</p>

            <div className="space-y-3.5">
              {[
                { key: 'personalCare', label: 'Personal care (bathing, dressing, grooming services)' },
                { key: 'medicationSupport', label: 'Medication support / MAR charts management' },
                { key: 'movingHandling', label: 'Moving and handling (hoists, slide sheets, mobility support)' },
                { key: 'dementiaCare', label: 'Dementia care specialisms' },
                { key: 'learningDisabilityAutism', label: 'Learning disability / autism support' },
                { key: 'mentalHealthBehaviours', label: 'Mental health / behaviours that challenge support' },
                { key: 'supportedLivingDomiciliary', label: 'Supported living / domiciliary care environments' },
              ].map((skillCheck) => {
                const sKey = skillCheck.key as keyof typeof data.careSkills;
                return (
                  <div key={skillCheck.key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-gray-50/50 border border-gray-200/50 rounded-2xl text-xs gap-2">
                    <span className="font-bold text-gray-700">{skillCheck.label}</span>
                    <div className="flex gap-4">
                      {['Yes', 'No'].map((opt) => (
                        <label key={opt} className="inline-flex items-center gap-1.5 cursor-pointer font-sans select-none text-xs font-semibold text-gray-650">
                          <input
                            type="radio"
                            name={`skill-${skillCheck.key}`}
                            value={opt}
                            checked={data.careSkills[sKey] === opt}
                            onChange={() => updateCareSkillField(sKey, opt)}
                            className="accent-emerald-600 w-3.5 h-3.5"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <label className="block text-xs font-semibold text-emerald-900 mb-1">
                Please give a short summary of your care/support experience and why you are suitable for this role *
              </label>
              <textarea
                rows={4}
                placeholder="Share any special personal qualities, your patient communication background, why you chose Daffodils Care Services as your desired agency..."
                value={data.careSkills.careSummary}
                onChange={(e) => updateCareSkillField('careSummary', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
              />
            </div>
          </div>

          {/* Section 10: REFERENCES */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              10. REFERENCES (Two Referees Required)
            </div>
            <p className="text-3xs text-gray-500 italic mt-1.5 mb-4">Please provide two referees. One should be your current or most recent care employer where possible.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Referee 1 Details */}
              <div className="p-4 border-2 border-emerald-50 bg-emerald-50/5 rounded-2xl space-y-4">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold rounded-lg font-mono text-2xs tracking-widest uppercase">
                  Referee 1 (Professional/Most Recent)
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Referee Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mrs Jean Carter"
                      value={data.referee1.name}
                      onChange={(e) => updateRefereeField(1, 'name', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Job Title / Relationship to you *</label>
                    <input
                      type="text"
                      placeholder="e.g. Care Manager / Direct Supervisor"
                      value={data.referee1.jobTitleRelationship}
                      onChange={(e) => updateRefereeField(1, 'jobTitleRelationship', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Organisation Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. BlueCare Domiciliary Group"
                      value={data.referee1.organisation}
                      onChange={(e) => updateRefereeField(1, 'organisation', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Office Address</label>
                    <input
                      type="text"
                      placeholder="Company address"
                      value={data.referee1.address}
                      onChange={(e) => updateRefereeField(1, 'address', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Telephone *</label>
                    <input
                      type="tel"
                      placeholder="Office phone contact"
                      value={data.referee1.telephone}
                      onChange={(e) => updateRefereeField(1, 'telephone', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Email Address *</label>
                    <input
                      type="email"
                      placeholder="manager@bluecare.co.uk"
                      value={data.referee1.email}
                      onChange={(e) => updateRefereeField(1, 'email', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden font-semibold text-emerald-805"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-emerald-800 uppercase mb-1">May we contact this referee now?</label>
                    <div className="flex flex-col gap-1 text-2xs space-y-0.5">
                      {[
                        { id: 'Yes', label: 'Yes' },
                        { id: 'No', label: 'No' },
                        { id: 'Only after conditional offer', label: 'Only after conditional offer' },
                      ].map((pref) => (
                        <label key={pref.id} className="inline-flex items-center gap-2 cursor-pointer font-sans select-none text-gray-700">
                          <input
                            type="radio"
                            name="ref1Consent"
                            value={pref.id}
                            checked={data.referee1.mayContact === pref.id}
                            onChange={() => updateRefereeField(1, 'mayContact', pref.id)}
                            className="accent-emerald-600"
                          />
                          {pref.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Referee 2 Details */}
              <div className="p-4 border-2 border-emerald-50 bg-emerald-50/5 rounded-2xl space-y-4">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold rounded-lg font-mono text-2xs tracking-widest uppercase">
                  Referee 2 (Secondary Reference)
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Referee Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr David Sterling"
                      value={data.referee2.name}
                      onChange={(e) => updateRefereeField(2, 'name', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Job Title / Relationship to you *</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead Academic Tutor / Family Friend"
                      value={data.referee2.jobTitleRelationship}
                      onChange={(e) => updateRefereeField(2, 'jobTitleRelationship', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Organisation Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Burnley College / Personal"
                      value={data.referee2.organisation}
                      onChange={(e) => updateRefereeField(2, 'organisation', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Office Address</label>
                    <input
                      type="text"
                      placeholder="Company address"
                      value={data.referee2.address}
                      onChange={(e) => updateRefereeField(2, 'address', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Telephone *</label>
                    <input
                      type="tel"
                      placeholder="Contact phone"
                      value={data.referee2.telephone}
                      onChange={(e) => updateRefereeField(2, 'telephone', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-gray-500 uppercase mb-0.5">Email Address *</label>
                    <input
                      type="email"
                      placeholder="dster@burnleyhigh.ac.uk"
                      value={data.referee2.email}
                      onChange={(e) => updateRefereeField(2, 'email', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden font-semibold text-emerald-805"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-bold text-emerald-800 uppercase mb-1">May we contact this referee now?</label>
                    <div className="flex flex-col gap-1 text-2xs space-y-0.5 font-semibold">
                      {[
                        { id: 'Yes', label: 'Yes' },
                        { id: 'No', label: 'No' },
                        { id: 'Only after conditional offer', label: 'Only after conditional offer' },
                      ].map((pref) => (
                        <label key={pref.id} className="inline-flex items-center gap-2 cursor-pointer font-sans select-none text-gray-700">
                          <input
                            type="radio"
                            name="ref2Consent"
                            value={pref.id}
                            checked={data.referee2.mayContact === pref.id}
                            onChange={() => updateRefereeField(2, 'mayContact', pref.id)}
                            className="accent-emerald-600"
                          />
                          {pref.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* STEP 5: DBS DECLARATIONS, HEALTH, DOCUMENTS ATTACHMENT, SIGNATURE & CONSENT BUTTONS */}
      {currentStep === 5 && (
        <div className="space-y-8 animate-fade-in">
          {/* Section 11: DBS, CRIMINAL CONVICTIONS AND SAFER RECRUITMENT */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              11. DBS, CRIMINAL CONVICTIONS AND SAFER RECRUITMENT
            </div>
            
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Do you have an active current DBS certificate?</label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map((opt) => (
                      <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 font-bold select-none">
                        <input
                          type="radio"
                          name="dbsActive"
                          value={opt}
                          checked={data.dbsSafety.hasDbs === opt}
                          onChange={() => updateDbsField('hasDbs', opt)}
                          className="accent-emerald-600 w-3.5 h-3.5"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>

                  {data.dbsSafety.hasDbs === 'Yes' && (
                    <input
                      type="text"
                      placeholder="DBS Certificate Number (12 digits)"
                      value={data.dbsSafety.dbsNo}
                      onChange={(e) => updateDbsField('dbsNo', e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm font-mono tracking-widest mt-2"
                    />
                  )}
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">Are you registered with the DBS Update Service?</label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map((opt) => (
                      <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none">
                        <input
                          type="radio"
                          name="dbsUpdate"
                          value={opt}
                          checked={data.dbsSafety.registeredUpdateService === opt}
                          onChange={() => updateDbsField('registeredUpdateService', opt)}
                          className="accent-emerald-600 w-3.5 h-3.5"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-50/20 border border-red-200/50 space-y-3">
                <label className="block text-xs font-bold text-red-950">Have you ever been barred from working with vulnerable adults or children?</label>
                <div className="flex gap-4">
                  {['No', 'Yes'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-red-900 select-none font-bold">
                      <input
                        type="radio"
                        name="everBarred"
                        value={opt}
                        checked={data.dbsSafety.everBarred === opt}
                        onChange={() => updateDbsField('everBarred', opt)}
                        className="accent-emerald-600"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {data.dbsSafety.everBarred === 'Yes' && (
                  <textarea
                    rows={2}
                    placeholder="We handle this extremely confidentially. Provide notes or declaration details here..."
                    value={data.dbsSafety.barDetails}
                    onChange={(e) => updateDbsField('barDetails', e.target.value)}
                    className="w-full bg-white border border-red-200 rounded-lg py-2 px-3 text-sm"
                  />
                )}
              </div>

              <div className="p-4 rounded-xl bg-red-50/20 border border-red-200/50 space-y-3">
                <label className="block text-xs font-bold text-red-950">Do you have any convictions, cautions, reprimands or warnings to declare?</label>
                <div className="flex gap-4">
                  {['No', 'Yes'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-red-900 select-none font-bold">
                      <input
                        type="radio"
                        name="declaredConvictions"
                        value={opt}
                        checked={data.dbsSafety.hasConvictions === opt}
                        onChange={() => updateDbsField('hasConvictions', opt)}
                        className="accent-emerald-600"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {data.dbsSafety.hasConvictions === 'Yes' && (
                  <textarea
                    rows={2}
                    placeholder="Provide details privately..."
                    value={data.dbsSafety.convictionDetails}
                    onChange={(e) => updateDbsField('convictionDetails', e.target.value)}
                    className="w-full bg-white border border-red-200 rounded-lg py-2 px-3 text-sm"
                  />
                )}
              </div>

              <div className="p-4 rounded-xl bg-red-50/20 border border-red-200/50 space-y-3">
                <label className="block text-xs font-bold text-red-950">Have you ever been subject to disciplinary action or investigation in care work?</label>
                <div className="flex gap-4">
                  {['No', 'Yes'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-red-900 select-none font-bold">
                      <input
                        type="radio"
                        name="disciplinaryAction"
                        value={opt}
                        checked={data.dbsSafety.subjectToDisciplinary === opt}
                        onChange={() => updateDbsField('subjectToDisciplinary', opt)}
                        className="accent-emerald-600"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {data.dbsSafety.subjectToDisciplinary === 'Yes' && (
                  <textarea
                    rows={2}
                    placeholder="Provide disciplinary context..."
                    value={data.dbsSafety.disciplinaryDetails}
                    onChange={(e) => updateDbsField('disciplinaryDetails', e.target.value)}
                    className="w-full bg-white border border-red-200 rounded-lg py-2 px-3 text-sm"
                  />
                )}
              </div>

              {/* DBS Disclosure Acknowledgement checkbox */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="ackDbs"
                  checked={data.dbsSafety.applicantAcknowledged}
                  onChange={(e) => updateDbsField('applicantAcknowledged', e.target.checked)}
                  className="rounded-sm text-emerald-600 focus:ring-emerald-500 scale-115 mt-1 cursor-pointer shrink-0"
                />
                <label htmlFor="ackDbs" className="text-xs text-emerald-950 font-bold leading-relaxed cursor-pointer select-none">
                  * Applicant Acknowledgement: I understand this role may require an enhanced DBS check and suitability checks before formal employment starts.
                </label>
              </div>
            </div>
          </div>

          {/* Section 12: HEALTH AND REASONABLE ADJUSTMENTS */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              12. HEALTH AND REASONABLE ADJUSTMENTS
            </div>
            
            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Do you require any reasonable adjustments for interview or work?</label>
                <div className="flex gap-4 mb-2">
                  {['No', 'Yes'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none font-bold">
                      <input
                        type="radio"
                        name="healthAdjust"
                        value={opt}
                        checked={data.healthAdjustments.requireAdjustments === opt}
                        onChange={() => updateHealthField('requireAdjustments', opt)}
                        className="accent-emerald-600"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {data.healthAdjustments.requireAdjustments === 'Yes' && (
                  <textarea
                    rows={2}
                    placeholder="We want to accommodate you! Describe adjustments required..."
                    value={data.healthAdjustments.adjustmentDetails}
                    onChange={(e) => updateHealthField('adjustmentDetails', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm"
                  />
                )}
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Any health condition that may affect your ability to safely carry out the role?</label>
                <div className="flex gap-4 mb-2">
                  {['No', 'Yes'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none font-bold">
                      <input
                        type="radio"
                        name="healthCondition"
                        value={opt}
                        checked={data.healthAdjustments.healthConditions === opt}
                        onChange={() => updateHealthField('healthConditions', opt)}
                        className="accent-emerald-600"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {data.healthAdjustments.healthConditions === 'Yes' && (
                  <textarea
                    rows={2}
                    placeholder="Details are treated separately and confidentially. List safety adjustments if needed..."
                    value={data.healthAdjustments.healthDetails}
                    onChange={(e) => updateHealthField('healthDetails', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm"
                  />
                )}
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Any other support needs we should be aware of?</label>
                <div className="flex gap-4 mb-2">
                  {['No', 'Yes'].map((opt) => (
                    <label key={opt} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs text-gray-700 select-none font-bold">
                      <input
                        type="radio"
                        name="otherNeeds"
                        value={opt}
                        checked={data.healthAdjustments.otherSupportNeeds === opt}
                        onChange={() => updateHealthField('otherSupportNeeds', opt)}
                        className="accent-emerald-600"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {data.healthAdjustments.otherSupportNeeds === 'Yes' && (
                  <textarea
                    rows={2}
                    placeholder="Describe any other support requirements..."
                    value={data.healthAdjustments.otherNeedsDetails}
                    onChange={(e) => updateHealthField('otherNeedsDetails', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Section 13: DOCUMENTS CHECKLIST */}
          <div>
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              13. DOCUMENTS CHECKLIST FOR RECRUIT SYSTEM
            </div>
            <p className="text-3xs text-gray-505 italic mt-1.5 mb-4">Please verify that you can provide all of these documents at the point of your face-to-face registration interview:</p>

            <div className="space-y-3 text-xs">
              {[
                { key: 'proofOfIdentity', label: 'Proof of Identity (Passport, biometric ID)' },
                { key: 'rightToWorkEvidence', label: 'Right to Work Evidence' },
                { key: 'proofOfAddress', label: 'Proof of Address (Utility bill or bank letter dated last 3 months)' },
                { key: 'niEvidence', label: 'National Insurance Evidence' },
                { key: 'dbsCertificate', label: 'DBS Certificate / Update Service code' },
                { key: 'trainingCertificates', label: 'Relevant Training / Qualification Certificates' },
                { key: 'bankDetailsChecked', label: 'Valid bank details for safe payroll setup' },
              ].map((rowItem) => {
                const docKey = rowItem.key as keyof typeof data.checklist;
                const isSelected = data.checklist[docKey].received === 'Yes';
                return (
                  <div key={rowItem.key} className="flex flex-col sm:flex-row justify-between p-3.5 bg-gray-50/50 border border-gray-200/50 rounded-2xl gap-2 items-start sm:items-center">
                    <span className="font-bold text-gray-700">{rowItem.label}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = isSelected ? 'No' : 'Yes';
                        updateChecklistField(docKey, 'received', nextVal);
                        updateChecklistField(docKey, 'verifiedBy', nextVal === 'Yes' ? 'Self-Declared' : '');
                        updateChecklistField(docKey, 'date', nextVal === 'Yes' ? new Date().toISOString().slice(0, 10) : '');
                      }}
                      className={`text-2xs font-extrabold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {isSelected ? '✓ I will bring this' : '✗ Pending / Need guidance'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 14: APPLICANT DECLARATION AND CONSENT */}
          <div className="border border-slate-200 bg-slate-50/50 p-5 rounded-3xl space-y-4">
            <div className="bg-slate-900 border-l-4 border-blue-600 pl-3 py-2 pr-3 text-white text-xs font-bold uppercase tracking-wider font-mono rounded-r-md shadow-xs flex items-center gap-1">
              14. APPLICANT DECLARATION AND CONSENT
            </div>
            
            <p className="text-2xs text-gray-700 leading-relaxed text-justify">
              I confirm that the information I have provided in this application form is true and complete to the best of my knowledge. I understand that false or misleading information may result in withdrawal of an offer or termination of employment. I consent to Daffodils Care Services LTD processing my information for recruitment, safer recruitment checks, references, right-to-work checks, DBS checks, payroll and employment administration.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-yellow-200/30">
              
              <div className="space-y-1.5">
                <label className="block text-2xs font-bold text-gray-700 uppercase">Draw electronic signature below *</label>
                <SignatureCanvas
                  value={data.declaration.signature}
                  onChange={(base64) => updateDeclarationField('signature', base64)}
                  placeholder="Draw sign inside this box"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Print Full Name *</label>
                  <input
                    type="text"
                    placeholder="Type name EXACTLY to authorize consent"
                    value={data.declaration.printName}
                    onChange={(e) => {
                      updateDeclarationField('printName', e.target.value);
                      // Auto populate signature date if empty
                      if (!data.declaration.date) {
                        updateDeclarationField('date', new Date().toISOString().slice(0, 10));
                      }
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono text-sm uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-gray-700 uppercase mb-1">Date Signed</label>
                  <input
                    type="date"
                    value={data.declaration.date}
                    onChange={(e) => updateDeclarationField('date', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono text-sm font-bold"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* STEP NAVIGATOR FOOTER ACTIONS */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center select-none">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={`px-5 py-2.5 rounded-xl font-bold font-sans text-xs sm:text-sm shadow-2xs border transition-all cursor-pointer ${
            currentStep === 1
              ? 'opacity-40 text-gray-400 bg-gray-50 border-gray-100 cursor-not-allowed'
              : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-100 hover:border-gray-300 active:scale-95'
          }`}
        >
          ← Previous
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold font-sans text-xs sm:text-sm rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Next Section →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="px-7 py-3 bg-primary hover:bg-primary-dark text-white font-bold font-sans text-xs sm:text-sm rounded-lg shadow-md border border-primary transition-all hover:scale-102 active:scale-95 cursor-pointer"
          >
            ✓ Complete & Preview Form
          </button>
        )}
      </div>

      {/* WEB3FORMS SUBMISSION PROGRESS OVERLAY MODAL */}
      {submitStatus !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center space-y-6">
            
            {submitStatus === 'loading' && (
              <div className="space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 font-sans uppercase tracking-tight">
                  Transmitting Portfolio
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Please wait standard security handshakes... Your care application is being encrypted and dispatched directly to the Daffodils human resource team.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-light text-primary border border-primary-border text-[10px] font-mono font-bold uppercase tracking-wider rounded-full">
                  🔒 Encrypted Transit TLS 1.3
                </div>
              </div>
            )}

            {submitStatus === 'success' && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 text-3xl animate-bounce">
                  ✓
                </div>
                <h3 className="text-lg font-extrabold text-emerald-950 font-sans uppercase tracking-tight">
                  Successfully Transmitted!
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed font-sans mt-2">
                  The recruiter email relays have accepted your application. A complete compiled record is now ready for your portfolio preview and local printing!
                </p>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary text-white text-[10px] font-mono font-bold uppercase rounded-full">
                  Email Delivered
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border-2 border-red-200 text-3xl animate-pulse">
                  ⚠️
                </div>
                <h3 className="text-lg font-extrabold text-red-950 font-sans uppercase tracking-tight font-sans">
                  Transmission Unsuccessful
                </h3>
                <div className="text-xs text-red-800 leading-relaxed font-mono bg-red-50 p-3 rounded-xl border border-red-100 max-h-32 overflow-y-auto">
                  {submitErrorMessage || "Network error. Please try again."}
                </div>
                <p className="text-2xs text-slate-500 leading-relaxed font-sans">
                  Your local candidate draft is 100% safe. You can retry sending or bypass transmission to preview and download the PDF record directly.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSubmitStatus('idle')}
                      className="w-1/2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
                    >
                      Edit Fields
                    </button>
                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="w-1/2 px-3 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition-all"
                    >
                      Retry Sending
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitStatus('idle');
                      onSubmit();
                    }}
                    className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Bypass & Preview/Print
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
