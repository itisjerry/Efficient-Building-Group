import React from "react";

export default function ServiceCard({ service, onRequest }) {
  return (
    <article
      role="article"
      aria-labelledby={`svc-${service.id}-title`}
      className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onRequest(service.title); }}
    >
      <div className="h-40 w-full relative bg-slate-800">
        <img
          src={service.img}
          srcSet={`${service.img}?w=600 600w, ${service.img}?w=900 900w, ${service.img}?w=1200 1200w`}
          sizes="(max-width:640px) 100vw, 33vw"
          loading="lazy"
          alt={service.alt || service.title}
          className="object-cover w-full h-full"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1505692794409-8c0b1f6d9f8b?auto=format&fit=crop&w=1200&q=80'; }}
        />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-300 text-lg">{service.icon}</div>
          <div>
            <h4 id={`svc-${service.id}-title`} className="text-lg font-semibold text-slate-50">{service.title}</h4>
            <div className="text-xs text-slate-400 mt-0.5">{service.price} • {service.timeline}</div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4">{service.desc}</p>

        <div className="flex items-center justify-between">
          <button onClick={() => onRequest(service.title)} aria-haspopup="dialog" className="text-sm font-semibold text-emerald-400">Request quote</button>
          <a href={`#projects?filter=${service.slug}`} className="text-xs text-slate-500">View gallery</a>
        </div>
      </div>
    </article>
  );
}
