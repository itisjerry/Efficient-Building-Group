import React, { useEffect, useState, useRef } from "react";

// ==================== CONSTRUCTION-THEMED COMPONENTS ====================

function HeroContactModal({ open, onClose, initialService }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [budget, setBudget] = useState("50000");
  const [timeline, setTimeline] = useState("3-6 months");
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });
  const ref = useRef(null);

  const steps = [
    { number: 1, title: 'Project Details', icon: '📐' },
    { number: 2, title: 'Contact Info', icon: '📋' },
    { number: 3, title: 'Review & Submit', icon: '✅' }
  ];

  useEffect(() => {
    if (open) {
      setTimeout(() => ref.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleFile(e) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    }
    setFile(selectedFile || null);
  }

  const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const validatePhone = (phone) => /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\D/g, ''));
  
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6,10)}`;
  };

  async function submit(e) {
    e.preventDefault();
    
    if (!name.trim()) {
      setTouched(prev => ({ ...prev, name: true }));
      alert("Please enter your name.");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setTouched(prev => ({ ...prev, email: true }));
      alert("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || !validatePhone(phone)) {
      setTouched(prev => ({ ...prev, phone: true }));
      alert("Please enter a valid phone number.");
      return;
    }

    setSubmitting(true);

    const payload = new FormData();
    payload.append("name", name.trim());
    payload.append("email", email.trim());
    payload.append("phone", phone.trim());
    payload.append("message", message.trim());
    payload.append("projectType", initialService || "General Inquiry");
    payload.append("budget", `$${parseInt(budget).toLocaleString()}`);
    payload.append("timeline", timeline);
    payload.append("source", "Website Contact Form");
    payload.append("timestamp", new Date().toISOString());
    if (file) payload.append("attachment", file);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Lead submitted:", { 
        name: name.trim(), 
        email: email.trim(), 
        phone: phone.trim(), 
        projectType: initialService || "General",
        budget: budget,
        timeline: timeline,
        file: file?.name 
      });
      
      if (window.gtag) {
        window.gtag('event', 'generate_lead', {
          'event_category': 'Contact',
          'event_label': initialService || 'General'
        });
      }
      
      alert("✓ Thank you! We've received your request. Our team will contact you within 24 hours.");
      
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setFile(null);
      setBudget("50000");
      setTimeline("3-6 months");
      setStep(1);
      setTouched({ name: false, email: false, phone: false });
      onClose();
      
    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your request. Please call us directly at (619) 555-0123");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center px-4" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Request a quote"
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div 
        ref={ref} 
        tabIndex={-1} 
        className="relative max-w-2xl w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl"
        aria-labelledby="modal-title"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-slate-50">Request a Free Construction Consultation</h2>
            <div className="text-xs text-slate-400">Get blueprint-based quote within 24-48 hours.</div>
            {initialService && (
              <div className="mt-2 text-sm text-slate-200">Service: <span className="font-semibold text-emerald-300">{initialService}</span></div>
            )}
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close contact form" 
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Construction-themed progress bar */}
        <div className="mb-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center">
                <div 
                  className={`h-12 w-12 rounded-full flex items-center justify-center border-2 ${
                    step >= s.number 
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  } font-bold text-lg`}
                  aria-current={step === s.number ? "step" : undefined}
                >
                  {s.icon}
                </div>
                <div className="ml-3">
                  <div className="text-sm text-slate-400">Step {s.number}</div>
                  <div className="font-medium text-sm text-slate-200">{s.title}</div>
                </div>
                {i < steps.length - 1 && (
                  <div 
                    className={`h-0.5 w-12 mx-4 ${
                      step > s.number ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                    aria-hidden="true"
                  ></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Construction tool indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <span className="animate-pulse">🔨</span>
            <span>Building your dream home, one step at a time</span>
            <span className="animate-pulse">🏗️</span>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">📐</div>
                <h3 className="text-lg font-semibold text-slate-100">Tell us about your construction project</h3>
              </div>
              
              {/* Project Type */}
              <div>
                <label htmlFor="project-type" className="block text-sm text-slate-300 mb-2 flex items-center gap-2">
                  <span>🏠</span>
                  <span>Project Type</span>
                </label>
                <select 
                  id="project-type"
                  value={initialService || "General Inquiry"}
                  onChange={(e) => {}}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition"
                  disabled={!!initialService}
                  aria-label="Select project type"
                >
                  <option value="General Inquiry">Select project type</option>
                  <option value="Custom Home Building">Custom Home Building</option>
                  <option value="Home Renovations">Home Renovations</option>
                  <option value="Microcement Finishes">Microcement Finishes</option>
                  <option value="Home Additions">Home Additions</option>
                  <option value="Design & Planning">Design & Planning</option>
                </select>
              </div>
              
              {/* Budget slider */}
              <div>
                <label htmlFor="budget-slider" className="block text-sm text-slate-300 mb-2 flex items-center gap-2">
                  <span>💰</span>
                  <span>
                    Project Budget: <span className="text-emerald-400 font-bold">${parseInt(budget).toLocaleString()}</span>
                  </span>
                </label>
                <input 
                  id="budget-slider"
                  type="range" 
                  min="10000" 
                  max="500000" 
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  aria-label="Adjust project budget"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1">$10k <span className="text-lg">🏠</span></span>
                  <span className="flex items-center gap-1">$250k <span className="text-lg">🏡</span></span>
                  <span className="flex items-center gap-1">$500k+ <span className="text-lg">🏘️</span></span>
                </div>
              </div>
              
              {/* Timeline selector */}
              <div>
                <label className="block text-sm text-slate-300 mb-2 flex items-center gap-2">
                  <span>⏱️</span>
                  <span>Construction Timeline</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Select project timeline">
                  {['ASAP', '1-3 months', '3-6 months', '6-12 months', 'Planning only'].map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setTimeline(time)}
                      className={`p-3 rounded-lg border text-sm transition-colors flex items-center justify-center gap-2 ${
                        timeline === time 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' 
                          : 'border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                      role="radio"
                      aria-checked={timeline === time}
                      aria-label={`Timeline: ${time}`}
                    >
                      {time === 'ASAP' && '⚡'}
                      {time === '1-3 months' && '📅'}
                      {time === '3-6 months' && '🗓️'}
                      {time === '6-12 months' && '📆'}
                      {time === 'Planning only' && '📋'}
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-emerald-500 text-slate-950 py-3 rounded-lg font-bold hover:bg-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center justify-center gap-2"
                aria-label="Continue to contact information"
              >
                <span>Continue to Contact Info</span>
                <span className="text-xl">→</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">📋</div>
                <h3 className="text-lg font-semibold text-slate-100">Your Construction Team Contact</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name-input" className="block text-xs text-slate-400 mb-1 flex items-center gap-2">
                    <span>👤</span>
                    <span>Full Name *</span>
                  </label>
                  <input 
                    id="name-input"
                    value={name} 
                    onChange={(e) => {
                      setName(e.target.value);
                      setTouched(prev => ({ ...prev, name: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                    placeholder="John Smith" 
                    required
                    className={`w-full bg-slate-800/60 border rounded px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition ${
                      touched.name && !name.trim() ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    aria-invalid={touched.name && !name.trim()}
                    aria-describedby={touched.name && !name.trim() ? "name-error" : undefined}
                  />
                  {touched.name && !name.trim() && (
                    <p id="name-error" className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Name is required</span>
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email-input" className="block text-xs text-slate-400 mb-1 flex items-center gap-2">
                    <span>📧</span>
                    <span>Email *</span>
                  </label>
                  <input 
                    id="email-input"
                    type="email"
                    value={email} 
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setTouched(prev => ({ ...prev, email: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    placeholder="john@example.com" 
                    required
                    className={`w-full bg-slate-800/60 border rounded px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition ${
                      touched.email && (!email.trim() || !validateEmail(email)) ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    aria-invalid={touched.email && (!email.trim() || !validateEmail(email))}
                    aria-describedby={touched.email && (!email.trim() || !validateEmail(email)) ? "email-error" : undefined}
                  />
                  {touched.email && (!email.trim() || !validateEmail(email)) && (
                    <p id="email-error" className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Valid email is required</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone-input" className="block text-xs text-slate-400 mb-1 flex items-center gap-2">
                    <span>📞</span>
                    <span>Phone *</span>
                  </label>
                  <input 
                    id="phone-input"
                    type="tel"
                    value={phone} 
                    onChange={(e) => {
                      setPhone(formatPhone(e.target.value));
                      setTouched(prev => ({ ...prev, phone: true }));
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    placeholder="(619) 555-0123" 
                    required
                    maxLength="14"
                    className={`w-full bg-slate-800/60 border rounded px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition ${
                      touched.phone && (!phone.trim() || !validatePhone(phone)) ? 'border-red-500/50' : 'border-slate-800'
                    }`}
                    aria-invalid={touched.phone && (!phone.trim() || !validatePhone(phone))}
                    aria-describedby={touched.phone && (!phone.trim() || !validatePhone(phone)) ? "phone-error" : undefined}
                  />
                  {touched.phone && (!phone.trim() || !validatePhone(phone)) && (
                    <p id="phone-error" className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Valid phone number is required</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 flex items-center gap-2">
                    <span>🏡</span>
                    <span>Project Photos (Optional)</span>
                  </label>
                  <label htmlFor="hero-file" className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*,.pdf,.doc,.docx" 
                      onChange={handleFile} 
                      className="hidden" 
                      id="hero-file" 
                      aria-label="Upload project photos or documents"
                    />
                    <span className="w-full px-3 py-2 rounded bg-slate-800/60 border border-slate-700 text-sm text-slate-300 hover:border-emerald-500 hover:text-slate-100 transition truncate flex items-center gap-2" 
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && document.getElementById("hero-file")?.click()}>
                      {file ? `📎 ${file.name}` : (
                        <>
                          <span>📁</span>
                          <span>Choose file...</span>
                        </>
                      )}
                    </span>
                  </label>
                  {file && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-xs text-red-400 hover:text-red-300 mt-1 flex items-center gap-1"
                      aria-label={`Remove ${file.name}`}
                    >
                      <span>🗑️</span>
                      <span>Remove file</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message-textarea" className="block text-xs text-slate-400 mb-1 flex items-center gap-2">
                  <span>📝</span>
                  <span>Project Details</span>
                </label>
                <textarea 
                  id="message-textarea"
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Tell us about your project (size, rooms, style preferences, budget, etc.)"
                  rows="3"
                  className="w-full bg-slate-800/60 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none resize-none transition"
                  aria-label="Additional project details"
                />
              </div>
              
              <div className="flex items-center justify-between gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded border border-slate-800 text-sm hover:border-slate-600 hover:bg-slate-800/50 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center gap-2"
                  aria-label="Go back to project details"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center gap-2"
                  aria-label="Review and submit request"
                >
                  <span>Review & Submit</span>
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">✅</div>
                <h3 className="text-lg font-semibold text-slate-100">Review Your Construction Request</h3>
              </div>
              
              <div className="bg-slate-800/30 rounded-xl p-4 space-y-3 border border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span>🏠</span>
                    <span>Project Type:</span>
                  </span>
                  <span className="text-emerald-300 font-semibold flex items-center gap-2">
                    <span>{initialService || "General Inquiry"}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span>💰</span>
                    <span>Estimated Budget:</span>
                  </span>
                  <span className="text-emerald-300 font-semibold">${parseInt(budget).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span>⏱️</span>
                    <span>Timeline:</span>
                  </span>
                  <span className="text-emerald-300 font-semibold">{timeline}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span>👤</span>
                    <span>Name:</span>
                  </span>
                  <span className="text-slate-100">{name || "Not provided"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span>📧</span>
                    <span>Email:</span>
                  </span>
                  <span className="text-slate-100">{email || "Not provided"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-2">
                    <span>📞</span>
                    <span>Phone:</span>
                  </span>
                  <span className="text-slate-100">{phone || "Not provided"}</span>
                </div>
                {file && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-2">
                      <span>📁</span>
                      <span>Attachment:</span>
                    </span>
                    <span className="text-slate-100 text-sm">{file.name}</span>
                  </div>
                )}
              </div>
              
              {/* Construction reminder */}
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3 text-sm text-emerald-300">
                  <span className="text-lg">🏗️</span>
                  <span>Our construction team will contact you within 24 hours to schedule a site visit.</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded border border-slate-800 text-sm hover:border-slate-600 hover:bg-slate-800/50 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center gap-2"
                  aria-label="Go back to contact information"
                >
                  <span>←</span>
                  <span>Back</span>
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  aria-label={submitting ? "Submitting your request" : "Submit construction request"}
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>🏗️</span>
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 space-y-2">
            <p className="flex items-center gap-2">
              <span>📞</span>
              <span><strong>Prefer to call?</strong></span>
              <a href="tel:+16195550123" className="text-emerald-400 hover:text-emerald-300 transition-colors ml-1">
                (619) 555-0123
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span>🔒</span>
              <span>Your information is secure and will never be shared with third parties.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CostCalculatorModal({ open, onClose }) {
  const [projectType, setProjectType] = useState('kitchen');
  const [size, setSize] = useState(150);
  const [quality, setQuality] = useState('mid');
  const [estimate, setEstimate] = useState(0);

  const calculateEstimate = () => {
    const baseRates = {
      kitchen: 300,
      bathroom: 250,
      addition: 400,
      wholeHome: 350,
      microcement: 45
    };
    
    const qualityMultiplier = {
      economy: 0.8,
      mid: 1,
      premium: 1.5,
      luxury: 2.2
    };
    
    const base = baseRates[projectType] * size;
    return Math.round(base * qualityMultiplier[quality]);
  };

  useEffect(() => {
    setEstimate(calculateEstimate());
  }, [projectType, size, quality]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center px-4" 
      role="dialog" 
      aria-modal="true"
      aria-label="Construction cost calculator"
    >
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div className="relative max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">💰</span>
              <h2 className="text-lg font-semibold text-slate-50">Construction Cost Estimator</h2>
            </div>
            <div className="text-xs text-slate-400">Get instant project cost range</div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close calculator" 
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="calculator-project-type" className="block text-sm text-slate-300 mb-2 flex items-center gap-2">
              <span>🏠</span>
              <span>Project Type</span>
            </label>
            <select 
              id="calculator-project-type"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition"
              aria-label="Select project type for cost calculation"
            >
              <option value="kitchen">Kitchen Remodel</option>
              <option value="bathroom">Bathroom Renovation</option>
              <option value="addition">Home Addition</option>
              <option value="wholeHome">Whole Home Remodel</option>
              <option value="microcement">Microcement Finishes</option>
            </select>
          </div>

          <div>
            <label htmlFor="size-slider" className="block text-sm text-slate-300 mb-2 flex items-center gap-2">
              <span>📏</span>
              <span>
                Size: <span className="text-emerald-400 font-semibold">{size} sq.ft.</span>
              </span>
            </label>
            <input 
              id="size-slider"
              type="range" 
              min="50" 
              max="5000" 
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              aria-label="Adjust project size in square feet"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <span>50</span>
                <span>📏</span>
              </span>
              <span className="flex items-center gap-1">
                <span>2,500</span>
                <span>🏠</span>
              </span>
              <span className="flex items-center gap-1">
                <span>5,000</span>
                <span>🏘️</span>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2 flex items-center gap-2">
              <span>⭐</span>
              <span>Construction Quality</span>
            </label>
            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Select quality level">
              {['economy', 'mid', 'premium', 'luxury'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setQuality(level)}
                  className={`p-3 rounded-lg border text-xs transition-colors flex flex-col items-center gap-1 ${
                    quality === level 
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' 
                      : 'border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                  role="radio"
                  aria-checked={quality === level}
                  aria-label={`${level.charAt(0).toUpperCase() + level.slice(1)} quality`}
                >
                  <span className="text-lg">
                    {level === 'economy' ? '🔨' : 
                     level === 'mid' ? '🏠' : 
                     level === 'premium' ? '🏡' : '🏘️'}
                  </span>
                  <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 p-6 rounded-xl border border-emerald-500/30">
            <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
              <span>💵</span>
              <span>Estimated Construction Cost</span>
            </div>
            <div className="text-3xl font-bold text-emerald-300 mb-2">
              ${estimate.toLocaleString()} - ${Math.round(estimate * 1.3).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>📝</span>
              <span>* For accurate quote, request free on-site consultation</span>
            </div>
          </div>

          <button 
            onClick={() => {
              if (window.gtag) {
                window.gtag('event', 'calculate_cost', {
                  'project_type': projectType,
                  'estimated_cost': estimate
                });
              }
              onClose();
              const event = new CustomEvent('openContactModal', { 
                detail: { 
                  service: projectType,
                  estimatedBudget: estimate 
                } 
              });
              window.dispatchEvent(event);
            }}
            className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center justify-center gap-2"
            aria-label="Get exact quote based on calculation"
          >
            <span>📋</span>
            <span>Get Exact Construction Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ConstructionServiceCard({ service, onRequest }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  
  const constructionIcons = {
    'Custom Home Building': '🏗️',
    'Home Renovations': '🔨',
    'Microcement Finishes': '🧱',
    'Home Additions': '➕',
    'Design & Planning': '📐',
    'Project Management': '📋'
  };

  const serviceFeatures = {
    'Custom Home Building': ['📐 Custom Design', '🏗️ Foundation to Roof', '🔧 Premium Finishes', '📋 Full Permits'],
    'Home Renovations': ['🔨 Demolition', '⚡ Electrical Update', '💧 Plumbing Work', '🎨 Interior Finish'],
    'Microcement Finishes': ['🧱 Surface Prep', '🎨 Seamless Finish', '✨ Polishing', '🛡️ Waterproof'],
    'Home Additions': ['➕ Room Addition', '🏗️ Foundation', '🔩 Structural Work', '🏠 Seamless Blend'],
    'Design & Planning': ['📐 3D Design', '📋 Permit Drawings', '💰 Budget Planning', '🗓️ Timeline'],
    'Project Management': ['👷 Daily Supervision', '📞 Client Updates', '💰 Budget Control', '✅ Quality Checks']
  };

  return (
    <article
      role="article"
      aria-labelledby={`svc-${service.id}-title`}
      className="group rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 relative"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onRequest(service.title); }}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Construction tape corner */}
      <div className="absolute top-0 right-0 w-16 h-8 overflow-hidden z-10">
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-500 rotate-45"></div>
        <div className="absolute top-1 right-1 text-slate-950 text-xs font-bold rotate-45">CONSTRUCTION</div>
      </div>

      <div className="h-48 w-full relative bg-slate-800 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse ${imgLoaded ? 'hidden' : 'block'}`}></div>
        <img
          src={service.img}
          alt={`${service.title} construction service by Efficient Building Group in San Diego`}
          className={`object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { 
            e.currentTarget.onerror = null; 
            e.currentTarget.src = 'https://images.unsplash.com/photo-1505692794409-8c0b1f6d9f8b?auto=format&fit=crop&w=800&q=80'; 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        
        {/* Construction badge */}
        <div className="absolute top-4 left-4">
          <div className="bg-slate-950/90 backdrop-blur-sm px-3 py-2 rounded-full border border-emerald-500/30 flex items-center gap-2">
            <span className="text-emerald-300 text-lg">{constructionIcons[service.title] || '🏠'}</span>
            <span className="text-slate-100 font-medium text-sm">{service.title}</span>
          </div>
        </div>
        
        {/* Quick action button */}
        {isHovered && (
          <div className="absolute bottom-4 right-4 animate-in slide-in-from-right-5">
            <button 
              onClick={() => onRequest(service.title)}
              className="bg-emerald-500 text-white p-3 rounded-full shadow-2xl hover:bg-emerald-400 transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center gap-2"
              aria-label={`Quick quote for ${service.title}`}
            >
              <span className="text-lg">📋</span>
            </button>
          </div>
        )}
      </div>

      <div className={`p-5 transition-all duration-300 ${isHovered ? 'translate-y-[-8px]' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 id={`svc-${service.id}-title`} className="text-lg font-bold text-slate-100 mb-1">{service.title}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
              <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
                <span className="text-emerald-400">💰</span>
                <span>{service.price}</span>
              </span>
              <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
                <span className="text-emerald-400">⏱️</span>
                <span>{service.timeline}</span>
              </span>
            </div>
          </div>
          <div className="text-3xl text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {constructionIcons[service.title] || '🏠'}
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">{service.desc}</p>

        {/* Construction features */}
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
            <span>🛠️</span>
            <span>Includes:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {serviceFeatures[service.title]?.map((feature, i) => (
              <span key={i} className="text-xs bg-slate-800/50 text-slate-300 px-2 py-1 rounded border border-slate-700">
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
          <button 
            onClick={() => onRequest(service.title)}
            aria-haspopup="dialog"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-2 group/btn focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-3 py-2 hover:bg-slate-800/30"
          >
            <span className="group-hover/btn:animate-bounce">🔨</span>
            <span>Get Construction Quote</span>
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </button>
          <a 
            href={`#projects?filter=${service.slug}`} 
            className="text-xs text-slate-500 hover:text-slate-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-2 py-1 hover:bg-slate-800/30 flex items-center gap-1"
            aria-label={`View ${service.title} construction projects`}
          >
            <span>👁️</span>
            <span>View Work</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function ConstructionTestimonialCard({ testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const quoteRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  
  useEffect(() => {
    if (quoteRef.current) {
      setIsOverflowing(quoteRef.current.scrollHeight > quoteRef.current.clientHeight);
    }
  }, [testimonial.quote]);

  const projectIcons = {
    'Whole House Remodel': '🏠',
    'Kitchen & Bath Remodel': '🔨',
    'Custom ADU Addition': '➕'
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/30 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors h-full flex flex-col group hover:shadow-xl hover:shadow-emerald-500/5">
      {/* Blueprint background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[length:40px_40px] bg-[linear-gradient(to_right,#059669_1px,transparent_1px),linear-gradient(to_bottom,#059669_1px,transparent_1px)] rounded-xl"></div>
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center text-emerald-300 text-lg border border-emerald-500/30 group-hover:scale-110 transition-transform">
            {testimonial.initials}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-100">{testimonial.name}</div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1">
                {projectIcons[testimonial.project.split(',')[0]] || '🏗️'}
                <span>{testimonial.project.split(',')[0]}</span>
              </span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-300">{testimonial.project.split(',')[1]?.trim() || 'San Diego'}</span>
            </div>
          </div>
        </div>
        
        <div 
          ref={quoteRef}
          className={`text-sm text-slate-300 italic mb-4 flex-1 relative pl-4 ${
            !expanded ? 'line-clamp-4' : ''
          }`}
        >
          <span className="absolute left-0 top-0 text-2xl text-emerald-400/30">"</span>
          {testimonial.quote}
          <span className="absolute right-0 bottom-0 text-2xl text-emerald-400/30">"</span>
        </div>
        {isOverflowing && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-emerald-400 hover:text-emerald-300 mb-4 self-start focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded flex items-center gap-1"
            aria-expanded={expanded}
          >
            <span>{expanded ? '▲ Show less' : '▼ Read more'}</span>
          </button>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-emerald-400">★</span>
            ))}
            <span className="ml-2 text-xs text-slate-400">{testimonial.date}</span>
          </div>
          <div className="text-xs text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1">
            <span>✅</span>
            <span>Project Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const constructionQuestions = [
    "What's the average kitchen remodel cost in San Diego?",
    "How long does a bathroom renovation take?",
    "Do you handle permits for home additions?",
    "What's included in your custom home building?",
    "Can you show me examples of microcement finishes?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        text: "Great construction question! I'll connect you with our expert team for a detailed answer. Want me to schedule a free site consultation?", 
        sender: 'bot' 
      }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating chat button with construction theme */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center z-40 animate-bounce-slow focus:outline-none focus:ring-2 focus:ring-emerald-500/30 group"
        aria-label="Chat with construction experts"
        aria-expanded={isOpen}
      >
        <span className="text-2xl group-hover:rotate-12 transition-transform">🔨</span>
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 animate-ping"></span>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-80 md:w-96 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl z-50 animate-in slide-in-from-bottom-5">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <span className="font-semibold text-slate-100">Construction Assistant</span>
                <div className="text-xs text-slate-400">Ask about building & remodeling</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded p-1"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          
          <div className="p-4 h-96 overflow-y-auto">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="text-lg">🏗️</span>
                  <span>Hi! I can help with construction questions. How can I assist you today?</span>
                </div>
                <div className="space-y-2">
                  {constructionQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMessages([...messages, { text: q, sender: 'user' }]);
                        setIsTyping(true);
                        setTimeout(() => {
                          setIsTyping(false);
                          setMessages(prev => [...prev, { 
                            text: "Great construction question! I'll connect you with our expert team for a detailed answer.", 
                            sender: 'bot' 
                          }]);
                        }, 1000);
                      }}
                      className="text-left p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm w-full transition text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      aria-label={`Ask: ${q}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{i === 0 ? '💰' : i === 1 ? '⏱️' : i === 2 ? '📋' : i === 3 ? '🏠' : '🧱'}</span>
                        <span>{q}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-500/20 text-slate-100 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  <div className="flex items-center gap-1">
                    <span className="text-sm mr-2">🔨</span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about construction..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                aria-label="Type your construction question"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center gap-2"
                aria-label="Send message"
              >
                <span>📤</span>
              </button>
            </div>
            <div className="text-xs text-slate-500 mt-2 text-center flex items-center justify-center gap-2">
              <span>⏱️</span>
              <span>Construction experts online now</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ConstructionTrustBadges() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const badges = [
    { name: 'CA Licensed', logo: '📜', text: 'B-9876543', color: 'from-blue-500/20 to-blue-600/20', icon: '🏗️', tag: 'Legal' },
    { name: 'Fully Insured', logo: '🛡️', text: '$2M Liability', color: 'from-emerald-500/20 to-emerald-600/20', icon: '✅', tag: 'Safe' },
    { name: 'BBB A+ Rated', logo: '🏆', text: 'Top Builder', color: 'from-amber-500/20 to-amber-600/20', icon: '⭐', tag: 'Trusted' },
    { name: 'NARI Certified', logo: '📋', text: 'Remodeler', color: 'from-purple-500/20 to-purple-600/20', icon: '🔧', tag: 'Expert' },
    { name: 'Local 15+ Years', logo: '📍', text: 'San Diego', color: 'from-red-500/20 to-red-600/20', icon: '🏠', tag: 'Local' },
    { name: 'Financing', logo: '💰', text: 'Available', color: 'from-green-500/20 to-green-600/20', icon: '🤝', tag: 'Flexible' },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-slate-950 to-slate-900 border-y border-slate-800 relative overflow-hidden">
      {/* Construction background elements */}
      <div className="absolute top-10 left-10 text-4xl opacity-5">🏗️</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-5">🔨</div>
      <div className="absolute top-1/2 left-1/4 text-3xl opacity-5">📐</div>
      <div className="absolute top-1/3 right-1/4 text-3xl opacity-5">🧱</div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
            Trusted & Certified Builders
          </div>
          <h3 className="text-2xl font-bold mb-2 text-slate-100">San Diego's Premier Construction Team</h3>
          <p className="text-slate-400">Licensed, insured, and committed to construction excellence since 2010</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {badges.map((badge, i) => (
            <div 
              key={i} 
              className={`bg-gradient-to-br ${badge.color} border border-slate-800 rounded-xl p-4 text-center group hover:border-emerald-500/50 hover:transform hover:-translate-y-1 transition-all duration-300 relative`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="text-3xl mb-2 relative">
                <span className="group-hover:scale-110 transition-transform duration-300">{badge.logo}</span>
                <div className={`absolute -top-2 -right-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded-full transition-opacity duration-300 ${hoveredIndex === i ? 'opacity-100' : 'opacity-0'}`}>
                  {badge.tag}
                </div>
              </div>
              <div className="font-bold text-sm text-slate-100 mb-1">{badge.name}</div>
              <div className="text-xs text-emerald-300">{badge.text}</div>
              <div className="text-lg mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {badge.icon}
              </div>
            </div>
          ))}
        </div>
        
        {/* Construction Stats */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800/50 border border-slate-700 relative overflow-hidden">
          {/* Construction grid pattern */}
          <div className="absolute inset-0 opacity-5 bg-[length:50px_50px] bg-[linear-gradient(to_right,#059669_1px,transparent_1px),linear-gradient(to_bottom,#059669_1px,transparent_1px)]"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {[
              { value: '150+', label: 'Homes Built', icon: '🏠', desc: 'Since 2010', color: 'text-emerald-300' },
              { value: '98%', label: 'Client Satisfaction', icon: '😊', desc: 'Repeat Clients', color: 'text-emerald-300' },
              { value: '24/7', label: 'Site Support', icon: '🛠️', desc: 'Emergency Service', color: 'text-emerald-300' },
              { value: '2-4', label: 'Weeks Faster', icon: '⚡', desc: 'Than Average', color: 'text-emerald-300' }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className={`${stat.color} text-3xl font-bold mb-2 flex items-center justify-center gap-2`}>
                  <span className="group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                  <span>{stat.value}</span>
                </div>
                <div className="text-sm font-semibold text-slate-100 mb-1">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.desc}</div>
              </div>
            ))}
          </div>
          
          {/* Animated construction elements */}
          <div className="mt-6 pt-6 border-t border-slate-800/50 relative">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="animate-pulse">🔨</span>
                <span>Active Construction Sites</span>
              </span>
              <span className="flex items-center gap-2">
                <span>🏗️</span>
                <span>Projects in Progress</span>
              </span>
              <span className="flex items-center gap-2">
                <span>✅</span>
                <span>Recently Completed</span>
              </span>
            </div>
            
            {/* Construction progress bar */}
            <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 rounded-full animate-[shimmer_2s_infinite]" 
                   style={{ width: '85%' }}>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConstructionProcess() {
  const processes = [
    {
      step: '01',
      title: 'Consultation & Blueprint',
      desc: 'On-site assessment, 3D design, and detailed construction plans',
      icon: '📐',
      color: 'from-blue-500/20 to-blue-600/20',
      tools: ['Site Visit', '3D Design', 'Budget Plan'],
      duration: '1-2 weeks'
    },
    {
      step: '02',
      title: 'Permits & Planning',
      desc: 'Architectural approval, material selection, construction scheduling',
      icon: '📋',
      color: 'from-emerald-500/20 to-emerald-600/20',
      tools: ['City Permits', 'Material Lists', 'Timeline'],
      duration: '2-4 weeks'
    },
    {
      step: '03',
      title: 'Construction Phase',
      desc: 'Skilled craftsmanship with daily site supervision and quality checks',
      icon: '🏗️',
      color: 'from-amber-500/20 to-amber-600/20',
      tools: ['Foundation', 'Framing', 'Finishes'],
      duration: '8-20 weeks'
    },
    {
      step: '04',
      title: 'Final Inspection',
      desc: 'Quality control, client walkthrough, and comprehensive warranty',
      icon: '✅',
      color: 'from-purple-500/20 to-purple-600/20',
      tools: ['Quality Check', 'Client Approval', 'Warranty'],
      duration: '1-2 weeks'
    }
  ];

  return (
    <section id="process" className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 py-16 md:py-20 relative overflow-hidden">
      {/* Construction background elements */}
      <div className="absolute top-20 left-5 text-5xl opacity-5 animate-pulse">🔨</div>
      <div className="absolute bottom-20 right-5 text-5xl opacity-5 animate-pulse">🏗️</div>
      <div className="absolute top-1/3 right-10 text-4xl opacity-5">📏</div>
      <div className="absolute bottom-1/3 left-10 text-4xl opacity-5">🧱</div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
            Our Construction Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-100">How We <span className="text-emerald-300">Build Your Dream</span> Home</h2>
          <p className="text-lg text-slate-400">From blueprint to keys - our proven 4-step construction process ensures quality and transparency</p>
        </div>

        {/* Construction Timeline */}
        <div className="relative mb-12">
          {/* Timeline Line - Desktop */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-500 rounded-full"></div>
          
          {/* Timeline Construction Icons */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 items-center justify-center text-lg">
            📐
          </div>
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/3 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 items-center justify-center text-lg">
            📋
          </div>
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-2/3 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 items-center justify-center text-lg">
            🏗️
          </div>
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bottom-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 items-center justify-center text-lg">
            ✅
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {processes.map((process, index) => (
              <div 
                key={process.step} 
                className={`relative group ${
                  index % 2 === 0 ? 'md:pr-8 lg:pr-0' : 'md:pl-8 lg:pl-0 md:mt-12 lg:mt-0'
                }`}
              >
                <div className={`bg-gradient-to-br ${process.color} border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 h-full relative overflow-hidden`}>
                  {/* Blueprint pattern overlay */}
                  <div className="absolute inset-0 opacity-5 bg-[length:30px_30px] bg-[linear-gradient(to_right,#059669_1px,transparent_1px),linear-gradient(to_bottom,#059669_1px,transparent_1px)]"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${process.color.replace('/20', '/30')} border border-slate-700 flex items-center justify-center text-2xl shadow-lg`}>
                        {process.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-emerald-400 font-semibold flex items-center gap-2">
                          <span>STEP {process.step}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{process.duration}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 mt-1">{process.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-4">{process.desc}</p>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>🛠️</span>
                        <span>Construction Includes:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {process.tools.map((tool, i) => (
                          <span key={i} className="text-xs bg-slate-800/50 text-slate-300 px-2 py-1 rounded border border-slate-700">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Construction Progress Indicator */}
                    <div className="mt-4 pt-4 border-t border-slate-800/50">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span>⏱️</span>
                          <span>Timeline: {process.duration}</span>
                        </div>
                        <div className="text-xl group-hover:animate-bounce">
                          {index === 0 ? '📏' : index === 1 ? '📄' : index === 2 ? '🔨' : '✅'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Construction Tools Showcase */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800/50 border border-slate-700 relative overflow-hidden">
          {/* Tool pattern background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-3xl">🔨</div>
            <div className="absolute bottom-10 right-10 text-3xl">🪚</div>
            <div className="absolute top-1/2 left-1/4 text-3xl">📏</div>
            <div className="absolute top-1/4 right-1/3 text-3xl">⚡</div>
            <div className="absolute bottom-1/3 left-1/3 text-3xl">💧</div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center justify-center gap-2">
                <span>🛠️</span>
                <span>Professional Construction Tools & Equipment</span>
                <span>🛠️</span>
              </h3>
              <p className="text-slate-400">We use industry-leading tools for precision construction and quality results</p>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {[
                { icon: '🔨', name: 'Hammer', desc: 'Framing' },
                { icon: '🪚', name: 'Saw', desc: 'Cutting' },
                { icon: '📏', name: 'Measure', desc: 'Precision' },
                { icon: '⚡', name: 'Electrical', desc: 'Wiring' },
                { icon: '💧', name: 'Plumbing', desc: 'Pipes' },
                { icon: '🎨', name: 'Paint', desc: 'Finishes' },
                { icon: '🧱', name: 'Masonry', desc: 'Foundations' },
                { icon: '🛡️', name: 'Safety', desc: 'Gear' }
              ].map((tool, i) => (
                <div key={i} className="text-center group">
                  <div className="text-3xl p-4 rounded-xl bg-slate-800/30 border border-slate-700 group-hover:border-emerald-500/50 group-hover:bg-slate-800/50 transition-all duration-300 group-hover:scale-110">
                    {tool.icon}
                  </div>
                  <div className="text-xs text-slate-300 mt-2 font-medium">{tool.name}</div>
                  <div className="text-[10px] text-slate-500">{tool.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EnhancedProjectGallery({ projects, onRequestQuote }) {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState('Recent');
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredProject, setHoveredProject] = useState(null);
  
  const types = ["All", ...Array.from(new Set(projects.map((p) => p.type)))];
  
  const filteredProjects = projects
    .filter((p) => filter === "All" ? true : p.type === filter)
    .sort((a, b) => {
      switch(sortBy) {
        case 'Recent': return b.id - a.id;
        case 'Budget': return parseInt(a.budget.replace(/\D/g, '')) - parseInt(b.budget.replace(/\D/g, ''));
        default: return 0;
      }
    });

  const constructionIcons = {
    'Kitchen': '🔨',
    'Bathroom': '🚿',
    'Addition': '➕',
    'Whole Home': '🏠',
    'Microcement': '🧱'
  };

  return (
    <div>
      {/* Enhanced filter bar with construction theme */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-gradient-to-r from-slate-900/50 to-slate-800/30 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center gap-2 ${
                filter === type 
                  ? 'bg-emerald-500 text-slate-950 font-semibold' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              aria-label={`Filter construction projects by ${type}`}
              aria-pressed={filter === type}
            >
              <span>{constructionIcons[type] || '🏗️'}</span>
              <span>{type}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <label htmlFor="sort-select" className="sr-only">Sort construction projects by</label>
          <div className="relative">
            <select 
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 appearance-none pr-10"
              aria-label="Sort construction projects"
            >
              <option value="Recent">Most Recent</option>
              <option value="Budget">Budget (Low to High)</option>
              <option value="Size">Project Size</option>
              <option value="Popular">Most Popular</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <span className="text-slate-400">▼</span>
            </div>
          </div>
          
          <div className="flex border border-slate-700 rounded-lg overflow-hidden" role="radiogroup" aria-label="View mode">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                viewMode === 'grid' ? 'bg-slate-800 text-emerald-300' : 'bg-slate-900 text-slate-400 hover:text-slate-300'
              }`}
              role="radio"
              aria-checked={viewMode === 'grid'}
              aria-label="Grid view"
            >
              ▦
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                viewMode === 'masonry' ? 'bg-slate-800 text-emerald-300' : 'bg-slate-900 text-slate-400 hover:text-slate-300'
              }`}
              role="radio"
              aria-checked={viewMode === 'masonry'}
              aria-label="Masonry view"
            >
              ◫
            </button>
          </div>
        </div>
      </div>
      
      {/* Projects grid with construction theme */}
      <div className={`gap-6 lg:gap-8 ${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'columns-1 md:columns-2 lg:columns-3 space-y-6'
      }`}>
        {filteredProjects.map((p) => (
          <article 
            key={p.id} 
            className={`group rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 ${
              viewMode === 'masonry' ? 'mb-8 break-inside-avoid' : ''
            }`}
            onMouseEnter={() => setHoveredProject(p.id)}
            onMouseLeave={() => setHoveredProject(null)}
            onFocus={() => setHoveredProject(p.id)}
            onBlur={() => setHoveredProject(null)}
            tabIndex={0}
          >
            <div className="h-56 overflow-hidden relative">
              <img 
                src={p.img} 
                alt={`${p.title} construction project in ${p.location} by Efficient Building Group`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
              
              {/* Construction badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-slate-950/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2">
                  <span className="text-emerald-300">{constructionIcons[p.type] || '🏗️'}</span>
                  <span>{p.type}</span>
                </div>
              </div>
              
              {p.beforeImage && (
                <div className="absolute top-4 right-4">
                  <div className="bg-black/70 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <span>🔄</span>
                    <span>Before/After</span>
                  </div>
                </div>
              )}
              
              {hoveredProject === p.id && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <button
                    onClick={() => onRequestQuote(p.type)}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-400 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center gap-2"
                    aria-label={`Get construction quote for similar ${p.type} project`}
                  >
                    <span>🔨</span>
                    <span>Get Similar Quote</span>
                  </button>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-emerald-400 font-semibold uppercase flex items-center gap-2">
                  <span>{constructionIcons[p.type] || '🏗️'}</span>
                  <span>{p.type}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <span>📍</span>
                  <span>{p.location}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-100">{p.title}</h3>
              <p className="text-sm text-slate-300 mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-emerald-300 flex items-center gap-1">
                  <span>💰</span>
                  <span>{p.budget}</span>
                </div>
                <button 
                  onClick={() => onRequestQuote(p.type)}
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-2 py-1 hover:bg-slate-800/30"
                  aria-label={`Get construction quote for ${p.title}`}
                >
                  <span>Get Construction Quote</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </article>
        ))}
        
        {/* "YOUR PROJECT HERE" card with construction theme */}
        <article className={`group rounded-2xl overflow-hidden border-2 border-dashed border-slate-700 bg-gradient-to-br from-slate-900/40 to-slate-950/40 flex flex-col items-center justify-center p-8 text-center hover:border-emerald-500/30 hover:bg-slate-900/60 transition-all duration-500 ${
          viewMode === 'masonry' ? 'mb-8 break-inside-avoid h-fit' : ''
        }`}>
          <div className="h-56 w-full mb-6 flex items-center justify-center bg-slate-800/20 rounded-xl border border-slate-800 group-hover:border-slate-700 relative">
            <div className="text-5xl text-slate-500 group-hover:text-emerald-400 transition-colors animate-pulse">🏗️</div>
            <div className="absolute bottom-4 text-xs text-slate-500">Your Construction Project Here</div>
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-3">Build With Us</h3>
          <p className="text-sm text-slate-400 mb-6 text-center">
            Have a construction project we should feature? Share your success story with our team.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => onRequestQuote("Project Feature")}
              className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center gap-2"
              aria-label="Submit your construction project for feature"
            >
                            <span>Submit Project</span>
            </button>
            <a 
              href="#contact" 
              className="px-4 py-2.5 rounded-lg border border-slate-800 text-sm hover:border-slate-700 hover:bg-slate-900/50 transition text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 flex items-center gap-2"
              aria-label="Contact us about construction project feature"
            >
              <span>📞</span>
              <span>Contact Us</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================

export default function App() {
  // Skip to main content link
  useEffect(() => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-emerald-500 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:ring-2 focus:ring-emerald-500/30';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
    
    return () => skipLink.remove();
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotating hero slides
  const slides = [
    { 
      src: "https://images.unsplash.com/photo-1609280069678-ab9ef26a0b05?q=80&w=1479&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
      title: "Modern Kitchen Construction", 
      caption: "Kitchen Remodel · $25k–70k · 8-12 weeks",
      alt: "Modern kitchen construction in San Diego by Efficient Building Group",
      icon: "🔨"
    },
    { 
      src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80", 
      title: "Luxury Bathroom Construction", 
      caption: "Bathroom Build · $15k–50k · 6-10 weeks",
      alt: "Luxury bathroom construction in San Diego with premium finishes",
      icon: "🚿"
    },
    { 
      src: "https://images.unsplash.com/photo-1507086182422-97bd7ca2413b?auto=format&fit=crop&w=1200&q=80", 
      title: "Home Addition Construction", 
      caption: "Addition Build · $40k–150k · 12-24 weeks",
      alt: "Home addition construction project in San Diego County",
      icon: "➕"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => { 
    const timer = setInterval(() => setCurrentSlide((c) => (c + 1) % slides.length), 5000); 
    return () => clearInterval(timer); 
  }, []);

  // Projects data with construction details
  const allProjects = [
    { 
      id: 1, 
      type: "Kitchen", 
      title: "Modern Coastal Kitchen Build", 
      img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80", 
      beforeImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      location: "La Jolla, San Diego", 
      description: "Complete kitchen construction with quartz countertops and custom cabinetry.",
      budget: "$65,000"
    },
    { 
      id: 2, 
      type: "Bathroom", 
      title: "Minimalist Master Bath Build", 
      img: "https://images.unsplash.com/photo-1512916958891-fcf61b2160df?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
      beforeImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80",
      location: "Encinitas, San Diego", 
      description: "Spa-like bathroom construction with walk-in shower and heated floors.",
      budget: "$42,000"
    },
    { 
      id: 3, 
      type: "Addition", 
      title: "Backyard ADU Construction", 
      img: "https://media.istockphoto.com/id/1483409034/photo/modern-house-with-lush-garden.webp?a=1&s=612x612&w=0&k=20&c=LrZP9ftiiZ420MA8a-SuYri_VPxxkt1-e2iLgb3aopA=", 
      beforeImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
      location: "North Park, San Diego", 
      description: "Accessory dwelling unit construction with full kitchen and private entrance.",
      budget: "$185,000"
    },
    { 
      id: 4, 
      type: "Whole Home", 
      title: "Whole House Construction", 
      img: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", 
      beforeImage: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=800&q=80",
      location: "Hillcrest, San Diego", 
      description: "Complete interior construction with structural updates and modern finishes.",
      budget: "$320,000"
    },
    { 
      id: 5, 
      type: "Microcement", 
      title: "Seamless Microcement Construction", 
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", 
      beforeImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      location: "Pacific Beach, San Diego", 
      description: "Modern microcement floor construction throughout entire home.",
      budget: "$28,000"
    },
  ];

  // Construction services data
  const services = [
    { 
      id: 'custom-home', 
      title: 'Custom Home Building', 
      img: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80', 
      alt: 'Custom home construction in San Diego by Efficient Building Group', 
      icon: '🏗️', 
      desc: 'Build your dream home from the ground up. We handle everything from land acquisition to final finishes with expert construction.', 
      price: 'From $250k', 
      timeline: '9–14 months', 
      slug: 'custom-home' 
    },
    { 
      id: 'renovations', 
      title: 'Home Renovations', 
      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', 
      alt: 'Home renovation construction services in San Diego', 
      icon: '🔨', 
      desc: 'Transform kitchens, bathrooms, or entire homes. We preserve character while adding modern functionality through expert construction.', 
      price: '$15k–$250k', 
      timeline: '8–20 weeks', 
      slug: 'renovations' 
    },
    { 
      id: 'microcement', 
      title: 'Microcement Finishes', 
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 
      alt: 'Microcement floor and wall construction in San Diego homes', 
      icon: '🧱', 
      desc: 'Premium seamless surfaces for floors, walls, and showers. Durable, waterproof, and modern aesthetic construction.', 
      price: 'From $12/sqft', 
      timeline: '1–3 weeks', 
      slug: 'microcement' 
    },
    { 
      id: 'additions', 
      title: 'Home Additions', 
      img: 'https://images.unsplash.com/photo-1507086182422-97bd7ca2413b?auto=format&fit=crop&w=1200&q=80', 
      alt: 'Home addition construction in San Diego County', 
      icon: '➕', 
      desc: 'Expand your living space with ADUs, second stories, or room additions through expert construction. Increase home value & functionality.', 
      price: '$40k–$200k', 
      timeline: '12–36 weeks', 
      slug: 'additions' 
    },
    { 
      id: 'design-planning', 
      title: 'Design & Planning', 
      img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80', 
      alt: 'Architectural design and construction planning services San Diego', 
      icon: '📐', 
      desc: 'Architectural design, space planning, and 3D visualization to bring your construction vision to life before building begins.', 
      price: '$2k–$15k', 
      timeline: '2–8 weeks', 
      slug: 'design-planning' 
    },
    { 
      id: 'project-management', 
      title: 'Construction Management', 
      img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', 
      alt: 'Construction project management services San Diego', 
      icon: '📋', 
      desc: 'Full-service construction coordination: permits, timelines, budgets, and contractor management for stress-free building projects.', 
      price: 'Included', 
      timeline: 'Project duration', 
      slug: 'construction-management' 
    },
  ];

  // Construction testimonials
  const testimonials = [
    {
      name: "James & Sarah M.",
      initials: "JS",
      project: "Whole House Remodel, La Jolla",
      quote: "Efficient Building Group transformed our 1980s home into a modern masterpiece. Their construction team was on time, on budget, and the quality exceeded our expectations. The daily site updates were fantastic!",
      date: "March 2024"
    },
    {
      name: "Michael R.",
      initials: "MR",
      project: "Kitchen & Bath Remodel, Encinitas",
      quote: "The construction team was professional from day one. They handled all permits, kept us updated weekly with photos, and finished two weeks ahead of schedule. Our kitchen is now the heart of our home!",
      date: "February 2024"
    },
    {
      name: "Jennifer L.",
      initials: "JL",
      project: "Custom ADU Addition, North Park",
      quote: "We added a rental unit to our property. The construction process was seamless and we're now earning $2,800/month in rental income. Great ROI! Highly recommend for investment properties.",
      date: "January 2024"
    }
  ];

  // State management
  const [openFaq, setOpenFaq] = useState(null);
  const [openHeroModal, setOpenHeroModal] = useState(false);
  const [openCalculatorModal, setOpenCalculatorModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleRequestQuote(serviceTitle) {
    setSelectedService(serviceTitle);
    setOpenHeroModal(true);
    if (window.gtag) {
      window.gtag('event', 'click', {
        'event_category': 'Button',
        'event_label': `Request Construction Quote - ${serviceTitle}`,
        'value': 1
      });
    }
  }

  // Listen for calculator modal to open contact modal
  useEffect(() => {
    const handleOpenContactModal = (event) => {
      setSelectedService(event.detail.service);
      setOpenHeroModal(true);
    };
    
    window.addEventListener('openContactModal', handleOpenContactModal);
    return () => window.removeEventListener('openContactModal', handleOpenContactModal);
  }, []);

  // Current year for copyright
  const currentYear = new Date().getFullYear();

    // Construction-themed animations
  const animationStyles = `
    /* Badge Pulse Animation */
    @keyframes badgePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    .animate-badge-pulse {
      animation: badgePulse 3s infinite ease-in-out;
    }

    /* Construction-themed animations */
    @keyframes hammerSwing {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-15deg); }
      75% { transform: rotate(15deg); }
    }
    
    @keyframes truckMove {
      0% { transform: translateX(-100px); opacity: 0; }
      20%, 80% { opacity: 1; }
      100% { transform: translateX(100px); opacity: 0; }
    }
    
    @keyframes blueprintShimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    
    @keyframes toolSpin {
      0% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(180deg) scale(1.1); }
      100% { transform: rotate(360deg) scale(1); }
    }
    
    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }
    
    .animate-hammer {
      animation: hammerSwing 2s infinite ease-in-out;
      transform-origin: top center;
    }
    
    .animate-truck {
      animation: truckMove 8s infinite linear;
    }
    
    .animate-blueprint {
      background: linear-gradient(90deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #10b981 100%);
      background-size: 200% auto;
      animation: blueprintShimmer 3s infinite linear;
    }
    
    .animate-tool {
      animation: toolSpin 4s infinite linear;
    }
    
    .construction-grid {
      background-image: 
        linear-gradient(rgba(15, 23, 42, 0.7) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15, 23, 42, 0.7) 1px, transparent 1px);
      background-size: 50px 50px;
    }
    
    .blueprint-bg {
      background-image: 
        radial-gradient(circle at 2px 2px, rgba(6, 95, 70, 0.2) 2px, transparent 0),
        radial-gradient(circle at 48px 48px, rgba(6, 95, 70, 0.2) 2px, transparent 0);
      background-size: 50px 50px;
      background-position: 0 0, 25px 25px;
    }
    
    @keyframes crossfade {
      0%, 20% { opacity: 1; }
      25%, 45% { opacity: 0; }
      50%, 70% { opacity: 1; }
      75%, 95% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    @keyframes zoomSlow {
      0% { transform: scale(1); }
      100% { transform: scale(1.1); }
    }
    
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .animate-bounce-slow {
      animation: bounce-slow 2s infinite;
    }
    
    @keyframes slide-in-from-bottom-5 {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slide-in-from-right-5 {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    .animate-in {
      animation-duration: 300ms;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
    }
    
    .slide-in-from-bottom-5 {
      animation-name: slide-in-from-bottom-5;
    }
    
    .slide-in-from-right-5 {
      animation-name: slide-in-from-right-5;
    }
    
    .line-clamp-2 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    
    .line-clamp-4 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
    }
  `;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
      {/* Add animation styles */}
      <style>{animationStyles}</style>

      {/* Construction-themed Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-white rounded-full animate-pulse"></span>
            <span className="font-medium">🏗️ Limited Time: Free 3D Construction Design with Any Quote!</span>
          </div>
          <button 
            onClick={() => { setSelectedService(null); setOpenHeroModal(true); }}
            className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors hidden sm:block flex items-center gap-1"
          >
            <span>Claim Construction Offer</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-lg border-b border-slate-800/50 shadow-2xl' : 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar with Construction Info */}
          <div className="py-2 border-b border-slate-800/50 hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">📍</span>
                <span className="whitespace-nowrap">Serving All San Diego County</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">⏰</span>
                <span className="whitespace-nowrap">Mon-Sat: 8AM-6PM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">📅</span>
                <span className="whitespace-nowrap">Same-Day Construction Estimates</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="tel:+16195550123" 
                className="flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition-colors whitespace-nowrap group"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse group-hover:animate-none"></span>
                <span>(619) 555-0123</span>
              </a>
              <div className="h-4 w-px bg-slate-700"></div>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-emerald-400 transition-colors p-1 text-sm hover:scale-110">f</a>
                <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-emerald-400 transition-colors p-1 text-sm hover:scale-110">ig</a>
                <a href="#" aria-label="Houzz" className="text-slate-400 hover:text-emerald-400 transition-colors p-1 text-sm hover:scale-110">hz</a>
                <a href="#" aria-label="Google Reviews" className="text-slate-400 hover:text-emerald-400 transition-colors p-1 text-sm hover:scale-110">g</a>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="py-3 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <a 
                href="/" 
                className="flex items-center gap-3 group"
                aria-label="Efficient Building Group Construction Home"
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-slate-950 font-bold text-lg group-hover:scale-105 transition-transform duration-300 shadow-lg">
                    <span className="group-hover:animate-hammer">🏗️</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                </div>
                <div className="hidden sm:flex flex-col">
                  <div className="text-sm font-bold tracking-wide text-slate-100 group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                    Efficient Building Group
                  </div>
                  <div className="text-[11px] text-slate-400 -mt-0.5 whitespace-nowrap">
                    Custom Construction · San Diego, CA
                  </div>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 mx-4" aria-label="Main construction navigation">
              {['Services', 'Projects', 'Process', 'Reviews', 'About', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-emerald-300 hover:bg-slate-800/50 transition-colors whitespace-nowrap flex items-center gap-2"
                >
                  <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {item === 'Services' ? '🏗️' : 
                     item === 'Projects' ? '📂' : 
                     item === 'Process' ? '📋' : 
                     item === 'Reviews' ? '⭐' : 
                     item === 'About' ? '👥' : '❓'}
                  </span>
                  <span>{item}</span>
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2">
              {/* Desktop CTA Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => setOpenCalculatorModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/50 transition-all duration-300 text-sm font-medium whitespace-nowrap group/calc"
                  aria-label="Construction Cost Calculator"
                >
                  <span className="group-hover/calc:animate-bounce">💰</span>
                  <span>Calculator</span>
                </button>
                
                <button 
                  onClick={() => { setSelectedService(null); setOpenHeroModal(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all text-sm whitespace-nowrap group/quote"
                  aria-label="Free Construction Consultation"
                >
                  <span className="group-hover/quote:animate-hammer">🔨</span>
                  <span>Construction Quote</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden h-10 w-10 rounded-lg border border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center gap-1.5 group/menu"
                aria-label="Toggle construction menu"
                aria-expanded={isMenuOpen}
              >
                <span className={`h-0.5 w-5 bg-slate-300 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`h-0.5 w-5 bg-slate-300 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-0.5 w-5 bg-slate-300 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                <div className="absolute inset-0 rounded-lg border border-emerald-500/0 group-hover/menu:border-emerald-500/30 transition-colors duration-300"></div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden fixed inset-x-0 top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 animate-in slide-in-from-top-5 pt-20">
              <div className="p-4 space-y-1 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4 px-4">
                  <div className="text-sm text-slate-400 flex items-center gap-2">
                    <span>🏗️</span>
                    <span>Construction Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-slate-400 hover:text-white p-2"
                    aria-label="Close construction menu"
                  >
                    ✕
                  </button>
                </div>
                
                {['Services', 'Projects', 'Process', 'Reviews', 'About', 'FAQ'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-emerald-300 hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700"
                  >
                    <span className="text-xl">
                      {item === 'Services' ? '🏗️' : 
                       item === 'Projects' ? '📂' : 
                       item === 'Process' ? '📋' : 
                       item === 'Reviews' ? '⭐' : 
                       item === 'About' ? '👥' : '❓'}
                    </span>
                    <span>{item}</span>
                  </a>
                ))}
                
                {/* Mobile CTA Buttons */}
                <div className="pt-4 px-4 space-y-3 border-t border-slate-800">
                  <button 
                    onClick={() => {
                      setOpenCalculatorModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/50 transition-colors"
                  >
                    <span className="text-xl">💰</span>
                    <span className="font-semibold">Cost Calculator</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSelectedService(null);
                      setOpenHeroModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all"
                  >
                    <span className="text-xl">🔨</span>
                    <span>Construction Consultation</span>
                  </button>
                  
                  <a 
                    href="tel:+16195550123" 
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-300 hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-xl">📞</span>
                    <span className="font-semibold">Call Now: (619) 555-0123</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => { setSelectedService(null); setOpenHeroModal(true); }}
        className="lg:hidden fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-2xl flex items-center justify-center animate-bounce-slow group/fab"
        aria-label="Request Construction Quote"
      >
        <span className="text-xl group-hover/fab:scale-110 transition-transform group-hover/fab:animate-hammer">🔨</span>
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-ping"></span>
      </button>

      <main id="main-content">
        {/* Hero Section with Construction Theme */}
        <section className="relative overflow-hidden border-b border-slate-800 min-h-[90vh] flex items-center pt--100 construction-grid">
          {/* Construction background elements */}
          <div className="absolute top-20 left-10 text-5xl opacity-10 animate-hammer">🔨</div>
          <div className="absolute bottom-20 right-10 text-5xl opacity-10 animate-truck">🏗️</div>
          <div className="absolute top-1/3 left-1/4 text-4xl opacity-10">📐</div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl opacity-10">🧱</div>
          
          {/* Smooth crossfade carousel */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="relative w-full h-full">
              {[
                {
                  src: "https://images.unsplash.com/photo-1542317854-2f0a9f5a1d6a?auto=format&fit=crop&w=2000&q=80",
                  label: "Kitchen Construction"
                },
                {
                  src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80",
                  label: "Bathroom Construction"
                },
                {
                  src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=2000&q=80",
                  label: "Custom Home Construction"
                },
                {
                  src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
                  label: "Microcement Construction"
                },
                {
                  src: "https://images.unsplash.com/photo-1507086182422-97bd7ca2413b?auto=format&fit=crop&w=2000&q=80",
                  label: "Home Addition Construction"
                }
              ].map((image, index) => (
                <div 
                  key={index}
                  className="absolute inset-0 parallax-bg"
                  data-speed="0.5"
                  style={{ 
                    animation: `crossfade 25s infinite ${index * 5}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <img 
                    src={image.src}
                    alt={image.label}
                    className="w-full h-full object-cover brightness-[0.9] transition-transform duration-10000 ease-linear"
                    style={{ animation: `zoomSlow 25s infinite ${index * 5}s ease-in-out` }}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  </div>
              ))}
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-slate-950/40 to-emerald-950/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
          </div>

          {/* Hero container */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="bg-slate-900/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-slate-800/50 shadow-2xl">
              <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
                {/* Left content column */}
                <div>
                  {/* Trust Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs text-slate-300 mb-6">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    <span className="ml-2">🏗️ Trusted San Diego Construction · Licensed & Insured</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                    <span className="block text-slate-50">San Diego's Premier</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Home Builders</span>
                  </h1>

                  <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
                    Specializing in custom homes, whole-house construction, microcement finishes, and home additions. 
                    <strong className="text-emerald-300"> Free on-site construction consultations</strong> with transparent pricing.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                    <button 
                      onClick={() => { setSelectedService(null); setOpenHeroModal(true); }}
                      aria-haspopup="dialog"
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-7 py-4 text-base font-bold text-slate-950 shadow-xl hover:from-emerald-400 hover:to-emerald-500 hover:shadow-2xl transition-all group/cta"
                      aria-label="Request free construction consultation"
                    >
                      <span className="group-hover/cta:animate-hammer">🔨</span>
                      <span className="ml-2">Get Construction Quote</span>
                      <span className="ml-2 group-hover/cta:translate-x-1 transition-transform">→</span>
                    </button>
                    <button 
                      onClick={() => setOpenCalculatorModal(true)}
                      className="inline-flex items-center justify-center rounded-xl border-2 border-slate-700 bg-slate-900/60 px-6 py-3.5 text-base font-semibold text-slate-100 hover:border-emerald-500 hover:text-emerald-300 hover:bg-slate-900/80 transition-all"
                      aria-label="Open construction cost calculator"
                    >
                      <span className="animate-blueprint">💰</span>
                      <span className="ml-2">Construction Calculator</span>
                    </button>
                  </div>

                  {/* Construction Metrics */}
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-300">🏗️</div>
                      <div>
                        <div className="text-sm font-bold text-slate-100">150+ Projects</div>
                        <div className="text-xs text-slate-400">Built in San Diego</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-300">⭐</div>
                      <div>
                        <div className="text-sm font-bold text-slate-100">4.8/5 Rating</div>
                        <div className="text-xs text-slate-400">Construction Satisfaction</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-300">📋</div>
                      <div>
                        <div className="text-sm font-bold text-slate-100">CA License</div>
                        <div className="text-xs text-slate-400">#B-9876543</div>
                      </div>
                    </div>
                  </div>

                  {/* Construction Testimonial */}
                  <div className="border-l-4 border-emerald-500 pl-4 py-2">
                    <p className="text-sm text-slate-300 italic">"They constructed our dream home 3 weeks early and 5% under budget. The construction team was incredible!"</p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <span>🏠</span>
                      <span>— Michael R., Del Mar Construction Client</span>
                    </p>
                  </div>
                </div>

                {/* Right sidebar - Featured Construction Project */}
                <aside className="space-y-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-sm p-5 shadow-2xl">
                    <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span>🏗️</span>
                      <span>Featured Construction</span>
                    </h2>

                    <div className="relative rounded-xl overflow-hidden mb-4">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={slides[currentSlide].src}
                        alt={slides[currentSlide].alt}
                        className="w-full h-64 object-cover rounded-xl transform transition-transform duration-700 ease-out hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                      <div className="absolute left-4 bottom-4 right-4">
                        <div className="bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-lg">
                          <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                            <span>{slides[currentSlide].icon}</span>
                            <span>{slides[currentSlide].title}</span>
                          </div>
                          <div className="text-xs text-emerald-300 mt-1">{slides[currentSlide].caption}</div>
                        </div>
                      </div>
                    </div>

                    {/* Slide Navigation */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {slides.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            aria-label={`View construction project ${i + 1}`}
                            className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                              i === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-slate-500" aria-live="polite">
                        {currentSlide + 1} / {slides.length}
                      </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="mt-4 flex items-center gap-3">
                      {slides.map((s, i) => (
                        <button
                          key={s.src}
                          onClick={() => setCurrentSlide(i)}
                          className={`h-16 w-24 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                            i === currentSlide ? 'border-emerald-400 scale-105' : 'border-slate-800 hover:border-slate-600'
                          }`}
                          aria-label={`View ${s.title}`}
                          aria-current={i === currentSlide ? "true" : "false"}
                        >
                          <img
                            loading="lazy"
                            decoding="async"
                            src={s.src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Construction Contact Card */}
                  <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
                    <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
                      <span>🛠️</span>
                      <span>Need Immediate Construction Help?</span>
                    </h3>
                    <a 
                      href="tel:+16195550123" 
                      className="inline-flex items-center justify-center w-full gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-3 text-sm font-semibold transition mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      aria-label="Call construction team"
                    >
                      <span>📞</span>
                      <span>(619) 555-0123</span>
                    </a>
                    <p className="text-xs text-slate-400 text-center">Call now for emergency repairs or urgent construction consultations</p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Recognition & Trust Section */}
        <section className="py-12 bg-gradient-to-b from-slate-900/50 to-slate-950 border-y border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Industry-Recognized Excellence
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-3">
                Recognized by Leading <span className="text-emerald-300">Industry Authorities</span>
              </h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Our commitment to quality construction has earned us recognition from the most trusted names in the industry
              </p>
            </div>
            
            {/* Trust Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {[
                {
                  name: 'BBB',
                  logo: '🏅',
                  rating: 'A+ Rating',
                  link: 'https://www.bbb.org/us/ca/san-diego/profile/construction/efficient-building-group-123456789',
                  verified: 'Verified Business',
                  years: '15+ Years',
                  color: 'from-blue-500/10 to-blue-600/10',
                  icon: '✅'
                },
                {
                  name: 'Houzz',
                  logo: '🏆',
                  rating: 'Best of Service 2024',
                  link: 'https://www.houzz.com/professionals/general-contractors/efficient-building-group-pfvwus-pf~123456789',
                  verified: '5 Years in a Row',
                  years: 'Top Pro',
                  color: 'from-emerald-500/10 to-emerald-600/10',
                  icon: '⭐'
                },
                {
                  name: 'Google',
                  logo: '⭐',
                  rating: '4.8/5 Stars',
                  link: 'https://g.page/r/Cexample/review',
                  verified: '150+ Reviews',
                  years: 'Top Rated',
                  color: 'from-amber-500/10 to-amber-600/10',
                  icon: '👍'
                },
                {
                  name: 'NARI',
                  logo: '📋',
                  rating: 'Certified Remodeler',
                  link: 'https://www.nari.org/find-a-professional/efficient-building-group',
                  verified: 'Certified Member',
                  years: 'Professional',
                  color: 'from-purple-500/10 to-purple-600/10',
                  icon: '🏅'
                },
                {
                  name: 'HomeAdvisor',
                  logo: '✅',
                  rating: 'Elite Service',
                  link: 'https://www.homeadvisor.com/rated.EfficientBuildingGroup.123456789.html',
                  verified: 'Screened & Approved',
                  years: 'Top Rated',
                  color: 'from-green-500/10 to-green-600/10',
                  icon: '🔧'
                },
                {
                  name: "Angie's List",
                  logo: '🏅',
                  rating: 'Super Service',
                  link: 'https://www.angieslist.com/companylist/us/ca/san-diego/efficient-building-group-reviews-123456789.htm',
                  verified: 'Award Winner',
                  years: '2019-2024',
                  color: 'from-red-500/10 to-red-600/10',
                  icon: '✨'
                }
              ].map((badge, index) => (
                <a
                  key={index}
                  href={badge.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-gradient-to-b ${badge.color} border border-slate-800 rounded-xl p-4 text-center transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1`}
                  aria-label={`View our ${badge.name} ${badge.rating} profile`}
                >
                  <div className="flex flex-col items-center h-full">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {badge.logo}
                    </div>
                    <div className="font-bold text-sm text-slate-100 mb-1">{badge.name}</div>
                    <div className="text-xs text-emerald-300 font-semibold mb-2">{badge.rating}</div>
                    <div className="text-[10px] text-slate-400 mt-auto space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-emerald-400">{badge.icon}</span>
                        <span>{badge.verified}</span>
                      </div>
                      <div className="text-slate-500">{badge.years}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Verification Note */}
            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <div className="text-center">
                <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                  <span className="text-emerald-400">🔍</span>
                  <span>Click any badge to verify our ratings on official platforms</span>
                  <span className="text-emerald-400">✅</span>
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  All ratings are independently verified and updated regularly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Construction Trust Badges Section */}
        <ConstructionTrustBadges />

        {/* Construction Services Section */}
        <section id="services" className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 py-16 md:py-20 relative overflow-hidden">
          {/* Construction background elements */}
          <div className="absolute top-10 right-10 text-4xl opacity-5">🔨</div>
          <div className="absolute bottom-10 left-10 text-4xl opacity-5">🏗️</div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
                Residential Construction Services
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Construction</span> Solutions
              </h2>
              <p className="text-lg text-slate-400">
                Expert construction craftsmanship for San Diego homes. Licensed, insured, and dedicated to building quality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {services.map((s) => (
                <ConstructionServiceCard key={s.id} service={s} onRequest={handleRequestQuote} />
              ))}
            </div>

            {/* Construction CTA */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800/50 border border-slate-700 relative overflow-hidden">
              {/* Blueprint pattern */}
              <div className="absolute inset-0 opacity-5 blueprint-bg"></div>
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                  <button
                    onClick={() => { setSelectedService(null); setOpenHeroModal(true); }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all group"
                  >
                    <span className="group-hover:animate-hammer">🔨</span>
                    <span>Schedule Construction Visit</span>
                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button
                    onClick={() => setOpenCalculatorModal(true)}
                    className="inline-flex items-center gap-3 border-2 border-slate-700 hover:border-emerald-500 text-slate-100 font-semibold px-8 py-4 rounded-full text-lg hover:bg-slate-900/50 transition-all"
                  >
                    <span className="animate-blueprint">💰</span>
                    <span>Construction Calculator</span>
                  </button>
                </div>
                <div className="text-sm text-slate-300 flex flex-wrap items-center justify-center gap-4">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Free 3D Construction Design</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>On-Site Construction Quote</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>No Construction Obligation</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Construction Projects with Enhanced Gallery */}
        <section id="projects" className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 py-16 relative overflow-hidden">
          {/* Construction background elements */}
          <div className="absolute top-5 left-5 text-3xl opacity-5">📐</div>
          <div className="absolute bottom-5 right-5 text-3xl opacity-5">🧱</div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-100">Our <span className="text-emerald-300">Construction</span> Projects</h2>
                <p className="text-slate-400">Filter by construction type to see examples similar to yours.</p>
              </div>
            </div>

            <EnhancedProjectGallery projects={allProjects} onRequestQuote={handleRequestQuote} />
          </div>
        </section>

        {/* Construction Process Section */}
        <ConstructionProcess />

        {/* Why Choose Our Construction */}
        <section id="why" className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 py-16 md:py-20 relative overflow-hidden">
          {/* Construction background elements */}
          <div className="absolute top-20 right-20 text-5xl opacity-5">🏗️</div>
          <div className="absolute bottom-20 left-20 text-5xl opacity-5">🔨</div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100">
                  Why <span className="text-emerald-300">Choose</span> Our Construction?
                </h2>
                <p className="text-lg text-slate-300 mb-8">
                  Local construction expertise, transparent pricing, and craftsmanship that stands the test of time. 
                  We're not just contractors — we're partners in building your dream.
                </p>
                
                <ul className="space-y-6">
                  {[
                    {
                      icon: '🏢',
                      title: 'Licensed Construction',
                      desc: 'CA License #B-9876543 • $2M liability insurance • Worker\'s compensation',
                      color: 'from-blue-500/10 to-blue-600/10'
                    },
                    {
                      icon: '💎',
                      title: 'Transparent Construction Pricing',
                      desc: 'Detailed construction estimates • No hidden fees • Fixed-price contracts',
                      color: 'from-emerald-500/10 to-emerald-600/10'
                    },
                    {
                      icon: '🤝',
                      title: 'Local Construction Trades',
                      desc: 'Vetted local construction crews • Established supplier relationships • Faster timelines',
                      color: 'from-amber-500/10 to-amber-600/10'
                    },
                    {
                      icon: '📋',
                      title: 'Construction Management',
                      desc: 'Dedicated construction manager • Weekly progress reports • Site access',
                      color: 'from-purple-500/10 to-purple-600/10'
                    },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-100 mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80" 
                    alt="Efficient Building Group construction team working on a San Diego construction site"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-slate-950 p-6 rounded-2xl shadow-2xl">
                  <div className="text-3xl font-bold flex items-center gap-2">
                    <span>150+</span>
                    <span>🏗️</span>
                  </div>
                  <div className="text-sm font-semibold">Construction Projects</div>
                  <div className="text-xs opacity-80 mt-1">Since 2010</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Construction Testimonials */}
        <section id="testimonials" className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 py-16 relative overflow-hidden">
          {/* Construction background elements */}
          <div className="absolute top-10 left-10 text-4xl opacity-5">⭐</div>
          <div className="absolute bottom-10 right-10 text-4xl opacity-5">✅</div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
                Construction Client Stories
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-100">
                Building <span className="text-emerald-300">Dreams</span>, Earning Trust
              </h2>
              <p className="text-lg text-slate-400">What San Diego homeowners say about our construction work</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((t, idx) => (
                <ConstructionTestimonialCard key={idx} testimonial={t} />
              ))}
            </div>

            {/* Construction Review Badge */}
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-2xl font-bold text-emerald-300 mb-2 flex items-center gap-2">
                    <span>4.8/5</span>
                    <span>★★★★★</span>
                  </div>
                  <div className="text-sm text-slate-300">Based on 150+ construction client reviews</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Google</div>
                    <div className="text-sm text-emerald-300 flex items-center gap-1">
                      <span>⭐</span>
                      <span>4.9/5</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-700"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Houzz</div>
                    <div className="text-sm text-emerald-300 flex items-center gap-1">
                      <span>🏆</span>
                      <span>Best of 2024</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-700"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">BBB</div>
                    <div className="text-sm text-emerald-300 flex items-center gap-1">
                      <span>✅</span>
                      <span>A+ Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Construction FAQ Section */}
        <section id="faqs" className="border-b border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 py-16 relative overflow-hidden">
          {/* Construction background elements */}
          <div className="absolute top-10 right-10 text-4xl opacity-5">❓</div>
          <div className="absolute bottom-10 left-10 text-4xl opacity-5">📋</div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
                Construction Questions
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-100">
                Construction <span className="text-emerald-300">FAQ</span>
              </h2>
              <p className="text-lg text-slate-400">Answers to common construction questions</p>
            </div>

            <div className="space-y-4">
              {[
                { 
                  q: 'How long does a custom home construction take in San Diego?', 
                  a: 'Custom home construction typically takes 9-14 months from groundbreaking to move-in. This includes 1-2 months for design/permits, 6-8 months for construction, and 1-2 months for finishing. We provide a detailed construction timeline specific to your project during consultation.',
                  icon: '🏗️'
                },
                { 
                  q: 'What construction permits are needed for home additions in San Diego County?', 
                  a: 'We handle all construction permits including building permits, electrical, plumbing, mechanical, and often planning/zoning permits. For ADUs, we also secure ADU-specific permits. Our construction team is experienced with San Diego County, City of San Diego, and all local jurisdiction requirements.',
                  icon: '📋'
                },
                { 
                  q: 'Do you work with architects or have in-house construction design?', 
                  a: 'We offer both options! We have partnered architects we work with regularly, and also provide in-house construction design services for remodels and additions. For custom homes, we typically work with your chosen architect or recommend trusted partners.',
                  icon: '📐'
                },
                { 
                  q: 'What construction materials do you typically use?', 
                  a: 'We use high-quality, durable construction materials appropriate for Southern California climate: concrete foundations, engineered wood framing, energy-efficient windows, metal roofing options, and premium finishes. We provide material selections during design phase.',
                  icon: '🧱'
                },
                { 
                  q: 'How do you handle unexpected issues during construction?', 
                  a: 'We include a 10% contingency in our construction estimates for unforeseen conditions. Any discoveries are immediately communicated with photos and explanation. Change orders are documented transparently before proceeding. We\'ve built relationships with suppliers for quick material sourcing.',
                  icon: '🛠️'
                },
                { 
                  q: 'What construction warranty do you provide?', 
                  a: 'We provide a 2-year construction workmanship warranty on all projects. Materials carry manufacturer warranties (often 10-25 years for major components). We also offer extended warranty options and provide complete warranty documentation at project completion.',
                  icon: '🛡️'
                },
              ].map((f, i) => (
                <div 
                  key={i} 
                  className="rounded-xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left p-5 flex items-center justify-between hover:bg-slate-900/80 transition group"
                    aria-expanded={openFaq === i}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg text-emerald-400">{f.icon}</div>
                      <div className="font-semibold text-lg text-slate-100 pr-8">{f.q}</div>
                    </div>
                    <div className="text-emerald-300 font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {openFaq === i ? '−' : '+'}
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="p-5 pt-0">
                      <div className="text-slate-300 pl-8 border-l-2 border-emerald-500 ml-3">
                        {f.a}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Construction CTA */}
        <section id="contact" className="border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 py-16 md:py-24 relative overflow-hidden">
          {/* Construction elements in background */}
          <div className="absolute inset-0 opacity-5 construction-grid"></div>
          <div className="absolute top-10 left-10 text-5xl opacity-10 animate-hammer">🔨</div>
          <div className="absolute bottom-10 right-10 text-5xl opacity-10 animate-tool">🏗️</div>
          <div className="absolute top-1/2 left-1/4 text-4xl opacity-10">📐</div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl opacity-10">🧱</div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              Free Construction Consultation
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-100">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Build Your Dream</span> Home?
            </h2>
            
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Let's discuss your construction vision. We'll visit your site, review plans, and provide a detailed construction estimate.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <button 
                onClick={() => { setSelectedService(null); setOpenHeroModal(true); }}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all group"
              >
                <span className="group-hover:animate-hammer">🔨</span>
                <span>Schedule Construction Visit</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </button>
              
              <button 
                onClick={() => setOpenCalculatorModal(true)}
                className="inline-flex items-center justify-center gap-3 border-2 border-slate-700 hover:border-emerald-500 text-slate-100 font-semibold px-8 py-4 rounded-full text-lg hover:bg-slate-900/50 transition-all"
              >
                <span className="animate-blueprint">💰</span>
                <span>Construction Calculator</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-400 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-400">🏗️</span>
                <span>Licensed Construction</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-400">📋</span>
                <span>Free 3D Construction Design</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-400">⏱️</span>
                <span>24h Construction Response</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <HeroContactModal 
        open={openHeroModal} 
        onClose={() => setOpenHeroModal(false)} 
        initialService={selectedService} 
      />
      
      <CostCalculatorModal 
        open={openCalculatorModal} 
        onClose={() => setOpenCalculatorModal(false)} 
      />

      {/* Construction Chat Assistant */}
      <ChatAssistant />

      {/* Construction-themed Footer */}
      <footer className="bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-slate-950 font-bold">
                  <span className="animate-hammer">🏗️</span>
                </div>
                <div>
                  <div className="font-bold text-slate-100">Efficient Building Group</div>
                  <div className="text-xs text-slate-400">San Diego Construction Builders</div>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Licensed, insured custom construction builders serving San Diego County since 2010.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Facebook" className="text-slate-400 hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded p-1">f</a>
                <a href="#" aria-label="Instagram" className="text-slate-400 hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded p-1">ig</a>
                <a href="#" aria-label="Houzz" className="text-slate-400 hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded p-1">hz</a>
                <a href="#" aria-label="Google Reviews" className="text-slate-400 hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded p-1">g</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
                <span>🏗️</span>
                <span>Construction Services</span>
              </h3>
              <ul className="space-y-2">
                <li><a href="#services" className="text-sm text-slate-400 hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">Custom Home Construction</a></li>
                <li><a href="#services" className="text-sm text-slate-400 hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">Home Construction Renovations</a></li>
                <li><a href="#services" className="text-sm text-slate-400 hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">Microcement Construction</a></li>
                <li><a href="#services" className="text-sm text-slate-400 hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">Home Addition Construction</a></li>
                <li><a href="#services" className="text-sm text-slate-400 hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">Construction Design & Planning</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
                <span>📍</span>
                <span>Construction Areas</span>
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-slate-400 flex items-center gap-1">🏠 San Diego</li>
                <li className="text-sm text-slate-400 flex items-center gap-1">🌊 La Jolla</li>
                <li className="text-sm text-slate-400 flex items-center gap-1">🏖️ Del Mar</li>
                <li className="text-sm text-slate-400 flex items-center gap-1">🌴 Encinitas</li>
                <li className="text-sm text-slate-400 flex items-center gap-1">🏝️ Carlsbad</li>
                <li className="text-sm text-slate-400 flex items-center gap-1">🗺️ North County</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
                <span>📞</span>
                <span>Construction Contact</span>
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span>📞</span>
                  <a href="tel:+16195550123" className="hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">(619) 555-0123</a>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span>📧</span>
                  <a href="mailto:construction@efficientbuilding.com" className="hover:text-emerald-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">construction@efficientbuilding.com</a>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span>🏢</span>
                  <span>CA Construction License #B-9876543</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <span>⏰</span>
                  <span>Construction Hours: Mon-Fri 8AM-6PM</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span>© {currentYear} Efficient Building Group.</span>
              <span>All construction rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="hover:text-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">Construction Privacy</a>
              <a href="/terms" className="hover:text-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">Construction Terms</a>
              <a href="/sitemap" className="hover:text-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">Construction Sitemap</a>
              <a href="/accessibility" className="hover:text-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded px-1">Construction Access</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}