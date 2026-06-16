import React from 'react';

export default function DaffodilHeader() {
  return (
    <div id="daffodil-header" className="border-b border-slate-200 pb-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Daffodils Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
            {/* Elegant SVG Daffodil Flower */}
            <svg
              className="w-10 h-10 text-yellow-500 drop-shadow-sm"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Green foliage stems */}
              <path
                d="M50,85 C50,85 45,70 48,55 C49,50 51,50 52,55 C55,70 50,85 50,85"
                fill="#475569"
              />
              <path
                d="M45,85 C45,85 30,73 40,58 C45,63 45,85 45,85"
                fill="#64748b"
              />
              {/* Yellow petals outer */}
              {/* Petal Top */}
              <path d="M50,45 C45,30 35,25 50,15 C65,25 55,30 50,45 Z" fill="#fbbf24" />
              {/* Petal Bottom */}
              <path d="M50,55 C45,70 35,75 50,85 C65,75 55,70 50,55 Z" fill="#fbbf24" />
              {/* Petal Left */}
              <path d="M45,50 C30,45 25,35 15,50 C25,65 30,55 45,50 Z" fill="#f59e0b" />
              {/* Petal Right */}
              <path d="M55,50 C70,45 75,35 85,50 C75,65 70,55 55,50 Z" fill="#f59e0b" />
              {/* Petal Top-Right */}
              <path d="M53,46 C66,35 73,30 78,48 C72,60 62,53 53,46 Z" fill="#fbbf24" />
              {/* Petal Bottom-Left */}
              <path d="M47,54 C34,65 27,70 22,52 C28,40 38,47 47,54 Z" fill="#fbbf24" />
              {/* Trumpet center */}
              <circle cx="50" cy="50" r="12" fill="#ea580c" className="stroke-2 stroke-yellow-300" />
              <circle cx="50" cy="50" r="7" fill="#f97316" />
              {/* Pistil */}
              <circle cx="50" cy="50" r="2" fill="#fbbf24" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans leading-tight">
              DAFFODILS CARE SERVICES <span className="text-sm font-semibold text-blue-600 block sm:inline">LTD</span>
            </h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-mono mt-0.5">Compassion • Care • Community</p>
          </div>
        </div>

        {/* Address & LTD Details */}
        <div className="text-right text-xs text-slate-500 font-sans sm:border-l sm:border-slate-200 sm:pl-6">
          <p className="font-semibold text-slate-700">37 Gordon Road,</p>
          <p>Nelson, England,</p>
          <p className="font-mono text-slate-800 font-semibold">BB9 7SX</p>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 border-b-2 border-blue-600 inline-block pb-2 uppercase">
          Employee Application Form
        </h2>
        <p className="text-xs font-semibold text-slate-650 mt-2 uppercase tracking-widest">
          For recruitment, safer recruitment checks and payroll setup
        </p>
      </div>

      {/* Privacy / Confidential Notice Banner */}
      <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-sm">
        <div className="flex items-start gap-2.5">
          <span className="inline-flex items-center justify-center bg-blue-600 text-white rounded-md p-1 shrink-0 font-bold w-5 h-5 text-2xs shadow-xs">ℹ</span>
          <p>
            <strong>Confidentiality Notice & Purpose:</strong> Please complete this form clearly using block capitals where possible. Information will be treated confidentially and used only for recruitment, safer recruitment checks, right-to-work checks, DBS checks, references, payroll and employment administration.
          </p>
        </div>
      </div>
    </div>
  );
}
