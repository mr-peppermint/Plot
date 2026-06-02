import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Candle config — ST palette ─────────────────── */
const CANDLES = [
  { id: 0, x: 108, color: '#FF4444', shine: '#FF9999' },
  { id: 1, x: 154, color: '#4488FF', shine: '#99BBFF' },
  { id: 2, x: 200, color: '#E8A020', shine: '#FFD880' },
  { id: 3, x: 246, color: '#44CC66', shine: '#99EEB0' },
  { id: 4, x: 292, color: '#CC44DD', shine: '#EE99FF' },
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

/* ── Smoke puff ────────────────────────────────── */
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
          fill="rgba(180,200,220,0.6)"
          animate={{ y: -60, opacity: 0, scaleX: 4, scaleY: 3 }}
          transition={{ duration: 1.4, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

/* ── Spark burst — ST colors ───────────────────── */
function SparkBurst({ cx, candleColor }: { cx: number; candleColor: string }) {
  const SPARKS = [
    { angle: 0,   r: 30 },
    { angle: 50,  r: 24 },
    { angle: 100, r: 32 },
    { angle: 160, r: 26 },
    { angle: 220, r: 28 },
    { angle: 280, r: 22 },
    { angle: 330, r: 30 },
  ];
  const colors = [candleColor, '#FFD860', '#FFFFFF', candleColor, '#E8A020', '#4FC8F0', candleColor];
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
            fill={colors[i % colors.length]}
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

/* ── Confetti burst — ST colors ─────────────────── */
function ConfettiBurst() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: ['#E8A020','#CC2020','#4FC8F0','#FFD860','#C8A8FF','#44CC66','#FF6030','#FFFFFF'][i % 8],
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
          {p.shape === 0 && <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: `0 0 6px ${p.color}` }} />}
          {p.shape === 1 && <div style={{ width: 12, height: 5, background: p.color }} />}
          {p.shape === 2 && (
            <svg width="10" height="10" viewBox="0 0 20 20">
              <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" fill={p.color} />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ── Fairy lights string in SVG ─────────────────── */
function SVGFairyLights() {
  const colors = ['#FF3030','#4FC8F0','#E8A020','#30C040','#C040E0','#FFE030'];
  const count = 14;
  const positions = Array.from({ length: count }, (_, i) => 20 + i * 26);
  return (
    <g>
      {/* Wire */}
      <path
        d={`M10,10 ` + positions.map((x, i) => `Q${x - 13},16 ${x},10 Q${x + 13},4 ${i < count - 1 ? positions[i + 1] : 380},10`).join(' ')}
        stroke="rgba(100,80,50,0.5)" strokeWidth="1.3" fill="none"
      />
      {positions.map((x, i) => {
        const color = colors[i % colors.length];
        return (
          <g key={i}>
            <line x1={x} y1={10} x2={x} y2={17} stroke="rgba(80,60,40,0.4)" strokeWidth="1" />
            <ellipse cx={x} cy={26} rx={5} ry={7} fill={color} opacity={0.9}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
            <ellipse cx={x - 1.5} cy={23} rx={1.5} ry={1.2} fill="rgba(255,255,255,0.5)" />
          </g>
        );
      })}
    </g>
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

  const clearFade = () => {
    if (fadeTimerRef.current) { clearInterval(fadeTimerRef.current); fadeTimerRef.current = null; }
  };

  const fadeIn = (audio: HTMLAudioElement, targetVol = 0.5, durationMs = 3000) => {
    clearFade();
    audio.volume = 0;
    const steps = 80, stepTime = durationMs / steps, stepVol = targetVol / steps;
    fadeTimerRef.current = setInterval(() => {
      if (!audio) { clearFade(); return; }
      const next = Math.min(audio.volume + stepVol, targetVol);
      audio.volume = next;
      if (next >= targetVol) clearFade();
    }, stepTime);
  };

  const fadeOut = (audio: HTMLAudioElement, durationMs = 1800) => {
    clearFade();
    const startVol = audio.volume, steps = 80, stepTime = durationMs / steps, stepVol = startVol / steps;
    fadeTimerRef.current = setInterval(() => {
      if (!audio) { clearFade(); return; }
      const next = Math.max(audio.volume - stepVol, 0);
      audio.volume = next;
      if (next <= 0) { clearFade(); audio.pause(); }
    }, stepTime);
  };

  useEffect(() => {
    const audio = new Audio(import.meta.env.BASE_URL + 'music.mp3');
    audio.loop = true; audio.volume = 0;
    audioRef.current = audio;
    const start = () => { audio.play().then(() => fadeIn(audio, 0.5, 3000)).catch(() => {}); };
    start();
    const onFirstTouch = () => { if (audio.paused) start(); };
    document.addEventListener('pointerdown', onFirstTouch, { once: true });
    onMusicReady?.(() => { if (audioRef.current) fadeOut(audioRef.current, 1800); });
    return () => { document.removeEventListener('pointerdown', onFirstTouch); clearFade(); };
  }, []);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (audioRef.current) {
      const target = mutedRef.current ? 0 : 0.5, audio = audioRef.current;
      clearFade();
      const steps = 20, stepTime = 150 / steps, diff = (target - audio.volume) / steps;
      fadeTimerRef.current = setInterval(() => {
        const next = Math.min(Math.max(audio.volume + diff, 0), 0.5);
        audio.volume = next;
        if (next === target || (diff > 0 && next >= target) || (diff < 0 && next <= target)) clearFade();
      }, stepTime);
    }
  }, []);

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
            background: 'radial-gradient(ellipse at 50% 35%, #0A0C20 0%, #05060F 55%, #020308 100%)',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
        >

          {/* Mute button — amber/cyan styled */}
          <motion.button
            onClick={toggleMute}
            className="absolute top-16 right-4 z-20 flex items-center justify-center rounded-full w-9 h-9"
            style={{
              background: 'rgba(232,160,32,0.12)',
              border: '1px solid rgba(232,160,32,0.28)',
              color: 'rgba(255,216,96,0.85)',
              fontSize: 16,
            }}
            whileHover={{ scale: 1.12, background: 'rgba(232,160,32,0.22)' }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🎵'}
          </motion.button>

          {/* Star field — more prominent, white/blue */}
          {Array.from({ length: 70 }, (_, i) => (
            <motion.div key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 1 + (i % 3) * 0.7,
                height: 1 + (i % 3) * 0.7,
                left: `${(i * 13.7) % 100}%`,
                top: `${(i * 17.3) % 100}%`,
                background: [
                  'rgba(255,255,255,',
                  'rgba(79,200,240,',
                  'rgba(232,160,32,',
                  'rgba(200,180,255,',
                ][i % 4] + `${0.3 + (i % 4) * 0.15})`,
              }}
              animate={{ opacity: [0.1, 0.9, 0.1] }}
              transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: (i * 0.15) % 5 }}
            />
          ))}

          {/* Floating spore particles */}
          {[12, 28, 48, 68, 85].map((left, i) => (
            <motion.div key={i}
              className="absolute pointer-events-none"
              style={{ left: `${left}%`, bottom: '-5%' }}
              animate={{ y: [0, -(window.innerHeight + 50)], opacity: [0, 0.6, 0.6, 0] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.5, ease: 'linear' }}
            >
              <svg width="8" height="18" viewBox="0 0 10 22" fill="none">
                <circle cx="5" cy="5" r="4" fill={['#4FC8F0','#E8A020','#C8A8FF','#FFD860','#80EEFF'][i]}
                  opacity="0.7" style={{ filter: 'blur(0.5px)' }} />
                <line x1="5" y1="9" x2="5" y2="20" stroke={['#4FC8F0','#E8A020','#C8A8FF','#FFD860','#80EEFF'][i]}
                  strokeWidth="1" opacity="0.4" />
              </svg>
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
                {/* Flame */}
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

                {/* Bottom tier — deep navy/indigo */}
                <linearGradient id="t1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#1E2A5A" />
                  <stop offset="30%"  stopColor="#141E48" />
                  <stop offset="70%"  stopColor="#0C1438" />
                  <stop offset="100%" stopColor="#080C28" />
                </linearGradient>
                {/* Top tier — slightly lighter navy */}
                <linearGradient id="t2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#263070" />
                  <stop offset="28%"  stopColor="#1C2258" />
                  <stop offset="68%"  stopColor="#121840" />
                  <stop offset="100%" stopColor="#0A1030" />
                </linearGradient>
                {/* Left shadow */}
                <linearGradient id="sideL" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="rgba(0,0,0,0.45)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
                {/* Right ambient (amber glow from candles) */}
                <linearGradient id="sideR" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%"   stopColor="rgba(232,160,32,0.08)" />
                  <stop offset="100%" stopColor="rgba(232,160,32,0)" />
                </linearGradient>
                {/* Frosting — warm amber-gold */}
                <linearGradient id="frost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#FFE08A" />
                  <stop offset="100%" stopColor="#E8A020" />
                </linearGradient>
                {/* Plate */}
                <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#1A1E3A" />
                  <stop offset="100%" stopColor="#0A0C1E" />
                </linearGradient>
                {/* Candle light pool */}
                <radialGradient id="candlePool" cx="50%" cy="0%" r="90%" fx="50%" fy="0%">
                  <stop offset="0%"   stopColor="rgba(255,155,30,0.32)" />
                  <stop offset="55%"  stopColor="rgba(255,110,10,0.12)" />
                  <stop offset="100%" stopColor="rgba(255,80,0,0)" />
                </radialGradient>

                {/* Filters */}
                <filter id="shadow" x="-20%" y="-20%" width="150%" height="160%">
                  <feDropShadow dx="0" dy="9" stdDeviation="13" floodColor="rgba(0,0,10,0.7)" />
                </filter>
                <filter id="candleShadow">
                  <feDropShadow dx="1" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.45)" />
                </filter>
                <filter id="flameGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="textGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Ground shadow */}
              <ellipse cx="200" cy="318" rx="192" ry="16" fill="rgba(0,0,0,0.5)" />

              {/* Plate */}
              <rect x="5"  y="304" width="390" height="14" rx="7" fill="url(#plate)" />
              <rect x="5"  y="304" width="390" height="3"  rx="3" fill="rgba(100,120,255,0.1)" />
              <rect x="20" y="310" width="360" height="4"  rx="2" fill="rgba(0,0,0,0.3)" />

              {/* ══ BOTTOM TIER ══ */}
              <rect x="14" y="220" width="372" height="84" rx="15" fill="url(#t1)" filter="url(#shadow)" />
              <rect x="14" y="220" width="372" height="8"  rx="6"  fill="rgba(79,200,240,0.18)" />
              <rect x="14" y="220" width="28"  height="84" rx="5"  fill="url(#sideL)" />
              <rect x="358" y="220" width="28" height="84" rx="5"  fill="url(#sideR)" />
              <rect x="18" y="295" width="364" height="9"  rx="4"  fill="rgba(0,0,0,0.35)" />

              {/* Bottom tier frosting drips — amber/golden */}
              {[38,72,108,145,182,218,255,292,330,366].map((x, i) => {
                const h = 10 + [6,12,8,14,6,10,14,8,12,6][i];
                return (
                  <g key={x}>
                    <rect x={x-9} y={218} width={18} height={h+4} rx={9} fill="url(#frost)" />
                    <ellipse cx={x} cy={218+h+4} rx={9} ry={6.5} fill="url(#frost)" />
                    <circle  cx={x-2} cy={220} r={2.8} fill="rgba(255,240,180,0.65)" />
                  </g>
                );
              })}
              {/* Pearl row — amber */}
              {Array.from({ length: 17 }, (_, i) => (
                <circle key={i} cx={32 + i * 20} cy={222} r={5}
                  fill="url(#frost)"
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.35))' }} />
              ))}
              {/* Bottom tier stars/dots */}
              {[55,105,155,200,248,298,348].map((x, i) => (
                <text key={x} x={x} y={265} textAnchor="middle" fontSize="12"
                  fill={['rgba(255,200,60,0.6)','rgba(79,200,240,0.6)','rgba(200,140,255,0.6)','rgba(255,200,60,0.6)','rgba(79,200,240,0.6)','rgba(255,100,100,0.6)','rgba(255,200,60,0.6)'][i]}>
                  ★
                </text>
              ))}
              {[82,182,282,372].map(x => (
                <text key={x} x={x} y={282} textAnchor="middle" fontSize="10" fill="rgba(79,200,240,0.4)">♦</text>
              ))}

              {/* ══ TOP TIER ══ */}
              <rect x="68" y="144" width="264" height="76" rx="12" fill="url(#t2)" filter="url(#shadow)" />
              <rect x="68" y="144" width="264" height="7"  rx="5"  fill="rgba(100,160,255,0.22)" />
              <rect x="68" y="144" width="22"  height="76" rx="4"  fill="url(#sideL)" />
              <rect x="310" y="144" width="22" height="76" rx="4"  fill="url(#sideR)" />
              <rect x="72"  y="211" width="256" height="9"  rx="4"  fill="rgba(0,0,0,0.3)" />

              {/* Candle light glow pools */}
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
              {blown.filter(Boolean).length < CANDLES.length && (
                <motion.rect
                  x="68" y="144" width="264" height="24" rx="4"
                  fill="rgba(255,130,20,0.07)"
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
                    <circle  cx={x-2} cy={143} r={2.2} fill="rgba(255,240,160,0.7)" />
                  </g>
                );
              })}
              {/* Top pearl row */}
              {Array.from({ length: 9 }, (_, i) => (
                <circle key={i} cx={86 + i * 26} cy={146} r={4.5}
                  fill="url(#frost)"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.28))' }} />
              ))}
              {/* Top tier dots */}
              {[104,152,200,248,296].map((x, i) => (
                <circle key={x} cx={x} cy={183} r={3.5}
                  fill={['rgba(255,200,60,0.6)','rgba(79,200,240,0.6)','rgba(200,140,255,0.6)','rgba(255,100,100,0.6)','rgba(79,200,240,0.6)'][i]} />
              ))}

              {/* "Angel" script — warm golden */}
              <text x="200" y="197" textAnchor="middle"
                fontFamily="'Sacramento', cursive" fontSize="40"
                fill="rgba(255,220,100,0.9)"
                filter="url(#textGlow)"
                style={{ userSelect: 'none' }}>
                Angel
              </text>

              {/* Fairy lights string across cake top */}
              <g transform="translate(68, 108)">
                <SVGFairyLights />
              </g>

              {/* ══ CANDLES ══ */}
              {CANDLES.map(c => {
                const isBlown = blown[c.id];
                return (
                  <g key={c.id} onClick={() => blowCandle(c.id)}
                    style={{ cursor: isBlown ? 'default' : 'pointer' }}>
                    <rect x={c.x-26} y={20} width={52} height={130} fill="transparent" />

                    {/* Candle body */}
                    <rect x={c.x-7} y={CANDLE_TOP_Y} width={14} height={CANDLE_BTM_Y - CANDLE_TOP_Y}
                      rx={4} fill={c.color} filter="url(#candleShadow)" />
                    {/* Candle shine */}
                    <rect x={c.x-4} y={CANDLE_TOP_Y + 4} width={4} height={CANDLE_BTM_Y - CANDLE_TOP_Y - 8}
                      rx={2} fill={c.shine} opacity={0.4} />
                    {/* Candle warm glow if lit */}
                    {!isBlown && (
                      <motion.rect
                        x={c.x - 10} y={CANDLE_TOP_Y} width={20} height={20} rx={4}
                        fill={c.color} opacity={0}
                        animate={{ opacity: [0.0, 0.18, 0.0] }}
                        transition={{ duration: 0.55 + c.id * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    {/* Wick */}
                    <line x1={c.x} y1={WICK_TOP_Y} x2={c.x} y2={CANDLE_TOP_Y}
                      stroke="#3A2010" strokeWidth={1.5} />

                    {/* Flame */}
                    {!isBlown && (
                      <g transform={`translate(${c.x}, ${WICK_TOP_Y})`} filter="url(#flameGlow)">
                        <Flame seed={c.id} />
                      </g>
                    )}

                    {/* Smoke */}
                    {smokeIds.includes(c.id) && <SmokePuff cx={c.x} />}
                    {/* Sparks */}
                    {sparkIds.includes(c.id) && <SparkBurst cx={c.x} candleColor={c.color} />}
                  </g>
                );
              })}

              {/* "Happy 18th!" text — amber/warm gold below cake */}
              <motion.text
                x="200" y="360"
                textAnchor="middle"
                fontFamily="'Sacramento', cursive"
                fontSize="44"
                fill="url(#frost)"
                filter="url(#textGlow)"
                style={{ userSelect: 'none' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Happy 18th!
              </motion.text>

              <motion.text
                x="200" y="395"
                textAnchor="middle"
                fontFamily="'Inter', sans-serif"
                fontSize="13"
                fill="rgba(200,200,255,0.55)"
                style={{ userSelect: 'none' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                How Did You Think I Would Forget?
              </motion.text>

              {/* Click hint dots */}
              {phase === 'active' && (
                <motion.text
                  x="200" y="426"
                  textAnchor="middle"
                  fontFamily="'Inter', sans-serif"
                  fontSize="11"
                  fill="rgba(232,160,32,0.45)"
                  style={{ userSelect: 'none' }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  click each candle to blow it out ✦ {blownCount}/{CANDLES.length}
                </motion.text>
              )}
            </svg>

            {/* All-blown celebration message */}
            <AnimatePresence>
              {phase === 'allBlown' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  style={{ top: '-10%' }}
                >
                  <div className="text-center" style={{ filter: 'drop-shadow(0 0 20px rgba(232,160,32,0.7))' }}>
                    <div className="font-serif italic text-4xl md:text-5xl" style={{ color: '#FFD860' }}>
                      Make a Wish! ✦
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Confetti on all blown */}
          {phase === 'allBlown' && <ConfettiBurst />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
