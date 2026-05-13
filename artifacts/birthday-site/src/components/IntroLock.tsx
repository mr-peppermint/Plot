import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const TOTAL_TAPS = 10;
interface Ripple { id: number; x: number; y: number }

/* ─────────────────────────────────────────────────────
   Rose-gold medieval key
   Colors matched to main site: #F0A8BE #C4728A #B89CD8
───────────────────────────────────────────────────── */
function MedievalKey({ progress }: { progress: number }) {
  return (
    <svg
      width="96" height="230"
      viewBox="0 0 80 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: `drop-shadow(0 0 ${8 + progress * 16}px rgba(196,114,138,0.75))
                 drop-shadow(0 0 ${3 + progress * 6}px rgba(240,168,190,0.5))`,
      }}
    >
      <defs>
        <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#FFE0EC" />
          <stop offset="35%"  stopColor="#E8A8BE" />
          <stop offset="70%"  stopColor="#C4728A" />
          <stop offset="100%" stopColor="#9B5C72" />
        </linearGradient>
        <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F0A8BE" />
          <stop offset="50%"  stopColor="#C4728A" />
          <stop offset="100%" stopColor="#8B4A62" />
        </linearGradient>
        <linearGradient id="lv1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#E8D8FF" />
          <stop offset="50%"  stopColor="#B89CD8" />
          <stop offset="100%" stopColor="#7C5CA8" />
        </linearGradient>
        <radialGradient id="gem" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#FFE8F0" />
          <stop offset="40%"  stopColor="#E8A8C0" />
          <stop offset="100%" stopColor="#9B5C72" />
        </radialGradient>
        <radialGradient id="lvgem" cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#EEE0FF" />
          <stop offset="40%"  stopColor="#B89CD8" />
          <stop offset="100%" stopColor="#7C5CA8" />
        </radialGradient>
      </defs>

      {/* ── Outer bow ring ── */}
      <circle cx="40" cy="33" r="28" stroke="url(#rg1)" strokeWidth="2.8" fill="rgba(14,5,9,0.7)" />

      {/* ── Inner decorative ring ── */}
      <circle cx="40" cy="33" r="20" stroke="url(#rg1)" strokeWidth="1.1" fill="none" opacity="0.55" />

      {/* ── Quatrefoil petals ── */}
      {([[40,13],[61,33],[40,53],[19,33]] as [number,number][]).map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="8" ry="8"
          fill={i % 2 === 0 ? 'rgba(196,114,138,0.28)' : 'rgba(184,156,216,0.28)'}
          stroke={i % 2 === 0 ? 'url(#rg1)' : 'url(#lv1)'} strokeWidth="1.1" />
      ))}

      {/* ── Center gem ── */}
      <circle cx="40" cy="33" r="7.5" fill="url(#gem)" />
      <ellipse cx="37.5" cy="30.5" rx="2.5" ry="1.5" fill="rgba(255,255,255,0.55)" />

      {/* ── Four corner dots on bow ── */}
      {[[-90,28],[0,33],[90,28],[180,33]].map(([deg, r], i) => {
        const a = (deg - 90) * Math.PI / 180;
        return <circle key={i} cx={40 + 28 * Math.cos(a)} cy={33 + 28 * Math.sin(a)} r="2.8" fill="url(#rg1)" />;
      })}

      {/* ── Top ornament ── */}
      <path d="M40 5 L40 9" stroke="url(#rg1)" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 6.5 L46 6.5" stroke="url(#rg1)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="40" cy="5" r="2" fill="url(#lv1)" />

      {/* ── Shank ── */}
      <rect x="37" y="60" width="7" height="100" rx="2.5" fill="url(#rg2)" />

      {/* ── Shank collars ── */}
      {[76, 94, 112].map((y, i) => (
        <g key={i}>
          <rect x="33.5" y={y} width="13" height="4.5" rx="2.25" fill="url(#rg1)" />
          <rect x="35" y={y + 1.5} width="10" height="1.5" rx="0.75" fill="rgba(255,220,235,0.4)" />
        </g>
      ))}

      {/* ── Bit / teeth (right side) ── */}
      <rect x="44" y="128" width="18" height="7" rx="2" fill="url(#rg1)" />
      <rect x="44" y="143" width="13" height="6.5" rx="2" fill="url(#rg1)" />
      <rect x="44" y="157" width="16" height="6.5" rx="2" fill="url(#rg1)" />

      {/* ── Tip ── */}
      <path d="M37 158 L37 173 Q40.5 179 44 173 L44 158 Z" fill="url(#rg2)" />

      {/* ── Shank highlight streak ── */}
      <rect x="39" y="62" width="2" height="96" rx="1" fill="rgba(255,210,225,0.25)" />

      {/* ── Small lavender gems on collars ── */}
      {[78, 96, 114].map((y, i) => (
        <circle key={i} cx="40" cy={y + 0.5} r="1.6" fill="url(#lvgem)" />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   3-D Hole Keyhole
   No glow — pure depth illusion: dark layered gradients
   giving the feeling of a real hole punched in the screen
───────────────────────────────────────────────────── */
function KeyholeHole() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 270 }}>

      {/* Very faint ambient shadow on the screen surface around the hole */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)',
          background: 'radial-gradient(ellipse at 50% 38%, rgba(8,2,6,0.5) 0%, transparent 70%)',
          borderRadius: 24,
        }}
      />

      {/* The plate surface (worn metal / stone) */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(40,16,26,0.95) 0%, rgba(20,7,14,0.98) 55%, rgba(30,10,20,0.95) 100%)',
          border: '1px solid rgba(196,114,138,0.18)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(196,114,138,0.1)',
        }}
      >
        {/* Subtle texture lines on plate */}
        {[30,60,90,120,150,180,210,240].map(y => (
          <div key={y} className="absolute w-full" style={{ top: y, height: 1, background: 'rgba(196,114,138,0.035)' }} />
        ))}

        {/* Corner rivets */}
        {[[18,18],[182,18],[18,252],[182,252]].map(([cx,cy], i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 12, height: 12,
              left: cx - 6, top: cy - 6,
              background: 'radial-gradient(circle at 35% 35%, rgba(240,168,190,0.6), rgba(100,40,60,0.8))',
              boxShadow: '0 1px 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,200,220,0.15)',
            }}
          />
        ))}

        {/* Plate edge engravings */}
        <div className="absolute inset-4 rounded-xl pointer-events-none"
          style={{ border: '1px solid rgba(196,114,138,0.12)' }} />
      </div>

      {/* ─── THE HOLE ITSELF ─── */}
      <svg
        className="absolute"
        width="200" height="270"
        viewBox="0 0 200 270"
        style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.95))' }}
      >
        <defs>
          {/* Rim gradient — lighter at top-left (light source), darker at bottom-right */}
          <radialGradient id="rimGrad" cx="38%" cy="30%" r="75%">
            <stop offset="0%"   stopColor="rgba(80,30,45,0.9)" />
            <stop offset="40%"  stopColor="rgba(25,8,16,0.95)" />
            <stop offset="100%" stopColor="rgba(0,0,0,1)" />
          </radialGradient>

          {/* Deep hole: perfectly black core with depth rings */}
          <radialGradient id="holeDeep" cx="50%" cy="42%" r="55%">
            <stop offset="0%"   stopColor="rgba(0,0,0,1)" />
            <stop offset="60%"  stopColor="rgba(3,1,2,1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,1)" />
          </radialGradient>

          {/* Hole edge rim — the lit "bevel" on the top edge */}
          <linearGradient id="topRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(196,114,138,0.28)" />
            <stop offset="100%" stopColor="rgba(196,114,138,0)" />
          </linearGradient>

          <clipPath id="holeMask">
            {/* Top circle of keyhole */}
            <circle cx="100" cy="102" r="48" />
            {/* Bottom trapezoid */}
            <path d="M74 146 L62 230 L138 230 L126 146 Z" />
          </clipPath>
        </defs>

        {/* The hole — filled with pure blackness */}
        <g clipPath="url(#holeMask)">
          {/* Absolute black fill */}
          <rect x="0" y="0" width="200" height="270" fill="#000000" />

          {/* Depth gradient — subtle variation so it doesn't look flat */}
          <circle cx="100" cy="102" r="48" fill="url(#rimGrad)" opacity="0.6" />

          {/* Inner depth rings (concentric) to create 3D recess illusion */}
          <circle cx="100" cy="104" r="44" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="6" />
          <circle cx="100" cy="106" r="36" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="5" />
          <circle cx="100" cy="108" r="27" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="4" />
        </g>

        {/* ── Beveled rim — top highlight on the hole edge ── */}
        {/* Circle rim */}
        <circle cx="100" cy="102" r="48"
          fill="none" stroke="url(#topRim)" strokeWidth="2.5" />

        {/* The very top edge gets a hair of rose-gold light (top of the bevel) */}
        <path d="M 62 92 A 48 48 0 0 1 138 92"
          fill="none" stroke="rgba(220,160,185,0.35)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Bottom trapezoid rim */}
        <path d="M74 146 L62 230 L138 230 L126 146 Z"
          fill="none" stroke="rgba(180,100,130,0.2)" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Left inner shadow of trapezoid (3d left wall of hole) */}
        <path d="M74 146 L62 230"
          stroke="rgba(255,180,210,0.12)" strokeWidth="1" strokeLinecap="round" />

        {/* Hole edge outer shadow to blend into plate */}
        <circle cx="100" cy="102" r="49.5"
          fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="4" />
        <path d="M73.5 147 L61 231 L139 231 L127.5 147"
          fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="4" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Progress dots — rose theme
───────────────────────────────────────────────────── */
function TapProgress({ taps }: { taps: number }) {
  return (
    <div className="flex gap-2.5 items-center justify-center">
      {[...Array(TOTAL_TAPS)].map((_, i) => (
        <motion.div key={i}
          animate={i < taps ? { scale: [1, 1.5, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            width:  i < taps ? 10 : 7,
            height: i < taps ? 10 : 7,
            borderRadius: '50%',
            background: i < taps
              ? 'radial-gradient(circle, #F5D0DC, #C4728A)'
              : 'rgba(196,114,138,0.22)',
            border: i < taps ? 'none' : '1px solid rgba(196,114,138,0.32)',
            boxShadow: i < taps ? '0 0 8px rgba(196,114,138,0.65)' : 'none',
            transition: 'all 0.3s',
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────── */
export function IntroLock({ onUnlocked }: { onUnlocked: () => void }) {
  const [taps, setTaps] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [phase, setPhase] = useState<'locked' | 'unlocking' | 'fading'>('locked');
  const keyAnim = useAnimation();
  const processingRef = useRef(false);

  const progress = Math.min(taps / TOTAL_TAPS, 1);

  /* Key entrance: starts tiny + far (small scale) then floats to rest position above hole */
  useEffect(() => {
    keyAnim.start({
      scale: 0.28,
      opacity: 1,
      y: -190,
      transition: { duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
    });
  }, [keyAnim]);

  const handlePointer = useCallback((e: React.PointerEvent) => {
    if (phase !== 'locked' || processingRef.current) return;
    e.preventDefault();

    const id = Date.now() + Math.random();
    setRipples(r => [...r, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setRipples(r => r.filter(item => item.id !== id)), 900);

    setTaps(prev => {
      const next = Math.min(prev + 1, TOTAL_TAPS);
      const prog = next / TOTAL_TAPS;

      if (next >= TOTAL_TAPS) {
        processingRef.current = true;
        setPhase('unlocking');

        // Key zooms in fully — as if coming all the way to the viewer
        keyAnim.start({
          scale: 3.5,
          y: 0,
          opacity: [1, 1, 0],
          transition: { duration: 1.0, ease: [0.4, 0, 0.2, 1] },
        });

        setTimeout(() => setPhase('fading'), 900);
        setTimeout(() => onUnlocked(), 1900);
      } else {
        // Each tap: key zooms slightly closer (scale grows) and moves toward hole
        // scale: 0.28 → 0.9 over taps 0→9, y: -190 → -60
        const newScale = 0.28 + prog * 0.62;
        const newY    = -190 + prog * 130;

        keyAnim.start({
          scale: newScale,
          y: [newY - 12, newY + 4, newY - 3, newY],   // jiggle on tap
          rotate: [-3, 3, -1.5, 0],
          transition: { duration: 0.4, ease: 'easeOut' },
        });
      }
      return next;
    });
  }, [phase, keyAnim, onUnlocked]);

  return (
    <AnimatePresence>
      {phase !== 'fading' ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none touch-none overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 50% 35%, #1A0812 0%, #0E0509 45%, #060203 100%)',
            cursor: 'pointer',
          }}
          onPointerDown={handlePointer}
        >
          {/* ── Fine particle starfield (pink/mauve tinted) ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(70)].map((_, i) => {
              const colors = ['rgba(240,168,190,', 'rgba(196,114,138,', 'rgba(184,156,216,', 'rgba(255,210,225,'];
              const col = colors[i % colors.length];
              return (
                <motion.div key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 1.8 + 0.8,
                    height: Math.random() * 1.8 + 0.8,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `${col}${0.25 + Math.random() * 0.55})`,
                  }}
                  animate={{ opacity: [0.15, 0.85, 0.15] }}
                  transition={{ duration: 1.8 + Math.random() * 3.5, repeat: Infinity, delay: Math.random() * 5 }}
                />
              );
            })}
          </div>

          {/* ── Very subtle vignette ── */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />

          {/* ── Tap ripples ── */}
          <AnimatePresence>
            {ripples.map(r => (
              <motion.div key={r.id}
                className="fixed pointer-events-none rounded-full"
                style={{ left: r.x, top: r.y, x: '-50%', y: '-50%', background: 'radial-gradient(circle, rgba(196,114,138,0.4) 0%, rgba(240,168,190,0.12) 50%, transparent 70%)' }}
                initial={{ width: 0, height: 0, opacity: 0.9 }}
                animate={{ width: 180, height: 180, opacity: 0 }}
                exit={{}}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>

          {/* ── MAIN 3D SCENE ── */}
          {/* Wrap in perspective container so the scale looks like true Z-axis movement */}
          <div style={{ perspective: '900px', perspectiveOrigin: '50% 50%', position: 'relative' }}>
            <div className="flex flex-col items-center" style={{ position: 'relative' }}>

              {/* Key (flies toward viewer on Z axis) */}
              <motion.div
                animate={keyAnim}
                initial={{ scale: 0.04, opacity: 0, y: -190, rotate: 0 }}
                style={{
                  position: 'absolute',
                  top: 0, left: '50%', marginLeft: -48,
                  zIndex: 30,
                  transformOrigin: 'center bottom',
                }}
              >
                <MedievalKey progress={progress} />
              </motion.div>

              {/* Keyhole plate (static, centered) */}
              <div style={{ position: 'relative', zIndex: 10, marginTop: 90 }}>
                <KeyholeHole />
              </div>
            </div>
          </div>

          {/* ── Instructions & progress ── */}
          <motion.div
            className="absolute bottom-16 flex flex-col items-center gap-4"
            animate={phase === 'unlocking' ? { opacity: 0, y: 8 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.p
              key={taps}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="font-sans text-[11px] tracking-[0.32em] uppercase"
              style={{ color: 'rgba(196,114,138,0.7)' }}
            >
              {taps === 0
                ? 'Tap anywhere to unlock'
                : taps >= TOTAL_TAPS
                  ? 'Opening…'
                  : `${TOTAL_TAPS - taps} tap${TOTAL_TAPS - taps !== 1 ? 's' : ''} remaining`}
            </motion.p>
            <TapProgress taps={taps} />
          </motion.div>

          {/* ── Fade-out overlay ── */}
          <AnimatePresence>
            {phase === 'unlocking' && (
              <motion.div
                key="flash"
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 48%, rgba(240,168,190,0.18) 0%, rgba(0,0,0,0) 65%)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.8, times: [0, 0.2, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Final black-fade exit */
        <motion.div
          key="exit"
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{ background: '#060203' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}
