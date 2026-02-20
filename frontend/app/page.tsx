'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { t as translations } from '@/lib/translations';
import { LanguageSelector } from '@/components/LanguageSelector';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { Stethoscope, Leaf, Users } from 'lucide-react';

// ─── Niche data ──────────────────────────────────────────────────────────────
const COMING_SOON_NICHES = [
  { id: 'cattle', icon: '🐄', label: 'Cattle Farming' },
  { id: 'poultry', icon: '🐔', label: 'Poultry' },
  { id: 'fish', icon: '🐟', label: 'Fisheries' },
  { id: 'silk', icon: '🦋', label: 'Sericulture' },
  { id: 'bees', icon: '🐝', label: 'Beekeeping' },
  { id: 'organic', icon: '🌿', label: 'Organic Farming' },
];

// ─── Orbital ring of coming-soon niches ──────────────────────────────────────
function OrbitalRing() {
  const count = COMING_SOON_NICHES.length;
  const radius = 210; // px  ← orbit radius

  return (
    <div className="relative mx-auto" style={{ width: `${radius * 2 + 120}px`, height: `${radius * 2 + 120}px` }}>
      {/* Orbit path ring (decorative) */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: '1.5px dashed rgba(16,163,74,0.25)',
          top: '60px', left: '60px',
          width: `${radius * 2}px`, height: `${radius * 2}px`,
        }}
      />

      {/* Centre label */}
      <div
        className="absolute flex flex-col items-center justify-center rounded-full text-center z-10"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '120px', height: '120px',
          background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
          border: '2px solid rgba(22,163,74,0.3)',
          boxShadow: '0 0 20px rgba(22,163,74,0.12)',
        }}
      >
        <span className="text-3xl">🌾</span>
        <span className="text-xs font-bold text-emerald-700 mt-1 leading-tight">More<br />Coming</span>
      </div>

      {/* Rotating ring container — clockwise */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          animation: 'orbit-clockwise 28s linear infinite',
          transformOrigin: '50% 50%',
        }}
      >
        {COMING_SOON_NICHES.map((niche, i) => {
          const angleDeg = (360 / count) * i - 90; // start top
          const angleRad = (angleDeg * Math.PI) / 180;
          const cx = radius * Math.cos(angleRad);
          const cy = radius * Math.sin(angleRad);
          const cardSize = 110;

          return (
            <div
              key={niche.id}
              style={{
                position: 'absolute',
                top: `calc(50% + ${cy}px - ${cardSize / 2}px)`,
                left: `calc(50% + ${cx}px - ${cardSize / 2}px)`,
                width: `${cardSize}px`,
                height: `${cardSize}px`,
                // Counter-rotate so card text stays upright
                animation: 'orbit-counter 28s linear infinite',
                transformOrigin: '50% 50%',
              }}
            >
              <div
                className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1 cursor-not-allowed select-none"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border: '1.5px solid rgba(22,163,74,0.2)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                {/* Lock badge */}
                <span
                  className="absolute -top-3 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ background: '#374151', color: '#fff' }}
                >
                  🔒 Soon
                </span>
                <span className="text-2xl grayscale opacity-60 mt-1">{niche.icon}</span>
                <p
                  className="text-xs font-semibold text-center leading-tight"
                  style={{ color: '#6b7280', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {niche.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── NicheSelector – rendered after scroll expansion ─────────────────────────
function NicheSelector() {
  const [selected, setSelected] = useState<string | null>(null);
  const [waitlistNiche, setWaitlistNiche] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistDone, setWaitlistDone] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang];

  function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setWaitlistDone(true);
    setTimeout(() => { setWaitlistNiche(null); setWaitlistDone(false); setWaitlistEmail(''); }, 2500);
  }

  return (
    <div className="w-full max-w-6xl mx-auto">

      {/* ── Section heading ─────────────────────────────────────────────── */}
      <div className="text-center mb-16">
        <h2
          className="font-black tracking-tight text-gray-900 mb-4"
          style={{ fontFamily: "'DM Sans','Inter',sans-serif", fontSize: 'clamp(3rem,6vw,5rem)' }}
        >
          What do you farm?
        </h2>
        <p className="text-gray-500" style={{ fontSize: 'clamp(1.15rem,2.5vw,1.5rem)' }}>We&apos;ll personalize your entire experience around you</p>
      </div>

      {/* ── Active niche card ───────────────────────────────────────────── */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => setSelected(selected === 'crop' ? null : 'crop')}
          className={`
            group relative flex flex-col items-center gap-5 p-10 w-80 rounded-3xl
            border-2 transition-all duration-300 cursor-pointer
            ${selected === 'crop'
              ? 'border-emerald-500 bg-emerald-50 shadow-2xl shadow-emerald-200 scale-105'
              : 'border-gray-200 bg-white hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-100'}
          `}
        >
          {selected === 'crop' && (
            <span className="absolute top-4 right-4 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</span>
          )}
          <span
            className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl transition-all
              ${selected === 'crop' ? 'bg-emerald-500 shadow-lg shadow-emerald-300' : 'bg-emerald-100 group-hover:bg-emerald-200'}`}
          >🌾</span>
          <div className="text-center">
            <span className={`text-3xl font-bold mb-1 ${selected === 'crop' ? 'text-emerald-700' : 'text-gray-900'}`}
              style={{ fontFamily: "'DM Sans',sans-serif" }}>
              Crop Farming
            </span>
            <p className={`text-lg font-medium ${selected === 'crop' ? 'text-emerald-600' : 'text-gray-500'}`}>
              AI Diagnosis + Disease Detection
            </p>
          </div>
          <span className={`text-sm font-semibold px-4 py-1.5 rounded-full
            ${selected === 'crop' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'}`}>
            ✦ Available Now
          </span>
        </button>
      </div>

      {/* CTA */}
      {selected === 'crop' && (
        <div className="flex justify-center mb-14">
          <a href="/auth"
            className="inline-flex items-center gap-3 px-14 py-6 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 active:scale-95 shadow-xl shadow-emerald-300 transition-all duration-200"
            style={{ fontSize: 'clamp(1.2rem,2.5vw,1.5rem)' }}>
            Continue with Crop Farming <span>→</span>
          </a>
        </div>
      )}

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-14 max-w-2xl mx-auto">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
        <p className="text-gray-400 text-sm font-semibold tracking-widest uppercase">More niches — coming soon</p>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
      </div>

      {/* ── ORBITAL RING (clockwise) ─────────────────────────────────────── */}
      <div className="flex justify-center mb-6">
        <OrbitalRing />
      </div>

      {/* ── Feature highlights ───────────────────────────────────────────── */}
      <div className="mt-20 grid md:grid-cols-3 gap-8">
        {[
          { icon: Stethoscope, title: t.aiDoctorTitle, desc: t.aiDoctorDesc },
          { icon: Leaf, title: t.diseaseScannerTitle, desc: t.diseaseScannerDesc },
          { icon: Users, title: t.collectiveTitle, desc: t.collectiveDesc },
        ].map((f, i) => (
          <div key={i} className="neon-card p-8 group cursor-default">
            <f.icon className="h-13 w-13 mb-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <h3 className="font-black text-gray-900 mb-3" style={{ fontSize: 'clamp(1.2rem,2vw,1.65rem)' }}>{f.title}</h3>
            <p className="text-gray-500 leading-relaxed" style={{ fontSize: 'clamp(1rem,1.5vw,1.15rem)' }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Waitlist banner ─────────────────────────────────────────────── */}
      <div className="mt-16 mx-auto max-w-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border border-emerald-200 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-700 font-bold text-xl text-center sm:text-left">
          🚀 More niches launching in 2026 — be first to know
        </p>
        <button onClick={() => setWaitlistNiche('general')}
          className="shrink-0 px-10 py-4 rounded-xl bg-emerald-600 text-white font-black text-lg hover:bg-emerald-700 transition-colors">
          Join Waitlist
        </button>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t mt-16 pt-10 pb-6" style={{ borderColor: 'rgba(22,163,74,0.15)' }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-base text-gray-400">
          <p className="text-lg">{t.madeWith} ❤️</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-600 transition-colors font-medium">{t.privacy}</a>
            <a href="#" className="hover:text-emerald-600 transition-colors font-medium">GitHub</a>
          </div>
          <p>4C: Collective Intelligence Farming Network</p>
        </div>
      </footer>

      {/* ── Waitlist modal ──────────────────────────────────────────────── */}
      {waitlistNiche && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setWaitlistNiche(null)}>
          <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            {!waitlistDone ? (
              <>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Join the Waitlist 🌱</h3>
                <p className="text-gray-500 mb-6">We&apos;ll notify you the moment your niche goes live.</p>
                <form onSubmit={handleWaitlist} className="flex flex-col gap-4">
                  <input type="email" required value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none"
                    style={{ background: 'white', color: '#111', borderColor: '#e5e7eb' }} />
                  <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors">
                    Notify Me
                  </button>
                </form>
                <button onClick={() => setWaitlistNiche(null)} className="mt-4 w-full text-center text-gray-400 text-sm hover:text-gray-600">
                  Cancel
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-black text-emerald-700 mb-2">You&apos;re on the list!</h3>
                <p className="text-gray-500">We&apos;ll let you know as soon as it launches.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HeroPage() {
  return (
    <>
      {/* ── Glass Nav (floats over hero image) ────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌿</span>
          <span
            className="text-white font-black tracking-tight"
            style={{ fontFamily: "'DM Sans','Inter',sans-serif", textShadow: '0 2px 8px rgba(0,0,0,0.5)', fontSize: 'clamp(1.4rem,2.5vw,1.9rem)' }}
          >
            Agriculture Doctor
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <a href="/auth" className="text-white/90 text-base font-semibold px-4 py-2 rounded-xl hover:bg-white/20 transition-colors">
            Login
          </a>
          <a href="/auth"
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-base font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-105">
            Get Started
          </a>
        </div>
      </nav>

      {/* ── Original ScrollExpand Hero ──────────────────────────────────── */}
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="https://videos.pexels.com/video-files/4813946/4813946-uhd_2560_1440_25fps.mp4"
        posterSrc="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1280&auto=format&fit=crop"
        bgImageSrc="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920&auto=format&fit=crop"
        title="Agriculture Doctor"
        date="🌾 AI-Powered Farming Intelligence"
        scrollToExpand="Scroll to explore →"
        textBlend
      >
        {/* ── After scroll expansion: clean white-green NicheSelector ── */}
        <div
          className="min-h-screen w-full py-24 px-4"
          style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #ffffff 45%, #ecfdf5 100%)' }}
        >
          <NicheSelector />
        </div>
      </ScrollExpandMedia>
    </>
  );
}
