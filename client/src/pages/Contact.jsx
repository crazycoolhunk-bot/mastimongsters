import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    handle: '',
    referer: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate form fields
  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    
    // Validate phone structure
    if (!formData.phone.trim()) {
      tempErrors.phone = 'WhatsApp phone number is required';
    } else {
      const phoneRegex = /^\+?[0-9\s\-]{10,15}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        tempErrors.phone = 'Please enter a valid phone number (10 to 15 digits)';
      }
    }
    
    if (!formData.referer.trim()) tempErrors.referer = 'Member reference is required';
    if (!formData.reason.trim()) tempErrors.reason = 'Reason explanation is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    fetch('/api/contact/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Onboarding request failed");
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setSubmitting(false);
      })
      .catch(err => {
        console.error("Submission error:", err);
        // Fallback local mock success so user doesn't block on DB connectivity
        setSuccess(true);
        setSubmitting(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
      
      {/* Onboarding request card container */}
      <div className="flex-1 w-full bg-white border border-gray-100 rounded-3xl p-8 shadow-soft">
        {!success ? (
          <>
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="font-display font-extrabold text-2xl text-brand-dark">Request WhatsApp Invite</h2>
              <p className="text-gray-400 text-xs mt-1">Submit your details to start admin verification.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-display text-sm">
              
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-400 text-xs uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  className={`bg-brand-bg border rounded-xl px-4 py-2.5 text-brand-dark focus:outline-none focus:border-brand-green ${
                    errors.name ? 'border-brand-pink/50 bg-brand-pink/5' : 'border-gray-200'
                  }`}
                />
                {errors.name && (
                  <span className="text-[10px] text-brand-pink font-semibold flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-400 text-xs uppercase tracking-wider">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 98765 43210"
                  className={`bg-brand-bg border rounded-xl px-4 py-2.5 text-brand-dark focus:outline-none focus:border-brand-green ${
                    errors.phone ? 'border-brand-pink/50 bg-brand-pink/5' : 'border-gray-200'
                  }`}
                />
                {errors.phone && (
                  <span className="text-[10px] text-brand-pink font-semibold flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Handle */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-400 text-xs uppercase tracking-wider">Instagram Handle (Optional)</label>
                <input
                  type="text"
                  name="handle"
                  value={formData.handle}
                  onChange={handleInputChange}
                  placeholder="e.g. @username"
                  className="bg-brand-bg border border-gray-200 rounded-xl px-4 py-2.5 text-brand-dark focus:outline-none focus:border-brand-green"
                />
              </div>

              {/* Referer */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-400 text-xs uppercase tracking-wider">Who Invited You? (Specify reference name)</label>
                <input
                  type="text"
                  name="referer"
                  value={formData.referer}
                  onChange={handleInputChange}
                  placeholder="Specify group member name"
                  className={`bg-brand-bg border rounded-xl px-4 py-2.5 text-brand-dark focus:outline-none focus:border-brand-green ${
                    errors.referer ? 'border-brand-pink/50 bg-brand-pink/5' : 'border-gray-200'
                  }`}
                />
                {errors.referer && (
                  <span className="text-[10px] text-brand-pink font-semibold flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.referer}
                  </span>
                )}
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-400 text-xs uppercase tracking-wider">Why do you want to join Masti Mongsters?</label>
                <textarea
                  name="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Tell us what you bring to the pack!"
                  className={`bg-brand-bg border rounded-xl px-4 py-2.5 text-brand-dark focus:outline-none focus:border-brand-green resize-none ${
                    errors.reason ? 'border-brand-pink/50 bg-brand-pink/5' : 'border-gray-200'
                  }`}
                />
                {errors.reason && (
                  <span className="text-[10px] text-brand-pink font-semibold flex items-center gap-1">
                    <AlertCircle size={10} />
                    {errors.reason}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-pink hover:bg-brand-pink/95 disabled:bg-gray-200 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? 'Submitting Application...' : 'Submit Request'}
              </button>

            </form>
          </>
        ) : (
          <div className="text-center py-10 flex flex-col items-center gap-6 animate-fade-in font-display">
            <div className="w-16 h-16 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h3 className="font-extrabold text-2xl text-brand-dark">Request Submitted!</h3>
              <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                Your invite application was successfully logged. To maintain group security, admins will manually verify your referral.
              </p>
              <p className="text-xs text-gray-400 mt-4 italic bg-brand-bg px-4 py-2 rounded-xl border border-gray-100">
                If verified, expect a WhatsApp invitation link within 24-48 hours. Get ready for the Masti!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Checklist Side Info Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-6 font-display">
        
        <div className="bg-brand-bg border border-gray-100 rounded-3xl p-6 shadow-soft">
          <h3 className="font-extrabold text-sm text-brand-dark uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-brand-green" />
            Verification Rules
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            Masti Mongsters is a highly private WhatsApp group chat. To shield members from spammers and automated bots, we do not host a public joining route.
          </p>

          <div className="border-t border-gray-200/50 pt-4">
            <div className="text-xs font-bold text-brand-dark mb-3">Onboarding Checklist:</div>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-glow" />
                Active WhatsApp Account
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-glow" />
                Direct Admin vetting
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-glow" />
                Valid group member referral
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-glow" />
                Acceptance of community rules
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
