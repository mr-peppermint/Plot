import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Candle config ─────────────────────────────── */
const CANDLES = [
  { id: 0, x: 108, color: '#F0A8BE', shine: '#FFE4EE' },
  { id: 1, x: 154, color: '#C4728A', shine: '#F5B8C8' },
  { id: 2, x: 200, color: '#C8B0F0', shine: '#EDD8FF' },
  { id: 3, x: 246, color: '#C4728A', shine: '#F5B8C8' },
  { id: 4, x: 292, color: '#F0A8BE', shine: '#FFE4EE' },
];

const WICK_TOP_Y   = 74;
const CANDLE_TOP_Y = 84;
const CANDLE_BTM_Y = 144;

/* ── Animated Flame ────────────────────────────── */
function Flame({ seed }: { seed: number }) {
  const dur = 0.45 + (seed % 5) * 0.08;
  return (
    <motion.g
      style={{ transformOrigin: '0px 0px' }}
      animate={{
        x: [0, 1.4, -1.2, 0.8, -1.6, 1.0, 0],
        scaleX: [1, 1.10, 0.84, 1.14, 0.88, 1.06, 1],
        scaleY: [1, 0.95, 1.07, 0.91, 1.05, 0.97, 1],
      }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: seed * 0.09 }}
    >
      <ellipse cx="0" cy="-16" rx="11" ry="18" fill="rgba(255,110,0,0.18)" />
      <ellipse cx="0" cy="-12" rx="7"  ry="12" fill="rgba(255,180,0,0.22)" />
      <path d="M0,0 C-7,-11 -11,-26 0,-40 C11,-26 7,-11 0,0 Z" fill="url(#fl_outer)" />
      <path d="M0,-2 C-4,-12 -6,-22 0,-30 C6,-22 4,-12 0,-2 Z" fill="url(#fl_mid)" />
      <path d="M0,-2 C-2,-9 -3,-17 0,-23 C3,-17 2,-9 0,-2 Z" fill="rgba(255,252,180,0.95)" />
      <ellipse cx="0" cy="-24" rx="1.8" ry="2.8" fill="rgba(255,255,240,1)" />
    </motion.g>
  );
}

/* ── Smoke puff after blow ─────────────────────── */
function SmokePuff({ cx }: { cx: number }) {
  const puffs = [
    { dx: 0,  sz: 2,   delay: 0    },
    { dx: -4, sz: 2.5, delay: 0.12 },
    { dx: 4,  sz: 2.2, delay: 0.22 },
    { dx: -2, sz: 3,   delay: 0.36 },
    { dx: 3,  sz: 2.4, delay: 0.48 },
  ];
  return (
    <>
      {puffs.map((p, i) => (
        <motion.ellipse
          key={i}
          cx={cx + p.dx}
          cy={WICK_TOP_Y}
          rx={p.sz}
          ry={p.sz * 0.65}
          fill="rgba(200,175,185,0.65)"
          animate={{ y: -60, opacity: 0, scaleX: 4, scaleY: 3 }}
          transition={{ duration: 1.4, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

/* ── Sparkle burst on blow ─────────────────────── */
function SparkBurst({ cx }: { cx: number }) {
  const SPARKS = [
    { angle: 0,   r: 30, color: '#FFD6E4' },
    { angle: 50,  r: 24, color: '#C4728A' },
    { angle: 100, r: 32, color: '#B89CD8' },
    { angle: 160, r: 26, color: '#F0A8BE' },
    { angle: 220, r: 28, color: '#FFD6E4' },
    { angle: 280, r: 22, color: '#C4728A' },
    { angle: 330, r: 30, color: '#B89CD8' },
  ];
  return (
    <>
      {SPARKS.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={WICK_TOP_Y - 10}
            r={3}
            fill={s.color}
            animate={{
              x: s.r * Math.cos(rad),
              y: s.r * Math.sin(rad),
              opacity: 0,
              scale: 0.4,
            }}
            transition={{ duration: 0.55, delay: i * 0.03, ease: 'easeOut' }}
          />
        );
      })}
    </>
  );
}

/* ── Confetti burst ─────────────────────────────── */
function ConfettiBurst() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: ['#F0A8BE','#C4728A','#B89CD8','#F5D0DC','#FFD6E4','#9B7FC8'][i % 6],
    x: 30 + Math.random() * 40,
    vx: (Math.random() - 0.5) * 300,
    vy: -(180 + Math.random() * 220),
    rot: Math.random() * 720,
    shape: i % 3,
    delay: Math.random() * 0.3,
  }));
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: '55%' }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.vx, y: p.vy, opacity: 0, rotate: p.rot }}
          transition={{ duration: 1.6 + p.delay, delay: p.delay, ease: [0.2, 0.8, 0.4, 1] }}
        >
          {p.shape === 0 && <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />}
          {p.shape === 1 && <div style={{ width: 12, height: 5, background: p.color }} />}
          {p.shape === 2 && (
            <svg width="10" height="9" viewBox="0 0 20 18">
              <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" fill={p.color} />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ── Main component ────────────────────────────── */
export function IntroLock({ onUnlocked, onMusicReady }: {
  onUnlocked: () => void;
  onMusicReady?: (stopFn: () => void) => void;
}) {
  const [blown, setBlown]       = useState<boolean[]>(CANDLES.map(() => false));
  const [smokeIds, setSmokeIds] = useState<number[]>([]);
  const [sparkIds, setSparkIds] = useState<number[]>([]);
  const [phase, setPhase]       = useState<'active' | 'allBlown' | 'exit'>('active');
  const [muted, setMuted]       = useState(false);
  const doneRef                 = useRef(false);
  const audioRef                = useRef<HTMLAudioElement | null>(null);
  const mutedRef                = useRef(false);
  const fadeTimerRef            = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Fade utilities ── */
  const clearFade = () => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const fadeIn = (audio: HTMLAudioElement, targetVol = 0.5, durationMs = 3000) => {
    clearFade();
    audio.volume = 0;
    const steps    = 80;
    const stepTime = durationMs / steps;
    const stepVol  = targetVol / steps;
    fadeTimerRef.current = setInterval(() => {
      if (!audio) { clearFade(); return; }
      const next = Math.min(audio.volume + stepVol, targetVol);
      audio.volume = next;
      if (next >= targetVol) clearFade();
    }, stepTime);
  };

  const fadeOut = (audio: HTMLAudioElement, durationMs = 1800) => {
    clearFade();
    const startVol = audio.volume;
    const steps    = 80;
    const stepTime = durationMs / steps;
    const stepVol  = startVol / steps;
    fadeTimerRef.current = setInterval(() => {
      if (!audio) { clearFade(); return; }
      const next = Math.max(audio.volume - stepVol, 0);
      audio.volume = next;
      if (next <= 0) {
        clearFade();
        audio.pause();
      }
    }, stepTime);
  };

  /* ── Boot audio ── */
  useEffect(() => {
    // 🎵 Place your music file at: artifacts/birthday-site/public/music.mp3
    const audio = new Audio(import.meta.env.BASE_URL + 'music.mp3');
    audio.loop   = true;
    audio.volume = 0;
    audioRef.current = audio;

    const start = () => {
      audio.play()
        .then(() => fadeIn(audio, 0.5, 3000))
        .catch(() => {
          // Autoplay blocked on mobile — wait for first tap
        });
    };

    // Try immediately (works on desktop)
    start();

    // Retry on first user interaction (required on mobile)
    const onFirstTouch = () => {
      if (audio.paused) start();
    };
    document.addEventListener('pointerdown', onFirstTouch, { once: true });

    // Give App.tsx a handle to stop the music later from the main page
    const stopFn = () => {
      if (audioRef.current) fadeOut(audioRef.current, 1800);
    };
    onMusicReady?.(stopFn);

    return () => {
      document.removeEventListener('pointerdown', onFirstTouch);
      clearFade();
      // ✅ Do NOT stop music here — it continues playing on the main page
    };
  }, []);

  /* ── Mute / unmute ── */
  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (audioRef.current) {
      // Smooth volume ramp instead of hard cut
      const target = mutedRef.current ? 0 : 0.5;
      const audio  = audioRef.current;
      clearFade();
      const steps    = 20;
      const stepTime = 150 / steps;
      const diff     = (target - audio.volume) / steps;
      fadeTimerRef.current = setInterval(() => {
        const next = Math.min(Math.max(audio.volume + diff, 0), 0.5);
        audio.volume = next;
        if (next === target || (diff > 0 && next >= target) || (diff < 0 && next <= target)) {
          clearFade();
        }
      }, stepTime);
    }
  }, []);

  /* ── Blow a candle ── */
  const blowCandle = useCallback((id: number) => {
    if (blown[id] || phase !== 'active') return;

    setSmokeIds(p => [...p, id]);
    setSparkIds(p => [...p, id]);
    setTimeout(() => setSmokeIds(p => p.filter(x => x !== id)), 2000);
    setTimeout(() => setSparkIds(p => p.filter(x => x !== id)), 800);

    setBlown(prev => {
      const next = [...prev];
      next[id] = true;
      if (next.every(Boolean) && !doneRef.current) {
        doneRef.current = true;
        setTimeout(() => setPhase('allBlown'), 300);
        setTimeout(() => { if (audioRef.current) fadeOut(audioRef.current, 2000); }, 1400);
        setTimeout(() => setPhase('exit'), 2800);
        setTimeout(() => onUnlocked(), 4600);
      }
      return next;
    });
  }, [blown, phase, onUnlocked]);

  const blownCount = blown.filter(Boolean).length;

  return (
    <AnimatePresence mode="wait">
      {phase !== 'exit' && (
        <motion.div
          key="cake-intro"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, #220A18 0%, #100508 55%, #050203 100%)',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
        >

          {/* Mute button */}
          <motion.button
            onClick={toggleMute}
            className="absolute top-4 right-4 z-20 flex items-center justify-center rounded-full w-9 h-9"
            style={{
              background: 'rgba(196,114,138,0.15)',
              border: '1px solid rgba(196,114,138,0.3)',
              color: 'rgba(240,168,190,0.8)',
              fontSize: 16,
            }}
            whileHover={{ scale: 1.12, background: 'rgba(196,114,138,0.25)' }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🎵'}
          </motion.button>

          {/* Star field */}
          {Array.from({ length: 55 }, (_, i) => (
            <motion.div key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 1 + (i % 3) * 0.8,
                height: 1 + (i % 3) * 0.8,
                left: `${(i * 13.7) % 100}%`,
                top: `${(i * 17.3) % 100}%`,
                background: ['rgba(240,168,190,','rgba(196,114,138,','rgba(184,156,216,'][i % 3]
                  + `${0.25 + (i % 4) * 0.12})`,
              }}
              animate={{ opacity: [0.1, 0.85, 0.1] }}
              transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i * 0.18) % 5 }}
            />
          ))}

          {/* Floating hearts */}
          {[15, 35, 65, 82].map((left, i) => (
            <motion.div key={i}
              className="absolute pointer-events-none text-lg"
              style={{ left: `${left}%`, top: `${20 + i * 15}%`, opacity: 0.18 }}
              animate={{ y: [0, -16, 0], opacity: [0.14, 0.28, 0.14] }}
              transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.5 }}
            >
              ♥
            </motion.div>
          ))}

          {/* Cake SVG */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.82, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 'min(400px, 92vw)' }}
          >
            <svg viewBox="0 0 400 440" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                {/* Flame gradients */}
                <linearGradient id="fl_outer" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%"   stopColor="#FF5500" />
                  <stop offset="45%"  stopColor="#FF8C00" />
                  <stop offset="80%"  stopColor="#FFC400" />
                  <stop offset="100%" stopColor="#FFF0A0" />
                </linearGradient>
                <linearGradient id="fl_mid" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%"   stopColor="#FF7700" />
                  <stop offset="50%"  stopColor="#FFBB00" />
                  <stop offset="100%" stopColor="#FFF4B0" />
                </linearGradient>

                {/* Bottom tier — rich deep rose, lit warmly at top by candles */}
                <linearGradient id="t1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#C86882" />
                  <stop offset="30%"  stopColor="#A85870" />
                  <stop offset="70%"  stopColor="#883858" />
                  <stop offset="100%" stopColor="#5E2038" />
                </linearGradient>
                {/* Top tier — slightly lighter rose plum */}
                <linearGradient id="t2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#E090B0" />
                  <stop offset="28%"  stopColor="#C87095" />
                  <stop offset="68%"  stopColor="#A04870" />
                  <stop offset="100%" stopColor="#78304C" />
                </linearGradient>
                {/* Left-side shadow for 3D depth */}
                <linearGradient id="sideL" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="rgba(0,0,0,0.38)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
                {/* Right-side ambient highlight */}
                <linearGradient id="sideR" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%"   stopColor="rgba(255,190,210,0.1)" />
                  <stop offset="100%" stopColor="rgba(255,190,210,0)" />
                </linearGradient>
                {/* Frosting — cream white */}
                <linearGradient id="frost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#FFFCFA" />
                  <stop offset="100%" stopColor="#F9D8E4" />
                </linearGradient>
                {/* Plate */}
                <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3A1520" />
                  <stop offset="100%" stopColor="#1A0810" />
                </linearGradient>
                {/* Candle light pool on tier top surface */}
                <radialGradient id="candlePool" cx="50%" cy="0%" r="90%" fx="50%" fy="0%">
                  <stop offset="0%"   stopColor="rgba(255,155,30,0.28)" />
                  <stop offset="55%"  stopColor="rgba(255,110,10,0.10)" />
                  <stop offset="100%" stopColor="rgba(255,80,0,0)" />
                </radialGradient>

                {/* Drop shadow for tiers */}
                <filter id="shadow" x="-20%" y="-20%" width="150%" height="160%">
                  <feDropShadow dx="0" dy="9" stdDeviation="13" floodColor="rgba(0,0,0,0.65)" />
                </filter>
                {/* Candle body shadow */}
                <filter id="candleShadow">
                  <feDropShadow dx="1" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.45)" />
                </filter>
                {/* Flame bloom */}
                <filter id="flameGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                {/* Soft inner glow for text */}
                <filter id="textGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* ── Ground cast shadow ── */}
              <ellipse cx="200" cy="318" rx="192" ry="16" fill="rgba(0,0,0,0.4)" />

              {/* ── Cake Plate ── */}
              <rect x="5"  y="304" width="390" height="14" rx="7" fill="url(#plate)" />
              <rect x="5"  y="304" width="390" height="3"  rx="3" fill="rgba(255,180,200,0.12)" />
              <rect x="20" y="310" width="360" height="4"  rx="2" fill="rgba(0,0,0,0.25)" />

              {/* ══ BOTTOM TIER ══════════════════════════ */}
              {/* Main body */}
              <rect x="14" y="220" width="372" height="84" rx="15" fill="url(#t1)" filter="url(#shadow)" />
              {/* Top-edge gloss highlight */}
              <rect x="14" y="220" width="372" height="8"  rx="6"  fill="rgba(255,205,225,0.30)" />
              {/* Left-side shadow (3-D depth) */}
              <rect x="14" y="220" width="28"  height="84" rx="5"  fill="url(#sideL)" />
              {/* Right-side ambient highlight */}
              <rect x="358" y="220" width="28" height="84" rx="5"  fill="url(#sideR)" />
              {/* Bottom shadow edge */}
              <rect x="18" y="295" width="364" height="9"  rx="4"  fill="rgba(0,0,0,0.30)" />

              {/* Bottom tier frosting drips */}
              {[38,72,108,145,182,218,255,292,330,366].map((x, i) => {
                const h = 10 + [6,12,8,14,6,10,14,8,12,6][i];
                return (
                  <g key={x}>
                    <rect x={x-9} y={218} width={18} height={h+4} rx={9} fill="url(#frost)" />
                    <ellipse cx={x} cy={218+h+4} rx={9} ry={6.5} fill="url(#frost)" />
                    <circle  cx={x-2} cy={220} r={2.8} fill="rgba(255,255,255,0.6)" />
                  </g>
                );
              })}
              {/* Bottom pearl row along top edge */}
              {Array.from({ length: 17 }, (_, i) => (
                <circle key={i} cx={32 + i * 20} cy={222} r={5}
                  fill="url(#frost)"
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.28))' }} />
              ))}
              {/* Bottom tier polka dots */}
              {[55,105,155,200,248,298,348].map((x, i) => (
                <circle key={x} cx={x} cy={260} r={4.5}
                  fill={i%2===0 ? 'rgba(255,210,228,0.70)' : 'rgba(210,182,244,0.70)'} />
              ))}
              {/* Tier decorative symbols */}
              {[82,182,282,372].map(x => (
                <text key={x} x={x} y={278} textAnchor="middle" fontSize="12" fill="rgba(255,220,232,0.45)">★</text>
              ))}
              {[132,232,322].map(x => (
                <text key={x} x={x} y={277} textAnchor="middle" fontSize="11" fill="rgba(255,200,220,0.55)">♥</text>
              ))}

              {/* ══ TOP TIER ══════════════════════════ */}
              {/* Main body */}
              <rect x="68" y="144" width="264" height="76" rx="12" fill="url(#t2)" filter="url(#shadow)" />
              {/* Top-edge gloss highlight */}
              <rect x="68" y="144" width="264" height="7"  rx="5"  fill="rgba(255,220,238,0.32)" />
              {/* Left-side shadow (3-D depth) */}
              <rect x="68" y="144" width="22"  height="76" rx="4"  fill="url(#sideL)" />
              {/* Right-side ambient highlight */}
              <rect x="310" y="144" width="22" height="76" rx="4"  fill="url(#sideR)" />
              {/* Bottom shadow edge */}
              <rect x="72"  y="211" width="256" height="9"  rx="4"  fill="rgba(0,0,0,0.26)" />

              {/* ── Animated candle-light glow pools on top tier surface ── */}
              {CANDLES.map(c => !blown[c.id] && (
                <motion.ellipse
                  key={`pool-${c.id}`}
                  cx={c.x} cy={144} rx={38} ry={9}
                  fill="url(#candlePool)"
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: [0.35, 0.9, 0.35] }}
                  transition={{ duration: 0.62 + c.id * 0.09, repeat: Infinity, ease: 'easeInOut', delay: c.id * 0.11 }}
                />
              ))}
              {/* Combined warm wash across whole top surface when ≥1 candle lit */}
              {blown.filter(Boolean).length < CANDLES.length && (
                <motion.rect
                  x="68" y="144" width="264" height="24" rx="4"
                  fill="rgba(255,130,20,0.08)"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Top tier frosting drips */}
              {[88,118,150,182,218,254,286,318].map((x, i) => {
                const h = 8 + [5,10,7,12,6,9,11,7][i];
                return (
                  <g key={x}>
                    <rect x={x-8} y={142} width={16} height={h+3} rx={8} fill="url(#frost)" />
                    <ellipse cx={x} cy={142+h+3} rx={8} ry={5.5} fill="url(#frost)" />
                    <circle  cx={x-2} cy={143} r={2.2} fill="rgba(255,255,255,0.65)" />
                  </g>
                );
              })}
              {/* Top pearl row */}
              {Array.from({ length: 9 }, (_, i) => (
                <circle key={i} cx={86 + i * 26} cy={146} r={4.5}
                  fill="url(#frost)"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.22))' }} />
              ))}
              {/* Top tier polka dots */}
              {[104,152,200,248,296].map((x, i) => (
                <circle key={x} cx={x} cy={183} r={3.5}
                  fill={i%2===0 ? 'rgba(255,210,228,0.65)' : 'rgba(200,175,242,0.65)'} />
              ))}

              {/* "Angel" script on top tier */}
              <text x="200" y="197" textAnchor="middle"
                fontFamily="'Sacramento', cursive" fontSize="38"
                fill="rgba(255,234,244,0.78)"
                filter="url(#textGlow)"
                style={{ userSelect: 'none' }}>
                Angel
              </text>

              {/* ══ CANDLES ══════════════════════════ */}
              {CANDLES.map(c => {
                const isBlown = blown[c.id];
                return (
                  <g key={c.id} onClick={() => blowCandle(c.id)}
                    style={{ cursor: isBlown ? 'default' : 'pointer' }}>
                    {/* Wide tap target */}
                    <rect x={c.x-26} y={20} width={52} height={130} fill="transparent" />
                    {/* Candle body */}
                    <rect x={c.x-8} y={CANDLE_TOP_Y} width={16}
                      height={CANDLE_BTM_Y - CANDLE_TOP_Y}
                      rx={5} fill={c.color} filter="url(#candleShadow)" />
                    {/* Highlight stripe */}
                    <rect x={c.x-5} y={CANDLE_TOP_Y+5} width={3.5}
                      height={CANDLE_BTM_Y - CANDLE_TOP_Y - 14} rx={1.75}
                      fill="rgba(255,255,255,0.28)" />
                    {/* Base shine */}
                    <ellipse cx={c.x} cy={CANDLE_BTM_Y} rx={9} ry={3.5}
                      fill={c.shine} opacity={0.38} />
                    {/* Wick */}
                    <line x1={c.x} y1={CANDLE_TOP_Y} x2={c.x} y2={WICK_TOP_Y}
                      stroke="#3A1825" strokeWidth={2.2} strokeLinecap="round" />
                    {/* Ember / char */}
                    <circle cx={c.x} cy={WICK_TOP_Y} r={2.5}
                      fill={isBlown ? '#3A1825' : '#FF6000'}
                      style={{ filter: isBlown ? 'none' : 'drop-shadow(0 0 5px rgba(255,140,0,1))' }} />
                    {/* Warm halo on candle body when burning */}
                    {!isBlown && (
                      <motion.ellipse cx={c.x} cy={CANDLE_TOP_Y + 8} rx={9} ry={6}
                        animate={{ opacity: [0.18, 0.38, 0.18] }}
                        transition={{ duration: 0.55 + c.id * 0.07, repeat: Infinity }}
                        fill="rgba(255,160,40,0.35)" />
                    )}
                    {/* Flame */}
                    {!isBlown && (
                      <g transform={`translate(${c.x}, ${WICK_TOP_Y})`} filter="url(#flameGlow)">
                        <Flame seed={c.id} />
                      </g>
                    )}
                    {smokeIds.includes(c.id) && <SmokePuff cx={c.x} />}
                    {sparkIds.includes(c.id) && <SparkBurst cx={c.x} />}
                    {isBlown && (
                      <motion.circle cx={c.x} cy={WICK_TOP_Y} r={7}
                        fill="none" stroke="rgba(196,114,138,0.3)" strokeWidth={1}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 0.5 }} />
                    )}
                  </g>
                );
              })}

              {/* ── Texts below cake ── */}
              <text x="200" y="362" textAnchor="middle"
                fontFamily="'Sacramento', cursive" fontSize="36"
                fill="rgba(240,168,190,0.75)"
                style={{ userSelect: 'none' }}>
                Happy 18th!
              </text>
              <text x="200" y="400" textAnchor="middle"
                fontFamily="'Inter', sans-serif" fontSize="12.5"
                fill="rgba(196,114,138,0.52)"
                style={{ userSelect: 'none' }}>
                How Did You Think I Would Forget?
              </text>
              {/* Decorative hearts */}
              {[-28,-10,10,28].map((dx, i) => (
                <text key={i} x={200+dx} y={428} textAnchor="middle" fontSize="9"
                  fill={`rgba(196,114,138,${i===1||i===2 ? 0.55 : 0.28})`}
                  style={{ userSelect: 'none' }}>♥</text>
              ))}
            </svg>
          </motion.div>

          <AnimatePresence>
            {phase === 'allBlown' && <ConfettiBurst />}
          </AnimatePresence>

          {blownCount === 0 && (
            <motion.div
              className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ color: 'rgba(196,114,138,0.5)', fontSize: 20 }}
              >
                ↑
              </motion.div>
              <p className="font-sans text-[10px] tracking-[0.3em] uppercase"
                style={{ color: 'rgba(196,114,138,0.4)' }}>
                tap the flames
              </p>
            </motion.div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  );
}
