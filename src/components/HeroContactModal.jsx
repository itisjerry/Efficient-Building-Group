import React, { useEffect, useRef, useState } from "react";

export default function HeroContactModal({ open, onClose, initialService }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const ref = useRef(null);

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
    setFile(e.target.files?.[0] || null);
  }

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { alert("Please enter name and email."); return; }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("email", email);
    payload.append("phone", phone);
    payload.append("projectType", initialService || "General");
    if (file) payload.append("attachment", file);

    console.log("Submit lead", { name, email, phone, projectType: initialService, file: file?.name });
    alert("Thanks — we've received your request. We'll follow up within 24–48 hours.");

    setName(""); setEmail(""); setPhone(""); setFile(null);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-label="Request a quote">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="relative max-w-xl w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-50">Request a quote</h3>
            <div className="text-xs text-slate-400">Quick form — we reply within 24–48 hours.</div>
            {initialService && (
              <div className="mt-2 text-sm text-slate-200">Service: <span className="font-semibold">{initialService}</span></div>
            )}
          </div>

          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-200">✕</button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full bg-slate-800/60 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-slate-800/60 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full bg-slate-800/60 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100" />

            <label className="flex items-center gap-2 text-xs text-slate-400">
              <input type="file" accept="image/*,application/pdf" onChange={handleFile} className="hidden" id="hero-file" />
              <span className="px-3 py-2 rounded bg-slate-800/60 border border-slate-700 text-sm cursor-pointer" onClick={() => document.getElementById("hero-file")?.click()}>
                {file ? file.name : "Attach a photo (optional)"}
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button type="submit" className="px-4 py-2 rounded bg-emerald-500 text-slate-950 font-semibold">Request quote</button>
            <button type="button" onClick={onClose} className="px-3 py-2 rounded border border-slate-800 text-sm">Cancel</button>
          </div>
        </form>

        <div className="mt-4 text-xs text-slate-400">We respect your privacy — your info will only be used to respond about this project.</div>
      </div>
    </div>
  );
}
