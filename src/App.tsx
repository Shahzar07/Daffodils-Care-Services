import React, { useState, useEffect } from 'react';
import { FullApplicationForm } from './types';
import { INITIAL_FORM_STATE, SAMPLE_FORM_DATA } from './data';
import FormWizard from './components/FormWizard';
import ApplicationFormPrintView from './components/ApplicationFormPrintView';

export default function App() {
  const [formData, setFormData] = useState<FullApplicationForm>(INITIAL_FORM_STATE);
  const [viewMode, setViewMode] = useState<'wizard' | 'compiled'>('wizard');
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('daffodils_application_draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (err) {
        console.error("Error reading saved draft", err);
      }
    }
  }, []);

  // Save draft state to localStorage on modification
  const handleFormChange = (newData: FullApplicationForm) => {
    setFormData(newData);
    localStorage.setItem('daffodils_application_draft', JSON.stringify(newData));
    
    // Briefly flash a "Draft Saved Locally" status beacon
    setIsSavedAlert(true);
  };

  useEffect(() => {
    if (isSavedAlert) {
      const timer = setTimeout(() => setIsSavedAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSavedAlert]);

  // Clean form clear action
  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    localStorage.removeItem('daffodils_application_draft');
    setViewMode('wizard');
    window.scrollTo(0, 0);
  };

  // Instantly populate demonstration portfolio data for ease of evaluation
  const handleLoadDemo = () => {
    handleFormChange(SAMPLE_FORM_DATA);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-primary/10 selection:text-primary py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {isSavedAlert && (
          <div className="fixed top-4 right-4 z-50 bg-primary text-white text-xs px-4 py-2.5 rounded-lg shadow-lg font-medium animate-pulse">
            ✓ Input Auto-Saved
          </div>
        )}

        {/* Wizard view vs Compiled Printable view */}
        {viewMode === 'wizard' ? (
          <FormWizard
            data={formData}
            onChange={handleFormChange}
            onLoadDemo={handleLoadDemo}
            onSubmit={() => {
              setViewMode('compiled');
              window.scrollTo(0, 0);
            }}
          />
        ) : (
          <div className="animate-fade-in">
            <ApplicationFormPrintView
              data={formData}
              onEdit={() => setViewMode('wizard')}
              onReset={handleReset}
              onChange={handleFormChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
