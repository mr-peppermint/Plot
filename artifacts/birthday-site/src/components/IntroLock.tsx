import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Music Engine (Web Audio API) ───────────────── */
const BEAT = 60 / 76; // seconds per beat at 76 BPM

// Pentatonic-major melody — sweet & looping
const MELODY: [number, number][] = [
  // Bar 1 — G5 E5 C5 E5
  [784.00, BEAT], [659.25, BEAT], [523.25, BEAT], [659.25, BEAT],
  // Bar 2 — A4 C5 E5 C5
  [440.00, BEAT], [523.25, BEAT], [659.25, BEAT], [523.25, BEAT],
  // Bar 3 — G4 A4 C5 A4
  [392.00, BEAT], [440.00, BEAT], [523.25, BEAT], [440.00, BEAT],
  // Bar 4 — G4 hold
  [392.00, BEAT * 4],
  // Bar 5 — E5 G5 A5 G5
  [659.25, BEAT], [784.00, BEAT], [880.00, BEAT], [784.00, BEAT],
  // Bar 6 — E5 C5 G4 A4
  [659.25, BEAT], [523.25, BEAT], [392.00, BEAT], [440.00, BEAT],
  // Bar 7 — C5 E5 G5 E5
  [523.25, BEAT], [659.25, BEAT], [784.00, BEAT], [659.25, BEAT],
  // Bar 8 — C5 hold
  [523.25, BEAT * 4],
];

const LOOP_DUR = MELODY.reduce((s, [, d]) => s + d, 0);

function scheduleLoop(ctx: AudioContext, master: GainNode, t0: number) {
  let t = t0;
  for (const [freq, dur] of MELODY) {
    if (freq > 0) {
      const osc  = ctx.createOscillator();
      const env  = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.85, t + 0.013);
      env.gain.exponentialRampToValueAtTime(0.001, t + Math.min(dur * 0.75, 0.5));
      osc.connect(env); env.connect(master);
      osc.start(t); osc.stop(t + dur);

      const osc2  = ctx.createOscillator();
      const env2  = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, t);
      env2.gain.setValueAtTime(0, t);
      env2.gain.linearRampToValueAtTime(0.12, t + 0.013);
      env2.gain.exponentialRampToValueAtTime(0.001, t + Math.min(dur * 0.5, 0.25));
      osc2.connect(env2); env2.connect(master);
      osc2.start(t); osc2.stop(t + dur);
    }
    t += dur;
  }
}

/* ── Candle config ─────────────────────────────── */
const CANDLES = [
  { id: 0, x: 108, color: '#F0A8BE', shine: '#FFE4EE' },
  { id: 1, x: 154, color: '#C4728A', shine: '#F5B8C8' },
  { id: 2, x: 200, color: '#C8B0F0', shine: '#EDD8FF' },
  { id: 3, x: 246, color: '#C4728A', shine: '#F5B8C8' },
  { id: 4, x: 292, color: '#F0A8BE', shine: '#FFE4EE' },
];

const WICK_TOP_Y    = 74;
const CANDLE_TOP_Y  = 84;
const CANDLE_BTM_Y  = 144;

/* ── Animated Flame ────────────────────────────── */
function Flame({ seed }: { seed: number }) {
  const dur = 0.45 + (seed % 5) * 0.08;
  return (
    <motion.g
      transformOrigin="0px 0px"
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
    { dx: 0,   sz: 2,   delay: 0    },
    { dx: -4,  sz: 2.5, delay: 0.12 },
    { dx: 4,   sz: 2.2, delay: 0.22 },
    { dx: -2,  sz: 3,   delay: 0.36 },
    { dx: 3,   sz: 2.4, delay: 0.48 },
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

/* ── Confetti burst (DOM layer) on all blown ───── */
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
              <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z"
                fill={p.color} />
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
  const ctxRef                  = useRef<AudioContext | null>(null);
  const stopMusicRef            = useRef<(() => void) | null>(null);
  const mutedRef                = useRef(false);
  const masterVolRef            = useRef<GainNode | null>(null);

  useEffect(() => {
    let ctx: AudioContext | null = null;
    let stopped = false;

    const boot = async () => {
      if (ctxRef.current) return;
      ctx = new AudioContext();
      ctxRef.current = ctx;
      const muteGate = ctx.createGain();
      muteGate.gain.value = 1;
      masterVolRef.current = muteGate;
      muteGate.connect(ctx.destination);
      if (ctx.state === 'suspended') await ctx.resume();
      if (stopped) return;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 3);
      master.connect(muteGate);
      let active = true;
      const loop = (startAt: number) => {
        if (!active) return;
        scheduleLoop(ctx!, master, startAt);
        setTimeout(() => loop(startAt + LOOP_DUR), (LOOP_DUR - 2) * 1000);
      };
      loop(ctx.currentTime + 0.4);
      stopMusicRef.current = () => {
        active = false;
        const now = ctx!.currentTime;
        master.gain.setValueAtTime(master.gain.value, now);
        master.gain.linearRampToValueAtTime(0, now + 1.8);
      };
      // ✅ Pass stop function up AFTER it's created, inside boot()
      onMusicReady?.(stopMusicRef.current);
    };

    boot();
    const onTouch = () => boot();
    document.addEventListener('pointerdown', onTouch, { once: true });

    return () => {
      stopped = true;
      document.removeEventListener('pointerdown', onTouch);
      // ✅ Do NOT stop music here — let it continue into the main page
      setTimeout(() => ctx?.close(), 2200);
    };
  }, []);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (masterVolRef.current && ctxRef.current) {
      masterVolRef.current.gain.setTargetAtTime(
        mutedRef.current ? 0 : 1,
        ctxRef.current.currentTime,
        0.1,
      );
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
        // ✅ Removed: stopMusicRef.current?.() — music continues to main page
        setTimeout(() => setPhase('exit'), 2400);
        setTimeout(() => onUnlocked(), 3300);
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
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
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

          {/* Floating star field */}
          {Array.from({ length: 55 }, (_, i) => (
            <motion.div key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 1 + (i % 3) * 0.8,
                height: 1 + (i % 3) * 0.8,
                left: `${(i * 13.7) % 100}%`,
                top: `${(i * 17.3) % 100}%`,
                background: ['rgba(240,168,190,','rgba(196,114,138,','rgba(184,156,216,'][i%3]
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

          {/* ── CAKE SVG ── */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.82, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 'min(400px, 92vw)' }}
          >
            <svg
              viewBox="0 0 400 320"
              style={{ width: '100%', height: 'auto', overflow: 'visible' }}
            >
              <defs>
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
                <linearGradient id="t1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#C06080" />
                  <stop offset="50%"  stopColor="#A05068" />
                  <stop offset="100%" stopColor="#7A3850" />
                </linearGradient>
                <linearGradient id="t2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#D880A0" />
                  <stop offset="50%"  stopColor="#B86080" />
                  <stop offset="100%" stopColor="#8C4060" />
                </linearGradient>
                <linearGradient id="frost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#FFF5F8" />
                  <stop offset="100%" stopColor="#F8D8E4" />
                </linearGradient>
                <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#3A1520" />
                  <stop offset="100%" stopColor="#1A0810" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgba(0,0,0,0.55)" />
                </filter>
                <filter id="candleShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.4)" />
                </filter>
                <filter id="flameGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <ellipse cx="200" cy="310" rx="180" ry="20" fill="rgba(196,114,138,0.12)" />

              <rect x="5" y="297" width="390" height="18" rx="8" fill="url(#plate)" />
              <rect x="5" y="297" width="390" height="4" rx="4" fill="rgba(255,180,200,0.1)" />

              <rect x="14" y="218" width="372" height="79" rx="16" fill="url(#t1)" filter="url(#shadow)" />
              <rect x="14" y="218" width="372" height="5" rx="5" fill="rgba(255,210,225,0.22)" />
              <rect x="14" y="218" width="6" height="79" rx="3" fill="rgba(255,200,220,0.1)" />

              {[38,72,108,145,182,218,255,292,330,366].map((x, i) => {
                const h = 10 + [6,12,8,14,6,10,14,8,12,6][i];
                return (
                  <g key={x}>
                    <rect x={x-9} y={216} width={18} height={h+3} rx={9} fill="url(#frost)" />
                    <ellipse cx={x} cy={216+h+3} rx={9} ry={6.5} fill="url(#frost)" />
                  </g>
                );
              })}

              {[50,100,150,200,250,300,350].map((x, i) => (
                <circle key={x} cx={x} cy={256} r={4.5}
                  fill={i%2===0 ? 'rgba(255,210,228,0.65)' : 'rgba(210,180,242,0.65)'} />
              ))}
              {[75,175,275,370].map((x) => (
                <text key={x} x={x} y={270} textAnchor="middle" fontSize="11" fill="rgba(255,220,232,0.45)">★</text>
              ))}
              {[125,225,325].map((x) => (
                <text key={x} x={x} y={270} textAnchor="middle" fontSize="10" fill="rgba(255,200,220,0.5)">♥</text>
              ))}

              <rect x="68" y="144" width="264" height="74" rx="13" fill="url(#t2)" filter="url(#shadow)" />
              <rect x="68" y="144" width="264" height="5" rx="5" fill="rgba(255,220,235,0.25)" />
              <rect x="68" y="144" width="6" height="74" rx="3" fill="rgba(255,210,225,0.1)" />

              {[88,118,150,182,218,254,286,318].map((x, i) => {
                const h = 8 + [5,10,7,12,6,9,11,7][i];
                return (
                  <g key={x}>
                    <rect x={x-8} y={142} width={16} height={h+3} rx={8} fill="url(#frost)" />
                    <ellipse cx={x} cy={142+h+3} rx={8} ry={5.5} fill="url(#frost)" />
                  </g>
                );
              })}

              {[100,150,200,250,300].map((x, i) => (
                <circle key={x} cx={x} cy={178} r={3.5}
                  fill={i%2===0 ? 'rgba(255,210,228,0.6)' : 'rgba(200,175,242,0.6)'} />
              ))}

              <text x="200" y="196" textAnchor="middle"
                fontFamily="'Sacramento', cursive" fontSize="28"
                fill="rgba(255,225,235,0.7)" style={{ userSelect: 'none' }}>
                Angel
              </text>

              {CANDLES.map(c => {
                const isBlown = blown[c.id];
                return (
                  <g key={c.id}
                    onClick={() => blowCandle(c.id)}
                    style={{ cursor: isBlown ? 'default' : 'pointer' }}
                  >
                    <rect x={c.x-24} y={28} width={48} height={120} fill="transparent" />
                    <rect x={c.x-8} y={CANDLE_TOP_Y} width={16} height={CANDLE_BTM_Y - CANDLE_TOP_Y}
                      rx={5} fill={c.color} filter="url(#candleShadow)" />
                    <rect x={c.x-5} y={CANDLE_TOP_Y + 5} width={3.5}
                      height={CANDLE_BTM_Y - CANDLE_TOP_Y - 14} rx={1.75}
                      fill="rgba(255,255,255,0.25)" />
                    <ellipse cx={c.x} cy={CANDLE_BTM_Y} rx={9} ry={3.5} fill={c.shine} opacity={0.35} />
                    <line x1={c.x} y1={CANDLE_TOP_Y} x2={c.x} y2={WICK_TOP_Y}
                      stroke="#3A1825" strokeWidth={2.2} strokeLinecap="round" />
                    <circle cx={c.x} cy={WICK_TOP_Y} r={2.5}
                      fill={isBlown ? '#3A1825' : '#FF6000'}
                      style={{ filter: isBlown ? 'none' : 'drop-shadow(0 0 4px rgba(255,140,0,0.9))' }}
                    />
                    {!isBlown && (
                      <g transform={`translate(${c.x}, ${WICK_TOP_Y})`} filter="url(#flameGlow)">
                        <Flame seed={c.id} />
                      </g>
                    )}
                    {smokeIds.includes(c.id) && <SmokePuff cx={c.x} />}
                    {sparkIds.includes(c.id) && <SparkBurst cx={c.x} />}
                    {isBlown && (
                      <motion.circle
                        cx={c.x} cy={WICK_TOP_Y} r={6}
                        fill="none"
                        stroke="rgba(196,114,138,0.3)"
                        strokeWidth={1}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </g>
                );
              })}
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