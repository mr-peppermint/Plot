import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const TOTAL_TAPS = 10;

interface Ripple { id: number; x: number; y: number }

/* ─────────────────────────────────────────
   Medieval Key SVG (vertical, pointing down)
───────────────────────────────────────── */
function MedievalKey({ progress, unlocking }: { progress: number; unlocking: boolean }) {
  const glow = 6 + progress * 18;
  return (
    <svg width="80" height="200" viewBox="0 0 80 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 0 ${glow}px rgba(130,80,220,0.9)) drop-shadow(0 0 ${glow * 2}px rgba(80,40,180,0.4))` }}>
      <defs>
        <linearGradient id="kgold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8D5FF" />
          <stop offset="30%" stopColor="#B89AEE" />
          <stop offset="60%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="kgold2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <radialGradient id="kgem" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E0D0FF" />
          <stop offset="60%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
      </defs>

      {/* ── Bow (head) outer ring ── */}
      <circle cx="40" cy="34" r="30" stroke="url(#kgold)" strokeWidth="2.5" fill="rgba(60,20,110,0.55)" />

      {/* ── Bow decorative inner ring ── */}
      <circle cx="40" cy="34" r="21" stroke="url(#kgold)" strokeWidth="1.2" fill="none" opacity="0.6" />

      {/* ── Quatrefoil cutouts ── */}
      {[[40,13],[61,34],[40,55],[19,34]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="8.5"
          fill="rgba(100,60,200,0.35)" stroke="url(#kgold)" strokeWidth="1.2" />
      ))}

      {/* ── Center gem ── */}
      <circle cx="40" cy="34" r="7" fill="url(#kgem)" />
      <ellipse cx="37" cy="31" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.5)" />

      {/* ── Decorative top cross ── */}
      <path d="M40 5 L40 12" stroke="url(#kgold)" strokeWidth="2" strokeLinecap="round" />
      <path d="M33 8 L47 8" stroke="url(#kgold)" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Small diamond ornaments on outer ring ── */}
      {[0,90,180,270].map((deg,i) => {
        const r = 30, a = (deg - 90) * Math.PI / 180;
        const x = 40 + r * Math.cos(a), y = 34 + r * Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="3" fill="url(#kgold)" />;
      })}

      {/* ── Shank ── */}
      <rect x="36" y="63" width="8" height="95" rx="3" fill="url(#kgold2)" />

      {/* ── Shank rings (decorative collars) ── */}
      {[78, 95, 112].map((y, i) => (
        <rect key={i} x="33" y={y} width="14" height="4" rx="2" fill="url(#kgold)" opacity="0.85" />
      ))}

      {/* ── Bit (teeth) on right ── */}
      <rect x="44" y="130" width="20" height="7" rx="2" fill="url(#kgold)" opacity="0.9" />
      <rect x="44" y="145" width="14" height="7" rx="2" fill="url(#kgold)" opacity="0.9" />
      <rect x="44" y="160" width="18" height="7" rx="2" fill="url(#kgold)" opacity="0.9" />

      {/* ── Tip ── */}
      <path d="M36 158 L36 172 Q40 178 44 172 L44 158" fill="url(#kgold2)" />

      {/* shimmer on unlock */}
      {unlocking && (
        <motion.rect x="0" y="0" width="80" height="200" rx="8"
          fill="rgba(200,180,255,0.15)"
          initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.5, repeat: 3 }} />
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────
   Keyhole SVG
───────────────────────────────────────── */
function Keyhole({ progress, unlocking }: { progress: number; unlocking: boolean }) {
  const outerGlow = 20 + progress * 60;
  const innerAlpha = 0.35 + progress * 0.65;
  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow blob behind keyhole */}
      <motion.div className="absolute"
        style={{
          width: 320, height: 320,
          background: `radial-gradient(circle, rgba(120,60,255,${innerAlpha * 0.6}) 0%, rgba(80,30,200,${innerAlpha * 0.3}) 40%, transparent 70%)`,
          borderRadius: '50%',
          filter: `blur(${18 + progress * 20}px)`,
        }}
        animate={unlocking ? { scale: [1, 3.5], opacity: [1, 0] } : {}}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />

      {/* God-rays on unlock */}
      {unlocking && (
        <motion.div className="absolute inset-0 flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} className="absolute"
              style={{
                width: 3, height: 200,
                background: 'linear-gradient(to top, transparent, rgba(160,100,255,0.8), transparent)',
                transformOrigin: 'center bottom',
                rotate: i * 45,
                top: '50%', left: '50%', marginLeft: -1.5,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1.8, 0], opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.2, delay: i * 0.05, ease: 'easeOut' }}
            />
          ))}
        </motion.div>
      )}

      {/* Keyhole plate */}
      <div className="relative" style={{ filter: `drop-shadow(0 0 ${outerGlow}px rgba(120,60,255,0.7))` }}>
        <svg width="180" height="240" viewBox="0 0 180 240" fill="none">
          <defs>
            <radialGradient id="holeLight" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={`rgba(200,160,255,${innerAlpha})`} />
              <stop offset="40%" stopColor={`rgba(120,60,230,${innerAlpha * 0.8})`} />
              <stop offset="100%" stopColor={`rgba(60,20,160,${innerAlpha * 0.3})`} />
            </radialGradient>
            <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A0830" />
              <stop offset="100%" stopColor="#0A0418" />
            </linearGradient>
            <filter id="holeGlow">
              <feGaussianBlur stdDeviation={3 + progress * 5} result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Keyhole clip: circle + trapezoid */}
            <clipPath id="keyholeClip">
              <circle cx="90" cy="88" r="38" />
              <path d="M68 122 L58 210 L122 210 L112 122 Z" />
            </clipPath>
          </defs>

          {/* Ornate plate border */}
          <rect x="4" y="4" width="172" height="232" rx="18"
            stroke="rgba(120,60,220,0.5)" strokeWidth="1.5" fill="none" />
          <rect x="10" y="10" width="160" height="220" rx="14"
            stroke="rgba(160,100,255,0.25)" strokeWidth="1" fill="none" />

          {/* Plate fill */}
          <rect x="4" y="4" width="172" height="232" rx="18" fill="url(#plateGrad)"
            stroke="rgba(120,60,220,0.45)" strokeWidth="2" />

          {/* Decorative corner ornaments */}
          {[[18,18],[162,18],[18,222],[162,222]].map(([cx,cy],i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="6" fill="none" stroke="rgba(160,100,255,0.45)" strokeWidth="1.2" />
              <circle cx={cx} cy={cy} r="2.5" fill="rgba(140,80,240,0.6)" />
            </g>
          ))}

          {/* Side embellishments */}
          <path d="M4 100 L16 100" stroke="rgba(160,100,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M164 100 L176 100" stroke="rgba(160,100,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 140 L16 140" stroke="rgba(160,100,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M164 140 L176 140" stroke="rgba(160,100,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Glowing light INSIDE keyhole (rendered first, clipped) */}
          <g clipPath="url(#keyholeClip)">
            <rect x="50" y="48" width="80" height="165" fill="url(#holeLight)" filter="url(#holeGlow)" />
          </g>

          {/* Keyhole dark shape (the actual keyhole silhouette rendered on TOP of plate) */}
          <circle cx="90" cy="88" r="38" fill="rgba(8,2,20,0.1)" stroke="rgba(160,100,255,0.6)" strokeWidth="2" />
          <path d="M68 122 L58 210 L122 210 L112 122 Z" fill="rgba(8,2,20,0.1)" stroke="rgba(160,100,255,0.6)" strokeWidth="2" strokeLinejoin="round" />

          {/* Inner circle highlight */}
          <circle cx="90" cy="88" r="34" fill="none" stroke={`rgba(200,160,255,${progress * 0.4})`} strokeWidth="1" />

          {/* Emitting particles on high progress */}
          {progress > 0.5 && [45, 90, 135, 200, 250].map((y, i) => (
            <motion.circle key={i} cx={70 + (i % 3) * 20} cy={y} r="1.5"
              fill={`rgba(180,130,255,${0.5 + progress * 0.5})`}
              animate={{ y: [-5, 5, -5], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }} />
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Progress dots
───────────────────────────────────────── */
function TapProgress({ taps }: { taps: number }) {
  return (
    <div className="flex gap-2 items-center justify-center">
      {[...Array(TOTAL_TAPS)].map((_, i) => (
        <motion.div key={i}
          animate={{ scale: i < taps ? [1, 1.4, 1] : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width: i < taps ? 10 : 8,
            height: i < taps ? 10 : 8,
            borderRadius: '50%',
            background: i < taps
              ? 'radial-gradient(circle, #D0B0FF, #7C3AED)'
              : 'rgba(120,60,200,0.25)',
            border: i < taps ? 'none' : '1px solid rgba(120,60,200,0.35)',
            boxShadow: i < taps ? '0 0 8px rgba(140,80,255,0.7)' : 'none',
            transition: 'all 0.3s',
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main export
───────────────────────────────────────── */
export function IntroLock({ onUnlocked }: { onUnlocked: () => void }) {
  const [taps, setTaps] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [phase, setPhase] = useState<'locked' | 'unlocking' | 'fading'>('locked');
  const keyAnim = useAnimation();
  const processingRef = useRef(false);

  const progress = taps / TOTAL_TAPS;

  /* Key entrance animation */
  useEffect(() => {
    keyAnim.start({ opacity: 1, y: -130, rotate: 0, transition: { duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] } });
  }, [keyAnim]);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    if (phase !== 'locked' || processingRef.current) return;
    e.preventDefault();

    const x = e.clientX;
    const y = e.clientY;
    const id = Date.now() + Math.random();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(item => item.id !== id)), 900);

    setTaps(prev => {
      const next = prev + 1;
      const prog = next / TOTAL_TAPS;

      // Key jiggle + descend toward keyhole
      keyAnim.start({
        y: -(130 - prog * 130),   // moves from -130 to 0
        rotate: [-3, 3, -1.5, 0],
        scale: [1, 1.04, 1],
        transition: { duration: 0.35, ease: 'easeOut' },
      });

      if (next >= TOTAL_TAPS) {
        processingRef.current = true;
        setPhase('unlocking');

        // Key turns in the lock
        setTimeout(() => {
          keyAnim.start({ rotate: 90, scale: 1.1, transition: { duration: 0.5, ease: 'easeInOut' } });
        }, 200);

        // Then fade out the whole screen
        setTimeout(() => {
          setPhase('fading');
        }, 1100);

        setTimeout(() => {
          onUnlocked();
        }, 2200);
      }

      return Math.min(next, TOTAL_TAPS);
    });
  }, [phase, keyAnim, onUnlocked]);

  if (phase === 'fading' && taps >= TOTAL_TAPS) {
    // Already triggered onUnlocked, just keep rendering the fade
  }

  return (
    <AnimatePresence>
      {phase !== 'fading' || taps < TOTAL_TAPS ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none touch-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, #0F0525 0%, #07021A 45%, #030110 100%)',
            cursor: 'pointer',
          }}
          animate={phase === 'fading' ? { opacity: 0, scale: 1.04 } : { opacity: 1 }}
          transition={phase === 'fading' ? { duration: 1.1, ease: 'easeInOut' } : {}}
          onPointerDown={handlePointer}
        >
          {/* Star field */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(60)].map((_, i) => (
              <motion.div key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `rgba(${160 + Math.random() * 80}, ${120 + Math.random() * 80}, 255, ${0.3 + Math.random() * 0.5})`,
                }}
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 1.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4 }}
              />
            ))}
          </div>

          {/* Tap ripples */}
          <AnimatePresence>
            {ripples.map(r => (
              <motion.div key={r.id}
                className="fixed pointer-events-none rounded-full"
                style={{ left: r.x, top: r.y, x: '-50%', y: '-50%' }}
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{ width: 160, height: 160, opacity: 0 }}
                exit={{}}
                transition={{ duration: 0.75, ease: 'easeOut' }}
              >
                <div className="w-full h-full rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(140,80,255,0.55) 0%, rgba(80,30,200,0.2) 50%, transparent 70%)' }} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Ambient screen pulse on each tap */}
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(100,50,220,0.12), transparent 65%)' }}
            animate={{ opacity: [0.4, 0.4 + progress * 0.6] }}
          />

          {/* Flash burst on unlock */}
          {phase === 'unlocking' && (
            <motion.div className="absolute inset-0 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.4] }}
              transition={{ duration: 0.8, times: [0, 0.15, 1] }}
              style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(180,120,255,0.85) 0%, rgba(100,50,230,0.5) 30%, transparent 70%)' }}
            />
          )}

          {/* Main scene */}
          <div className="relative flex flex-col items-center" style={{ gap: 0 }}>
            {/* Key */}
            <motion.div
              animate={keyAnim}
              initial={{ opacity: 0, y: -130, rotate: 0 }}
              style={{ zIndex: 20, marginBottom: -20 }}
            >
              <MedievalKey progress={progress} unlocking={phase === 'unlocking'} />
            </motion.div>

            {/* Keyhole plate */}
            <div style={{ zIndex: 10 }}>
              <Keyhole progress={progress} unlocking={phase === 'unlocking'} />
            </div>
          </div>

          {/* Instructions & progress */}
          <motion.div
            className="mt-8 flex flex-col items-center gap-4"
            animate={phase === 'unlocking' ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="font-sans text-xs tracking-[0.3em] uppercase"
              style={{ color: 'rgba(180,130,255,0.6)' }}>
              {taps === 0
                ? 'Tap to unlock'
                : taps >= TOTAL_TAPS
                  ? 'Unlocking…'
                  : `${TOTAL_TAPS - taps} tap${TOTAL_TAPS - taps !== 1 ? 's' : ''} remaining`}
            </p>
            <TapProgress taps={taps} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
