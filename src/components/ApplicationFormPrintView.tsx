import React, { useRef } from 'react';
import { FullApplicationForm, WeekAvailability } from '../types';

interface ApplicationFormPrintViewProps {
  data: FullApplicationForm;
  onEdit: () => void;
  onReset: () => void;
  onChange: (newData: FullApplicationForm) => void;
}

export default function ApplicationFormPrintView({ data, onEdit, onReset, onChange }: ApplicationFormPrintViewProps) {
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  // Helper to render yes/no check
  const renderCheck = (val: string, target: string) => {
    return val?.toLowerCase() === target?.toLowerCase() ? (
      <span className="inline-flex items-center justify-center font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded text-xs select-none">
        [✓] {target}
      </span>
    ) : (
      <span className="inline-flex items-center justify-center text-gray-400 px-1.5 py-0.5 border border-gray-200 rounded text-xs select-none">
        [ ] {target}
      </span>
    );
  };

  // Helper to render shift checks
  const renderShiftCheck = (shiftId: string, label: string) => {
    const checked = data.driveTravel.preferredShifts.includes(shiftId);
    return checked ? (
      <span className="inline-flex items-center justify-center font-bold px-2 py-0.5 bg-emerald-50 text-emerald-950 border border-emerald-300 rounded text-xs select-none">
        [✓] {label}
      </span>
    ) : (
      <span className="inline-flex items-center justify-center text-gray-400 px-2 py-0.5 border border-gray-100 rounded text-xs select-none">
        [ ] {label}
      </span>
    );
  };

  const updateOfficeUseField = (field: keyof typeof data.officeUse, val: string) => {
    onChange({
      ...data,
      officeUse: {
        ...data.officeUse,
        [field]: val,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Banner Alert to say Form is Submitted */}
      <div className="mb-8 p-6 bg-slate-900 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 print:hidden border border-slate-800">
        <div>
          <span className="inline-block px-3 py-1 bg-slate-800 text-primary border border-primary/25 font-mono text-xs uppercase font-extrabold tracking-widest rounded-full mb-2">
            ✓ Application Fully Compiled
          </span>
          <h2 className="text-2xl font-black tracking-tight">Daffodils CARE SERVICES PORTAL</h2>
          <p className="text-slate-300 text-sm mt-1">
            Excellent! The application has been stored in your draft state. You can print, edit, or reset it.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={onEdit}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            ✏️ Edit Fields
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            🖨️ Print Form / Save PDF
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to discard your draft and start a new application? This deletes all inputs.")) {
                onReset();
              }
            }}
            className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            🗑️ Reset Entire Draft
          </button>
        </div>
      </div>

      {/* The Actual PDF Form Frame */}
      <div
        ref={printAreaRef}
        id="print-document"
        className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-lg text-gray-800 text-sm leading-relaxed print:border-none print:p-0 print:shadow-none"
      >
        {/* Real Daffodils Care Header block inside the document */}
        <div className="border-b-4 border-primary pb-4 mb-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-primary-light rounded-full flex items-center justify-center border border-primary-border shrink-0">
                <svg className="w-10 h-10 text-yellow-500" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50,85 C50,85 45,70 48,55 C49,50 51,50 52,55 C55,70 50,85 50,85" fill="#233D04" />
                  <path d="M45,85 C45,85 30,73 40,58 C45,63 45,85 45,85" fill="#4B6E2C" />
                  <path d="M50,45 C45,30 35,25 50,15 C65,25 55,30 50,45 Z" fill="#fbbf24" />
                  <path d="M50,55 C45,70 35,75 50,85 C65,75 55,70 50,55 Z" fill="#fbbf24" />
                  <path d="M45,50 C30,45 25,35 15,50 C25,65 30,55 45,50 Z" fill="#f59e0b" />
                  <path d="M55,50 C70,45 75,35 85,50 C75,65 70,55 55,50 Z" fill="#f59e0b" />
                  <circle cx="50" cy="50" r="12" fill="#ea580c" />
                  <circle cx="50" cy="50" r="7" fill="#f97316" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  DAFFODILS CARE SERVICES LTD
                </h1>
                <p className="text-2xs text-primary uppercase font-mono tracking-wider">Compassion • Care • Community</p>
              </div>
            </div>
            <div className="text-right text-2xs text-gray-400 font-sans">
              <p className="font-semibold text-gray-700">37 Gordon Road,</p>
              <p>Nelson, England, BB9 7SX</p>
            </div>
          </div>
          <div className="text-center mt-5">
            <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900">EMPLOYEE APPLICATION FORM</h2>
            <p className="text-2xs text-primary font-bold uppercase mt-0.5">For recruitment, safer recruitment checks and payroll setup</p>
          </div>
        </div>

        {/* 1. POSITION APPLIED FOR */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            1. POSITION APPLIED FOR
          </h3>
          <table className="w-full mt-2 border-collapse text-left border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="w-1/3 p-2 bg-gray-50 font-semibold border-r border-gray-300">Position / Role Applied For</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.positionApplied.position || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Preferred Location / Service</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.positionApplied.preferredLocation || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Date Available to Start</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.positionApplied.startDate || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Notice Period</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.positionApplied.noticePeriod || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Employment Type</td>
                <td className="p-2 bg-white flex flex-wrap gap-2 items-center">
                  {renderCheck(data.positionApplied.employmentType, "Full-time")}
                  {renderCheck(data.positionApplied.employmentType, "Part-time")}
                  {renderCheck(data.positionApplied.employmentType, "Bank / Zero Hours")}
                  {renderCheck(data.positionApplied.employmentType, "Nights")}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">How did you hear about this vacancy?</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.positionApplied.trafficSource || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Worked for Daffodils Care before?</td>
                <td className="p-2 bg-white flex gap-4 items-center">
                  {renderCheck(data.positionApplied.workedHereBefore, "Yes")}
                  {renderCheck(data.positionApplied.workedHereBefore, "No")}
                </td>
              </tr>
              {data.positionApplied.workedHereBefore === 'Yes' && (
                <tr className="border-b border-gray-300">
                  <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">If yes, please give details</td>
                  <td className="p-2 font-mono text-gray-900 bg-white">{data.positionApplied.workedHereBeforeDetails || "—"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 2. PERSONAL DETAILS */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            2. PERSONAL DETAILS
          </h3>
          <table className="w-full mt-2 border-collapse text-left border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="w-1/3 p-2 bg-gray-50 font-semibold border-r border-gray-300">Title</td>
                <td className="p-2 bg-white flex flex-wrap gap-2 items-center">
                  {renderCheck(data.personalDetails.title, "Mr")}
                  {renderCheck(data.personalDetails.title, "Mrs")}
                  {renderCheck(data.personalDetails.title, "Miss")}
                  {renderCheck(data.personalDetails.title, "Ms")}
                  {data.personalDetails.title === 'Other' ? (
                    <span className="font-mono text-xs bg-primary-light text-primary px-1.5 py-0.5 border border-primary-border rounded">
                      Other: {data.personalDetails.titleOther}
                    </span>
                  ) : (
                    renderCheck(data.personalDetails.title, "Other")
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Full Name</td>
                <td className="p-2 font-mono text-gray-900 bg-white font-bold">{data.personalDetails.fullName || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Previous / Other Names</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.personalDetails.previousNames || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Date of Birth</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.personalDetails.dob || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">National Insurance Number</td>
                <td className="p-2 font-mono text-gray-900 bg-white tracking-widest">{data.personalDetails.niNumber || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Home Address</td>
                <td className="p-2 font-mono text-gray-900 bg-white whitespace-pre-line leading-relaxed">
                  {data.personalDetails.homeAddress || "—"}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Mobile Number</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.personalDetails.mobileNumber || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Email Address</td>
                <td className="p-2 font-mono text-gray-900 bg-white font-semibold underline text-primary">
                  {data.personalDetails.emailAddress || "—"}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Preferred Contact Method</td>
                <td className="p-2 bg-white flex flex-wrap gap-2 items-center">
                  {renderCheck(data.personalDetails.preferredContact, "Phone")}
                  {renderCheck(data.personalDetails.preferredContact, "Email")}
                  {renderCheck(data.personalDetails.preferredContact, "Text Message")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. NEXT OF KIN DETAILS */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            3. NEXT OF KIN DETAILS
          </h3>
          <table className="w-full mt-2 border-collapse text-left border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="w-1/3 p-2 bg-gray-50 font-semibold border-r border-gray-300">Name of Next of Kin</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.nextOfKin.name || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Relationship to Employee</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.nextOfKin.relationship || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Phone Number</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.nextOfKin.phoneNumber || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Email Address</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.nextOfKin.emailAddress || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. BANK ACCOUNT DETAILS */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            4. BANK ACCOUNT DETAILS
          </h3>
          <p className="text-4xs text-primary italic mt-1 font-mono pr-1 print:block hidden">
            ⚠️ CONFIDENTIAL - FOR PAYROLL SECURE USE ONLY
          </p>
          <table className="w-full mt-2 border-collapse text-left border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="w-1/3 p-2 bg-gray-50 font-semibold border-r border-gray-300">Bank Name</td>
                <td className="p-2 font-mono text-gray-900 bg-white tracking-wide">{data.bankDetails.bankName || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Account Holder Name</td>
                <td className="p-2 font-mono text-gray-900 bg-white tracking-wide uppercase">{data.bankDetails.holderName || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Sort Code</td>
                <td className="p-2 font-mono text-gray-900 bg-white tracking-widest">{data.bankDetails.sortCode || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Account Number</td>
                <td className="p-2 font-mono text-gray-900 bg-white tracking-widest">{data.bankDetails.accountNumber || "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 5. RIGHT TO WORK IN THE UK */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            5. RIGHT TO WORK IN THE UK
          </h3>
          <table className="w-full mt-2 border-collapse text-left border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="w-1/3 p-2 bg-gray-50 font-semibold border-r border-gray-300">Are you legally entitled to work in the UK?</td>
                <td className="p-2 bg-white flex gap-4 items-center font-bold">
                  {renderCheck(data.rightToWork.legallyEntitled, "Yes")}
                  {renderCheck(data.rightToWork.legallyEntitled, "No")}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Right-to-work evidence provided</td>
                <td className="p-2 bg-white flex flex-wrap gap-2 items-center">
                  {renderCheck(data.rightToWork.evidenceProvided, "UK/Irish Passport")}
                  {renderCheck(data.rightToWork.evidenceProvided, "Birth Certificate + NI Evidence")}
                  {renderCheck(data.rightToWork.evidenceProvided, "Share Code (EU Settlement Scheme / Visa)")}
                  {renderCheck(data.rightToWork.evidenceProvided, "Visa / BRP / eVisa")}
                  {renderCheck(data.rightToWork.evidenceProvided, "Other official document")}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Share Code / Visa Reference</td>
                <td className="p-2 font-mono text-gray-900 bg-white tracking-widest">{data.rightToWork.shareCodeRef || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Visa / Permission Expiry Date</td>
                <td className="p-2 font-mono text-gray-900 bg-white">{data.rightToWork.visaExpiry || "—"}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Any restrictions on your right to work?</td>
                <td className="p-2 bg-white flex gap-4 items-center">
                  {renderCheck(data.rightToWork.restrictions, "No")}
                  {renderCheck(data.rightToWork.restrictions, "Yes")}
                  {data.rightToWork.restrictions === 'Yes' && (
                    <span className="font-mono text-xs text-red-700 bg-red-50 px-2 py-0.5 border border-red-200 rounded">
                      Details: {data.rightToWork.restrictionDetails}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Do you require employer sponsorship?</td>
                <td className="p-2 bg-white flex gap-4 items-center">
                  {renderCheck(data.rightToWork.sponsorshipRequired, "No")}
                  {renderCheck(data.rightToWork.sponsorshipRequired, "Yes")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 6. DRIVING, TRAVEL AND AVAILABILITY */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            6. DRIVING, TRAVEL AND AVAILABILITY
          </h3>
          <table className="w-full mt-2 border-collapse text-left border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="w-1/3 p-2 bg-gray-50 font-semibold border-r border-gray-300">Do you hold a valid UK driving licence?</td>
                <td className="p-2 bg-white flex flex-wrap gap-4 items-center">
                  {renderCheck(data.driveTravel.holdLicence, "Yes")}
                  {renderCheck(data.driveTravel.holdLicence, "No")}
                  {data.driveTravel.holdLicence === 'Yes' && (
                    <span className="font-mono text-xs bg-primary-light text-primary px-2 py-0.5 border border-primary-border rounded">
                      Licence No: {data.driveTravel.licenceNo || "—"}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Do you have access to a vehicle for work?</td>
                <td className="p-2 bg-white flex gap-4 items-center">
                  {renderCheck(data.driveTravel.accessToVehicle, "Yes")}
                  {renderCheck(data.driveTravel.accessToVehicle, "No")}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Do you have business use insurance?</td>
                <td className="p-2 bg-white flex flex-wrap gap-3 items-center">
                  {renderCheck(data.driveTravel.businessInsurance, "Yes")}
                  {renderCheck(data.driveTravel.businessInsurance, "No")}
                  {renderCheck(data.driveTravel.businessInsurance, "Will arrange if required")}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Any current driving endorsements?</td>
                <td className="p-2 bg-white flex flex-wrap gap-4 items-center">
                  {renderCheck(data.driveTravel.drivingEndorsements, "No")}
                  {renderCheck(data.driveTravel.drivingEndorsements, "Yes")}
                  {data.driveTravel.drivingEndorsements === 'Yes' && (
                    <span className="font-mono text-xs text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded">
                      Details: {data.driveTravel.endorsementDetails || "—"}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Maximum hours available per week</td>
                <td className="p-2 font-mono text-gray-900 bg-white font-bold">{data.driveTravel.maxHoursPerWeek || "—"} hrs</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Preferred shifts</td>
                <td className="p-2 bg-white flex flex-wrap gap-2.5 items-center">
                  {renderShiftCheck("Days", "Days")}
                  {renderShiftCheck("Evenings", "Evenings")}
                  {renderShiftCheck("Waking Nights", "Waking Nights")}
                  {renderShiftCheck("Sleep ins", "Sleep ins")}
                  {renderShiftCheck("Weekends", "Weekends")}
                  {renderShiftCheck("Bank Holidays", "Bank Holidays")}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Availability schedule sub table */}
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mt-4 mb-2">Availability Matrix To Work</h4>
          <table className="w-full border-collapse border border-gray-300 text-center text-xs">
            <thead>
              <tr className="bg-primary-light text-primary font-semibold border-b border-gray-300">
                <th className="p-2 text-left border-r border-gray-300">Day</th>
                <th className="p-2 border-r border-gray-300">AM Available?</th>
                <th className="p-2 border-r border-gray-300">PM Available?</th>
                <th className="p-2">Night Available?</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(data.availability) as Array<keyof WeekAvailability>).map((day) => (
                <tr key={day} className="border-b border-gray-200 hover:bg-gray-50/50">
                  <td className="p-2 text-left font-semibold border-r border-gray-350">{day}</td>
                  <td className="p-2 border-r border-gray-350 font-mono">
                    {data.availability[day].am ? (
                      <span className="text-primary font-bold bg-primary-light px-2 py-0.5 rounded border border-primary-border">✓ YES</span>
                    ) : (
                      <span className="text-gray-400">✗ NO</span>
                    )}
                  </td>
                  <td className="p-2 border-r border-gray-350 font-mono">
                    {data.availability[day].pm ? (
                      <span className="text-primary font-bold bg-primary-light px-2 py-0.5 rounded border border-primary-border">✓ YES</span>
                    ) : (
                      <span className="text-gray-400">✗ NO</span>
                    )}
                  </td>
                  <td className="p-2 font-mono">
                    {data.availability[day].night ? (
                      <span className="text-primary font-bold bg-primary-light px-2 py-0.5 rounded border border-primary-border">✓ YES</span>
                    ) : (
                      <span className="text-gray-400">✗ NO</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 7. EDUCATION, QUALIFICATIONS AND TRAINING */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            7. EDUCATION, QUALIFICATIONS AND TRAINING
          </h3>
          <table className="w-full mt-2 border-collapse border border-gray-300 text-left text-xs mb-4">
            <thead>
              <tr className="bg-gray-100 text-gray-800 font-semibold border-b border-gray-300">
                <th className="p-2 border-r border-gray-300 w-1/4">School / College / Training Provider</th>
                <th className="p-2 border-r border-gray-300 w-1/4">Qualification / Course</th>
                <th className="p-2 border-r border-gray-300 w-1/4">Grade / Level</th>
                <th className="p-2 w-1/4">Date Completed</th>
              </tr>
            </thead>
            <tbody>
              {data.education.length === 0 || (data.education.length === 1 && !data.education[0].school) ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-400 italic">No formal education entries specified.</td>
                </tr>
              ) : (
                data.education.map((edu) => (
                  <tr key={edu.id} className="border-b border-gray-200">
                    <td className="p-2 border-r border-gray-300 font-mono text-gray-900">{edu.school || "—"}</td>
                    <td className="p-2 border-r border-gray-300 font-mono text-gray-900">{edu.qualification || "—"}</td>
                    <td className="p-2 border-r border-gray-300 font-mono text-gray-900">{edu.grade || "—"}</td>
                    <td className="p-2 font-mono text-gray-900">{edu.dateCompleted || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Care Certificates details */}
          <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">Relevant Care Training / Certificates Held</h4>
          <table className="w-full border-collapse border border-gray-300 text-left text-xs">
            <thead>
              <tr className="bg-emerald-50 text-emerald-950 font-semibold border-b border-gray-300">
                <th className="p-2 border-r border-gray-300 w-1/3">Training Area</th>
                <th className="p-2 border-r border-gray-300 w-1/6 text-center">Completed?</th>
                <th className="p-2 border-r border-gray-300 w-1/3">Provider / Certificate No.</th>
                <th className="p-2 w-1/6">Expiry / Renewal Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Care Certificate / Induction', entry: data.relevantTraining.careCertificateInduction },
                { name: 'Safeguarding Adults', entry: data.relevantTraining.safeguardingAdults },
                { name: 'Moving & Handling', entry: data.relevantTraining.movingHandling },
                { name: 'Medication Administration', entry: data.relevantTraining.medicationAdministration },
                { name: 'Mental Health / PBS', entry: data.relevantTraining.mentalHealthPBS },
                { name: 'Other Specialist Training', entry: data.relevantTraining.otherSpecialist },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="p-2 border-r border-gray-300 font-semibold text-gray-700 bg-gray-50">{row.name}</td>
                  <td className="p-2 border-r border-gray-300 text-center font-bold">
                    {row.entry.completed === 'Yes' ? (
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">YES</span>
                    ) : row.entry.completed === 'No' ? (
                      <span className="text-gray-400">NO</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="p-2 border-r border-gray-300 font-mono text-gray-900">{row.entry.provider || "—"}</td>
                  <td className="p-2 font-mono text-gray-900">{row.entry.expiryDate || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 8. EMPLOYMENT HISTORY */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            8. EMPLOYMENT HISTORY
          </h3>
          <p className="text-2xs text-gray-500 italic mt-1.5 mb-2">My employment history, starting with my current or most recent employer.</p>

          {data.employmentHistory.map((work, idx) => (
            <div key={work.id} className="mb-5 p-3 border border-gray-200 bg-gray-50/50 rounded-xl">
              <span className="inline-block px-2.5 py-0.5 bg-primary-light text-primary border border-primary-border font-bold rounded-lg text-2xs mb-2 uppercase">
                Employer {idx + 1} {idx === 0 ? "(Current / Recent)" : ""}
              </span>
              <table className="w-full border-collapse border border-gray-300 text-left bg-white text-xs">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="w-1/3 p-2 bg-gray-50 font-semibold border-r border-gray-200">Employer Name & Address</td>
                    <td className="p-2 font-mono text-gray-900 whitespace-pre-line">{work.employerNameAddress || "—"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 bg-gray-50 font-semibold border-r border-gray-200">Job Title</td>
                    <td className="p-2 font-mono text-gray-900 font-bold">{work.jobTitle || "—"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 bg-gray-50 font-semibold border-r border-gray-200">Start Date - End Date</td>
                    <td className="p-2 font-mono text-gray-900 font-semibold">{work.startDateEndDate || "—"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 bg-gray-50 font-semibold border-r border-gray-200">Main Duties</td>
                    <td className="p-2 font-mono text-gray-900 whitespace-pre-line">{work.mainDuties || "—"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 bg-gray-50 font-semibold border-r border-gray-200">Reason for Leaving</td>
                    <td className="p-2 font-mono text-gray-900">{work.reasonForLeaving || "—"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 bg-gray-50 font-semibold border-r border-gray-200">Manager / Contact Name</td>
                    <td className="p-2 font-mono text-gray-900">{work.managerContactName || "—"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 bg-gray-50 font-semibold border-r border-gray-200">Employer Telephone / Email</td>
                    <td className="p-2 font-mono text-gray-900 font-semibold text-primary">{work.employerContactDetails || "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}

          {data.employmentGaps && (
            <div className="p-3 border border-dashed border-gray-300 rounded-xl bg-white mt-2">
              <span className="block text-2xs font-bold text-gray-700 uppercase tracking-widest mb-1">Employment Gaps / Additional Information:</span>
              <p className="text-xs font-mono text-gray-900 whitespace-pre-line bg-gray-50 p-2 rounded-lg border border-gray-100">{data.employmentGaps}</p>
            </div>
          )}
        </div>

        {/* 9. CARE EXPERIENCE AND SKILLS */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            9. CARE EXPERIENCE AND SKILLS
          </h3>
          <table className="w-full mt-2 border-collapse border border-gray-305 text-left text-xs mb-3">
            <tbody>
              {[
                { name: 'Personal Care', val: data.careSkills.personalCare },
                { name: 'Medication Support / MAR charts', val: data.careSkills.medicationSupport },
                { name: 'Moving and Handling', val: data.careSkills.movingHandling },
                { name: 'Dementia Care', val: data.careSkills.dementiaCare },
                { name: 'Learning disability / autism support', val: data.careSkills.learningDisabilityAutism },
                { name: 'Mental Health / behaviours that challenge', val: data.careSkills.mentalHealthBehaviours },
                { name: 'Supported Living / domiciliary care', val: data.careSkills.supportedLivingDomiciliary },
              ].map((skill, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50/30">
                  <td className="p-2 font-semibold text-gray-700 w-2/3">{skill.name}</td>
                  <td className="p-2 flex gap-4 items-center">
                    {renderCheck(skill.val, "Yes")}
                    {renderCheck(skill.val, "No")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.careSkills.careSummary && (
            <div className="p-3 bg-amber-50/50 border border-amber-250 rounded-xl text-xs">
              <span className="block font-bold text-amber-900 uppercase mb-1 tracking-wide">Care and Support Suitability Summary:</span>
              <p className="font-mono text-gray-900 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-lg border border-amber-100">
                {data.careSkills.careSummary}
              </p>
            </div>
          )}
        </div>

        {/* 10. REFERENCES */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            10. REFERENCES
          </h3>
          <p className="text-4xs text-primary font-mono tracking-wide uppercase mt-1 mb-2">Two professional referees provided. Current employer where possible.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Referee 1 */}
            <div className="p-3 border border-gray-250 bg-white rounded-xl">
              <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-3xs uppercase tracking-wide mb-2">
                Referee 1
              </span>
              <table className="w-full text-2xs border-collapse">
                <tbody>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-500 w-1/3">Name</td><td className="py-1 px-1 font-mono font-bold text-gray-900">{data.referee1.name || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-500">Job Title / Relation</td><td className="py-1 px-1 font-mono text-gray-900">{data.referee1.jobTitleRelationship || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-500">Organisation</td><td className="py-1 px-1 font-mono text-gray-900">{data.referee1.organisation || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-500">Address</td><td className="py-1 px-1 font-mono text-gray-905">{data.referee1.address || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-500">Telephone</td><td className="py-1 px-1 font-mono text-gray-900">{data.referee1.telephone || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-500">Email</td><td className="py-1 px-1 font-mono text-primary font-medium underline">{data.referee1.email || "—"}</td></tr>
                  <tr>
                    <td className="py-1 px-1 font-semibold text-gray-500">May contact?</td>
                    <td className="py-1 px-1 flex flex-wrap gap-1">
                      {renderCheck(data.referee1.mayContact, "Yes")}
                      {renderCheck(data.referee1.mayContact, "No")}
                      {renderCheck(data.referee1.mayContact, "Only after conditional offer")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Referee 2 */}
            <div className="p-3 border border-gray-250 bg-white rounded-xl">
              <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-3xs uppercase tracking-wide mb-2">
                Referee 2
              </span>
              <table className="w-full text-2xs border-collapse">
                <tbody>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-500 w-1/3">Name</td><td className="py-1 px-1 font-mono font-bold text-gray-900">{data.referee2.name || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-500">Job Title / Relation</td><td className="py-1 px-1 font-mono text-gray-900">{data.referee2.jobTitleRelationship || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-500">Organisation</td><td className="py-1 px-1 font-mono text-gray-900">{data.referee2.organisation || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-505">Address</td><td className="py-1 px-1 font-mono text-gray-905">{data.referee2.address || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-505">Telephone</td><td className="py-1 px-1 font-mono text-gray-900">{data.referee2.telephone || "—"}</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-1 px-1 font-semibold text-gray-505">Email</td><td className="py-1 px-1 font-mono text-primary font-medium underline">{data.referee2.email || "—"}</td></tr>
                  <tr>
                    <td className="py-1 px-1 font-semibold text-gray-505">May contact?</td>
                    <td className="py-1 px-1 flex flex-wrap gap-1">
                      {renderCheck(data.referee2.mayContact, "Yes")}
                      {renderCheck(data.referee2.mayContact, "No")}
                      {renderCheck(data.referee2.mayContact, "Only after conditional offer")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 11. DBS, CRIMINAL CONVICTIONS AND SAFER RECRUITMENT */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            11. DBS, CRIMINAL CONVICTIONS AND SAFER RECRUITMENT
          </h3>
          <table className="w-full mt-2 border-collapse border border-gray-300 text-left text-xs bg-white">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="w-5/12 p-2 bg-gray-50 font-semibold border-r border-gray-300">Do you have a current DBS certificate?</td>
                <td className="p-2 font-mono flex items-center justify-between gap-2">
                  <div className="flex gap-4 items-center">
                    {renderCheck(data.dbsSafety.hasDbs, "Yes")}
                    {renderCheck(data.dbsSafety.hasDbs, "No")}
                  </div>
                  {data.dbsSafety.hasDbs === 'Yes' && (
                    <span className="font-sans text-2xs bg-primary-light text-primary border border-primary-border px-2 py-0.5 rounded">
                      No: <strong className="font-mono">{data.dbsSafety.dbsNo || "—"}</strong>
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Registered with DBS Update Service?</td>
                <td className="p-2 bg-white flex gap-4 items-center">
                  {renderCheck(data.dbsSafety.registeredUpdateService, "Yes")}
                  {renderCheck(data.dbsSafety.registeredUpdateService, "No")}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Barred from working with vulnerable adults/children?</td>
                <td className="p-2 bg-white flex gap-4 items-center">
                  {renderCheck(data.dbsSafety.everBarred, "No")}
                  {renderCheck(data.dbsSafety.everBarred, "Yes")}
                  {data.dbsSafety.everBarred === 'Yes' && (
                    <span className="font-mono text-2xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded max-w-xs truncate">
                      Details sent separately: {data.dbsSafety.barDetails || "—"}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Any convictions, cautions or warnings declare?</td>
                <td className="p-2 bg-white flex gap-4 items-center">
                  {renderCheck(data.dbsSafety.hasConvictions, "No")}
                  {renderCheck(data.dbsSafety.hasConvictions, "Yes")}
                  {data.dbsSafety.hasConvictions === 'Yes' && (
                    <span className="font-mono text-2xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded max-w-xs truncate">
                      Details sent separately: {data.dbsSafety.convictionDetails || "—"}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Subject to disciplinary action in care work?</td>
                <td className="p-2 bg-white flex gap-4 items-center">
                  {renderCheck(data.dbsSafety.subjectToDisciplinary, "No")}
                  {renderCheck(data.dbsSafety.subjectToDisciplinary, "Yes")}
                  {data.dbsSafety.subjectToDisciplinary === 'Yes' && (
                    <span className="font-mono text-2xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded max-w-xs truncate">
                      Details: {data.dbsSafety.disciplinaryDetails || "—"}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Applicant Acknowledgement</td>
                <td className="p-2 font-mono text-primary bg-primary-light font-bold">
                  {data.dbsSafety.applicantAcknowledged ? (
                    <span>[✓] Fully understood that enhanced DBS is required</span>
                  ) : (
                    <span className="text-red-640">⚠️ Not acknowledged!</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 12. HEALTH AND REASONABLE ADJUSTMENTS */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            12. HEALTH AND REASONABLE ADJUSTMENTS
          </h3>
          <table className="w-full mt-2 border-collapse border border-gray-300 text-left text-xs bg-white">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="w-5/12 p-2 bg-gray-50 font-semibold border-r border-gray-300">Do you require any reasonable adjustments for interview/work?</td>
                <td className="p-2 bg-white flex flex-wrap gap-4 items-center">
                  {renderCheck(data.healthAdjustments.requireAdjustments, "No")}
                  {renderCheck(data.healthAdjustments.requireAdjustments, "Yes")}
                  {data.healthAdjustments.requireAdjustments === 'Yes' && (
                    <span className="font-mono text-2xs text-gray-800 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                      Details: {data.healthAdjustments.adjustmentDetails || "—"}
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Any health condition affecting work safety?</td>
                <td className="p-2 bg-white flex flex-wrap gap-4 items-center">
                  {renderCheck(data.healthAdjustments.healthConditions, "No")}
                  {renderCheck(data.healthAdjustments.healthConditions, "Yes")}
                  {data.healthAdjustments.healthConditions === 'Yes' && (
                    <span className="font-mono text-2xs text-gray-800 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                      Details: {data.healthAdjustments.healthDetails || "—"}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 bg-gray-50 font-semibold border-r border-gray-300">Any other support needs we should be aware of?</td>
                <td className="p-2 bg-white flex flex-wrap gap-4 items-center">
                  {renderCheck(data.healthAdjustments.otherSupportNeeds, "No")}
                  {renderCheck(data.healthAdjustments.otherSupportNeeds, "Yes")}
                  {data.healthAdjustments.otherSupportNeeds === 'Yes' && (
                    <span className="font-mono text-2xs text-gray-800 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                      Details: {data.healthAdjustments.otherNeedsDetails || "—"}
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 13. DOCUMENTS CHECKLIST (Admin verified checkboxes) */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            13. DOCUMENTS CHECKLIST
          </h3>
          <p className="text-4xs text-primary italic mt-1.5 mb-1 tracking-wider uppercase font-mono">For verification check purposes. Verified by office recruiters.</p>
          <table className="w-full border-collapse border border-gray-300 text-left text-xs">
            <thead>
              <tr className="bg-gray-100 text-gray-800 font-semibold border-b border-gray-300">
                <th className="p-2 border-r border-gray-300 w-2/5">Document Required</th>
                <th className="p-2 border-r border-gray-300 text-center w-1/5">Verified Received?</th>
                <th className="p-2 border-r border-gray-300 w-1/5">Verified By</th>
                <th className="p-2 w-1/5">Verification Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Proof of Identity (Passport, IDCard)', key: 'proofOfIdentity' as const },
                { label: 'Right to Work Evidence', key: 'rightToWorkEvidence' as const },
                { label: 'Proof of Address (Utility bill, bank letter)', key: 'proofOfAddress' as const },
                { label: 'National Insurance Evidence', key: 'niEvidence' as const },
                { label: 'DBS Certificate / Update Service check', key: 'dbsCertificate' as const },
                { label: 'Training / Qualification Certificates', key: 'trainingCertificates' as const },
                { label: 'Bank Details Checked for payroll setup', key: 'bankDetailsChecked' as const },
              ].map((row, i) => {
                const item = data.checklist[row.key];
                return (
                  <tr key={i} className="border-b border-gray-205 hover:bg-gray-50/20">
                    <td className="p-2 border-r border-gray-300 font-medium text-gray-700 bg-gray-50">{row.label}</td>
                    <td className="p-2 border-r border-gray-300 text-center font-bold">
                      {item.received === 'Yes' ? (
                        <span className="text-primary bg-primary-light px-2 py-0.5 rounded border border-primary-border">✓ RECEIVED</span>
                      ) : item.received === 'No' ? (
                        <span className="text-red-500">✗ ABSENT</span>
                      ) : (
                        <span className="text-gray-350">— Pending —</span>
                      )}
                    </td>
                    <td className="p-2 border-r border-gray-300 font-mono text-gray-900">{item.verifiedBy || "—"}</td>
                    <td className="p-2 font-mono text-gray-900">{item.date || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 14. APPLICANT DECLARATION AND CONSENT */}
        <div className="mb-6 break-inside-avoid border border-slate-200 bg-slate-50/50 p-4 rounded-2xl page-break-after">
          <h3 className="text-xs font-bold uppercase py-1.5 px-2.5 bg-slate-900 border-l-4 border-primary text-white font-mono rounded-r shadow-xs">
            14. APPLICANT DECLARATION AND CONSENT
          </h3>
          <p className="text-2xs text-gray-700 leading-relaxed mt-2 text-justify">
            I confirm that the information I have provided in this application form is true and complete to the best of my knowledge. I understand that false or misleading information may result in withdrawal of an offer or termination of employment. I consent to Daffodils Care Services LTD processing my information for recruitment, safer recruitment checks, references, right-to-work checks, DBS checks, payroll and employment administration.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-3 border-t border-yellow-200/50">
            <div>
              <span className="block text-4xs font-bold text-gray-500 uppercase font-mono mb-1">Applicant Signature:</span>
              <div className="border border-gray-300 bg-white rounded-lg h-16 flex items-center justify-center p-1.5 shadow-inner">
                {data.declaration.signature ? (
                  <img
                    src={data.declaration.signature}
                    className="max-h-full max-w-full object-contain"
                    alt="Applicant base64 signature"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs text-red-500 italic font-semibold">⚠️ No electronic signature drawn!</span>
                )}
              </div>
            </div>

            <div>
              <span className="block text-4xs font-bold text-gray-500 uppercase font-mono mb-1">Date Signed:</span>
              <div className="border-b-2 border-gray-350 py-1 px-2 font-mono text-gray-900 font-bold">
                {data.declaration.date || "—"}
              </div>
            </div>

            <div>
              <span className="block text-4xs font-bold text-gray-500 uppercase font-mono mb-1">Print Full Name:</span>
              <div className="border-b-2 border-gray-350 py-1 px-2 font-mono text-gray-900 font-bold uppercase">
                {data.declaration.printName || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* 15. OFFICE USE ONLY */}
        <div className="mb-4 break-inside-avoid bg-primary-light border-2 border-primary-border p-5 rounded-2xl">
          <div className="flex items-center justify-between border-b pb-2 mb-3 border-primary-border">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest font-mono">
              15. OFFICE USE ONLY (Verification Panel)
            </h3>
            <span className="px-2 py-0.5 bg-primary text-white font-black rounded-lg text-4xs uppercase tracking-widest font-mono select-none">
              🔒 Recruiter Admin Area
            </span>
          </div>
          
          <p className="text-3xs text-primary leading-normal mt-1 mb-4 print:hidden">
            💡 <strong>Interactive Recruiter Controls:</strong> Daffodils admin officers can check suitability directly on this simulated screen layout. The changes are saved immediately in the master data state!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div>
                <label className="block text-4xs font-bold text-primary uppercase mb-1">Application Received Date</label>
                <input
                  type="date"
                  value={data.officeUse.receivedDate}
                  onChange={(e) => updateOfficeUseField('receivedDate', e.target.value)}
                  className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-primary uppercase mb-1">Is Shortlisted?</label>
                <select
                  value={data.officeUse.shortlisted}
                  onChange={(e) => updateOfficeUseField('shortlisted', e.target.value)}
                  className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                >
                  <option value="">— Select —</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-4xs font-bold text-primary uppercase mb-1">Interview Date & Time</label>
                <input
                  type="text"
                  placeholder="e.g. 18th June 2026 at 2:00 PM"
                  value={data.officeUse.interviewDateTime}
                  onChange={(e) => updateOfficeUseField('interviewDateTime', e.target.value)}
                  className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-primary uppercase mb-1">Interviewed By</label>
                <input
                  type="text"
                  placeholder="Recruitment Manager name"
                  value={data.officeUse.interviewedBy}
                  onChange={(e) => updateOfficeUseField('interviewedBy', e.target.value)}
                  className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-4xs font-bold text-primary uppercase mb-1">Final Outcome</label>
                <select
                  value={data.officeUse.outcome}
                  onChange={(e) => updateOfficeUseField('outcome', e.target.value)}
                  className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden font-bold"
                >
                  <option value="">— Choose Outcome —</option>
                  <option value="Offer">[Offer] Approved for Hire</option>
                  <option value="Reserve">[Reserve] Put on Waitlist</option>
                  <option value="Unsuccessful">[Unsuccessful] Declined</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-4xs font-bold text-primary uppercase mb-1">Conditional Offer Sent?</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={data.officeUse.conditionalOfferSent}
                    onChange={(e) => updateOfficeUseField('conditionalOfferSent', e.target.value)}
                    className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1 px-1.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="">— Sent? —</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <input
                    type="date"
                    value={data.officeUse.conditionalOfferDate}
                    onChange={(e) => updateOfficeUseField('conditionalOfferDate', e.target.value)}
                    className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1 px-1.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-4xs font-bold text-primary uppercase mb-1">References Status</label>
                <select
                  value={data.officeUse.referencesStatus}
                  onChange={(e) => updateOfficeUseField('referencesStatus', e.target.value)}
                  className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                >
                  <option value="">— Choose Status —</option>
                  <option value="Requested">Requested</option>
                  <option value="Received">Received</option>
                  <option value="Satisfactory">Satisfactory Approved</option>
                </select>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-4xs font-bold text-primary uppercase mb-1">RTW Completed</label>
                    <select
                      value={data.officeUse.rtwCompleted}
                      onChange={(e) => updateOfficeUseField('rtwCompleted', e.target.value)}
                      className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-1.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                    >
                      <option value="">— RTW —</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-4xs font-bold text-primary uppercase mb-1">DBS Checked</label>
                    <select
                      value={data.officeUse.dbsChecked}
                      onChange={(e) => updateOfficeUseField('dbsChecked', e.target.value)}
                      className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-1.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                    >
                      <option value="">— DBS —</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-4xs font-bold text-primary uppercase mb-1">Induction Booked/Completed</label>
                <select
                  value={data.officeUse.inductionBookedCompleted}
                  onChange={(e) => updateOfficeUseField('inductionBookedCompleted', e.target.value)}
                  className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                >
                  <option value="">— Select Status —</option>
                  <option value="Booked">Booked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-4xs font-bold text-primary uppercase mb-1">Start Date Agreed</label>
                <input
                  type="date"
                  value={data.officeUse.startDateAgreed}
                  onChange={(e) => updateOfficeUseField('startDateAgreed', e.target.value)}
                  className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-4xs font-bold text-primary uppercase mb-1">Recruitment Decision Notes</label>
            <textarea
              rows={2}
              placeholder="Add recruiter feedback details, reference rating details, or check timestamps here..."
              value={data.officeUse.decisionNotes}
              onChange={(e) => updateOfficeUseField('decisionNotes', e.target.value)}
              className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
            />
          </div>

          {/* Manager signature block */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-3 border-t border-primary-border/50">
            <div>
              <label className="block text-4xs font-bold text-primary uppercase mb-1">Recruiting Manager Signature</label>
              <input
                type="text"
                placeholder="✍️ Type name to sign digitally"
                value={data.officeUse.recruitingManagerSignature}
                onChange={(e) => updateOfficeUseField('recruitingManagerSignature', e.target.value)}
                className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden italic"
              />
            </div>
            <div>
              <label className="block text-4xs font-bold text-primary uppercase mb-1">Signature Date</label>
              <input
                type="date"
                value={data.officeUse.recruitingManagerDate}
                onChange={(e) => updateOfficeUseField('recruitingManagerDate', e.target.value)}
                className="w-full bg-white border border-primary-border hover:border-primary/60 rounded-lg py-1.5 px-2.5 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer print stamp */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-3xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-1.5 font-mono">
          <span>Daffodils Care Services LTD | Employee Application Form | Confidential</span>
          <span>Generated via Digitized HR Workflow Portal</span>
        </div>
      </div>
    </div>
  );
}
