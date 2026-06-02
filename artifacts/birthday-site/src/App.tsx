import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { TimelineSector } from "./components/TimelineSector";
import { FloatingBalloons, ConfettiBurst, Sparkles, FloatingSpores } from "./components/Sparkles";
import { IntroLock } from "./components/IntroLock";

const queryClient = new QueryClient();

const CHAPTERS = [
  { label: "Chapter", title: "The Party Forms", description: "Every great adventure begins with the right people beside you. AJ, you are the kind of friend that makes every quest worth taking." },
  { label: "Chapter", title: "Lights in the Dark", description: "Like fairy lights spelling out a message across the wall — you always find the brightest way to reach people, even through the darkest moments." },
  { label: "Chapter", title: "Castle Byers Days", description: "The quiet hideaways, the small kingdoms we build for ourselves — yours has always been filled with imagination, warmth, and something wonderfully your own." },
  { label: "Chapter", title: "Dustin's Grin", description: "That laugh of yours — completely unfiltered and full — is the best sound in any room. The world genuinely needs more of it, AJ." },
  { label: "Chapter", title: "Eleven's Spark", description: "There is a power in you that you are only just beginning to understand. Rare, extraordinary, and completely unlike anyone else." },
  { label: "Chapter", title: "Max on Her Board", description: "Rolling through life with fearless energy, listening to the perfect song. AJ moves to her own rhythm — and she moves beautifully." },
  { label: "Chapter", title: "Hawkins at Dawn", description: "Soft morning light, quiet streets, the smell of something good. The peaceful moments that make the ordinary feel sacred and worth staying for." },
  { label: "Chapter", title: "The Snowball Dance", description: "That moment when everything is exactly right — the right song playing, the right people around you. AJ makes every room feel like that." },
  { label: "Chapter", title: "Bike Rides at Dusk", description: "Chasing the golden hour across open roads, wind in your hair, surrounded by the people who matter most. Pure, uncomplicated joy." },
  { label: "Chapter", title: "Wheeler's Basement", description: "Long nights, deep conversations, and laughter that echoes long after everyone's gone home. Some of the best memories are made in unexpected rooms." },
  { label: "Chapter", title: "The Forest Glows", description: "Even in the strange and unexpected, you find beauty. AJ has always seen the magic in things that other people walk right past." },
  { label: "Chapter", title: "Walkie-Talkie Nights", description: "All the late-night check-ins, the long calls, the 'do you copy?'s — your voice is always the one everyone wants to hear on the other end." },
  { label: "Chapter", title: "Hawkins at Sunset", description: "That warm amber light settling over everything, the kind that makes you stop and feel genuinely grateful just to be alive and right here." },
  { label: "Chapter", title: "Eleven's Truth", description: "The moment someone fully, unapologetically becomes themselves — no performance, no apology. That is the most beautiful kind of power there is." },
  { label: "Chapter", title: "Will's Quiet Strength", description: "Gentle does not mean weak. Soft does not mean small. AJ carries a strength inside her kindness that quietly moves mountains every single day." },
  { label: "Chapter", title: "Friends Don't Lie", description: "The most sacred rule of any party. AJ has always been the most honest, loyal, and genuinely real — in every version of the world." },
  { label: "Chapter", title: "Running Up That Hill", description: "When the right song plays and everything suddenly feels possible — that is the exact energy AJ brings into every single room she walks into." },
  { label: "Chapter", title: "Together, Always", description: "This chapter has no ending. Like the best stories, this one just keeps going and growing — and we are so grateful to be part of yours." },
];

/* ── Walkie-talkie style divider icon ── */
function WalkieTalkieIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none" style={{ color: 'rgba(232,160,32,0.6)' }}>
      <rect x="4" y="6" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <rect x="6" y="10" width="6" height="4" rx="0.8" stroke="currentColor" strokeWidth="0.9" />
      <line x1="7" y1="17" x2="11" y2="17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 6 L7 3 L11 3 L11 6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="9" cy="1.5" r="1" fill="currentColor" />
      {/* Signal waves */}
      <path d="M1 4 Q0 2, 2 1" stroke="currentColor" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M17 4 Q18 2, 16 1" stroke="currentColor" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function STDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="rose-line flex-1 max-w-[80px]" />
      <svg width="10" height="10" viewBox="0 0 20 20" style={{ color: 'rgba(232,160,32,0.5)' }} fill="currentColor">
        <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
      </svg>
      <svg width="16" height="16" viewBox="0 0 20 20" style={{ color: '#E8A020' }} fill="currentColor">
        <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
      </svg>
      <svg width="10" height="10" viewBox="0 0 20 20" style={{ color: 'rgba(232,160,32,0.5)' }} fill="currentColor">
        <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
      </svg>
      <div className="rose-line flex-1 max-w-[80px]" />
    </div>
  );
}

/* ── Fairy lights string ── */
function FairyLightsStrip() {
  const bulbColors = ['#FF3030','#4FC8F0','#E8A020','#30C040','#C040E0','#FFE030','#FF6080','#40C8FF'];
  const count = 22;
  return (
    <div className="w-full pointer-events-none" style={{ height: 54, overflow: 'visible' }}>
      <svg viewBox={`0 0 880 54`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
        {/* Wire */}
        <path
          d={`M0,14 ` + Array.from({ length: count }, (_, i) => {
            const x = (i + 0.5) * (880 / count);
            const nextX = (i + 1) * (880 / count);
            return `Q${x},22 ${nextX},14`;
          }).join(' ')}
          stroke="rgba(100,80,50,0.45)"
          strokeWidth="1.5"
          fill="none"
        />
        {Array.from({ length: count }, (_, i) => {
          const cx = (i + 0.5) * (880 / count);
          const color = bulbColors[i % bulbColors.length];
          return (
            <g key={i}>
              <line x1={cx} y1={14} x2={cx} y2={22} stroke="rgba(80,60,40,0.4)" strokeWidth="1" />
              <ellipse cx={cx} cy={36} rx={5.5} ry={7.5} fill={color} opacity={0.88}
                style={{ filter: `drop-shadow(0 0 5px ${color}CC)`, animation: `fairy-flicker ${1.5 + (i % 5) * 0.4}s ease-in-out ${(i * 0.18) % 2}s infinite` }} />
              <ellipse cx={cx - 1.5} cy={33} rx={1.5} ry={1.2} fill="rgba(255,255,255,0.55)" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -50]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-dynamic overflow-x-hidden">
      <AnimatedBackground />

      {/* Film grain */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <main className="relative z-10 flex flex-col items-center">

        {/* ── Fairy lights top strip ── */}
        <div className="w-full fixed top-0 z-30 pointer-events-none" style={{ opacity: 0.9 }}>
          <FairyLightsStrip />
        </div>

        {/* ── HERO ── */}
        <section className="w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 text-center relative pt-16">
          <Sparkles count={22} colors={['#E8A020','#4FC8F0','#FFD860','#FF4040','#A8ECFF','#C8A8FF']} className="z-0" />

          {/* Rotating rings — amber/cyan */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[min(65vw,480px)] h-[min(65vw,480px)] rounded-full animate-spin-slow"
              style={{ border: '1px solid rgba(232,160,32,0.12)' }} />
            <div className="absolute w-[min(50vw,360px)] h-[min(50vw,360px)] rounded-full animate-spin-reverse-slow"
              style={{ border: '1px solid rgba(79,200,240,0.14)' }} />
            <div className="absolute w-[min(36vw,260px)] h-[min(36vw,260px)] rounded-full animate-spin-slow"
              style={{ border: '1px dashed rgba(232,160,32,0.07)', animationDuration: '50s' }} />
          </div>

          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-4xl">

            {/* Walkie-talkie icon */}
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.15, type: 'spring', stiffness: 130 }}
              className="flex justify-center mb-5"
            >
              <WalkieTalkieIcon />
            </motion.div>

            {/* For USR tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="rose-line w-16" />
              <span className="text-[10px] md:text-xs font-sans font-semibold tracking-[0.38em] uppercase" style={{ color: '#E8A020' }}>
                Transmitting from Hawkins, IN
              </span>
              <div className="rose-line w-16" />
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-serif font-bold tracking-tight leading-[1.08] mb-1">
                <span
                  className="block text-6xl md:text-8xl lg:text-9xl"
                  style={{ color: '#F0E8D8', textShadow: '0 0 80px rgba(232,160,32,0.3), 0 2px 4px rgba(0,0,0,0.9)' }}
                >
                  Happy
                </span>
                {/* ST title-card red shimmer on "Birthday" */}
                <span className="block" style={{ filter: 'drop-shadow(0 2px 20px rgba(220,40,40,0.6))' }}>
                  <span
                    className="block text-7xl md:text-9xl lg:text-[10rem] italic"
                    style={{
                      background: 'linear-gradient(90deg, #5A0A0A 0%, #CC2020 18%, #FF3030 35%, #FF7030 50%, #FF3030 65%, #CC2020 82%, #5A0A0A 100%)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'rose-shimmer 4s linear infinite',
                    }}
                  >
                    Birthday
                  </span>
                </span>
              </h1>

              {/* Script name: USR — electric cyan glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-2 mb-1"
                style={{ filter: 'drop-shadow(0 2px 14px rgba(79,200,240,0.55))' }}
              >
                <span
                  className="font-script text-5xl md:text-6xl lg:text-7xl"
                  style={{
                    display: 'inline-block',
                    padding: '0.08em 0.32em 0.28em 0.32em',
                    background: 'linear-gradient(90deg, #0A2040 0%, #1A6AAA 30%, #4FC8F0 50%, #A8ECFF 65%, #4FC8F0 80%, #1A6AAA 90%, #0A2040 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'rose-shimmer 5s linear infinite',
                  }}
                >
                  USR
                </span>
              </motion.div>
            </motion.div>

            {/* AJ badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="flex justify-center mt-4 mb-2"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans font-semibold tracking-[0.25em] uppercase"
                style={{
                  background: 'rgba(232,160,32,0.08)',
                  border: '1px solid rgba(232,160,32,0.28)',
                  color: '#FFD860',
                  boxShadow: '0 0 20px rgba(232,160,32,0.1)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 20 20" fill="#FFD860">
                  <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
                </svg>
                always rooting for you, AJ
                <svg width="10" height="10" viewBox="0 0 20 20" fill="#FFD860">
                  <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
                </svg>
              </span>
            </motion.div>

            {/* Sub text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="font-sans text-sm md:text-base tracking-[0.15em] mt-5 max-w-sm mx-auto"
              style={{ color: 'rgba(240,220,160,0.55)' }}
            >
              Every year is a new chapter of your story
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 1.2, delay: 1.4 }}
              className="origin-top mx-auto mt-12"
              style={{ width: 1, height: 72, background: 'linear-gradient(to bottom, rgba(232,160,32,0.6), transparent)' }}
            />
            <motion.div
              animate={{ opacity: [0, 0.7, 0], y: [0, 7, 0] }}
              transition={{ duration: 2, delay: 1.6, repeat: Infinity }}
              className="mx-auto mt-1 flex justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(232,160,32,0.5)' }}>
                <path d="M8 12 L2 5 L3.4 3.6 L8 9.2 L12.6 3.6 L14 5 Z" fill="currentColor" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ── INTRO BAND ── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full py-10 px-4 text-center"
        >
          <STDivider />
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-sans my-4" style={{ color: 'rgba(232,160,32,0.4)' }}>
            Do you copy? — Playing back the memories
          </p>
          <STDivider />
        </motion.section>

        {/* ── TIMELINE ── */}
        <section className="w-full py-10 px-4 md:px-8 relative">
          <div
            className="hidden xl:block absolute left-6 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(232,160,32,0.1), transparent)' }}
          />
          <div
            className="hidden xl:block absolute right-6 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(79,200,240,0.1), transparent)' }}
          />
          <div className="max-w-6xl mx-auto flex flex-col gap-4">
            {CHAPTERS.map((chapter, index) => (
              <TimelineSector
                key={index}
                number={index + 1}
                label={chapter.label}
                title={chapter.title}
                description={chapter.description}
                isEven={index % 2 === 1}
              />
            ))}
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section className="w-full min-h-[90dvh] flex flex-col items-center justify-center p-6 pb-24 text-center relative overflow-x-hidden">
          <FloatingBalloons count={6} />
          <ConfettiBurst />
          <FloatingSpores count={20} />
          <Sparkles count={30} colors={['#E8A020','#4FC8F0','#FFD860','#FF4040','#A8ECFF','#C8A8FF','#FF8030']} />

          {/* Radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[700px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(232,160,32,0.06) 0%, rgba(79,200,240,0.04) 50%, transparent 70%)' }} />
          </div>

          {/* Bottom fairy lights */}
          <div className="absolute bottom-0 w-full pointer-events-none" style={{ transform: 'rotate(180deg)' }}>
            <FairyLightsStrip />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 max-w-3xl w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <WalkieTalkieIcon />
            </motion.div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="rose-line w-16" />
              <svg width="16" height="16" viewBox="0 0 20 20" fill="#E8A020">
                <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
              </svg>
              <div className="rose-line w-16" />
            </div>

            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-serif italic mb-2 leading-tight"
              style={{ color: '#F0E8D8', textShadow: '0 0 40px rgba(232,160,32,0.2)' }}
            >
              To Many More,
            </h2>

            {/* Script USR — cyan shimmer */}
            <div style={{ filter: 'drop-shadow(0 2px 14px rgba(79,200,240,0.5))' }}>
              <span
                className="font-script text-4xl md:text-6xl lg:text-7xl"
                style={{
                  display: 'inline-block',
                  padding: '0.08em 0.32em 0.28em 0.32em',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(90deg, #0A2040, #1A6AAA, #4FC8F0, #A8ECFF, #4FC8F0, #1A6AAA, #0A2040)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'rose-shimmer 5s linear infinite',
                }}
              >
                USR
              </span>
            </div>

            <div className="rose-line w-24 mx-auto mb-8" />

            <p className="text-base md:text-xl leading-relaxed mb-5 max-w-lg mx-auto font-sans" style={{ color: 'rgba(240,220,160,0.65)' }}>
              May every adventure you take be better than the last.
              May every chapter surprise you, and may your people always find their way back to you.
              You are one of a kind, AJ.
            </p>
            <p className="text-sm md:text-base leading-relaxed mb-14 max-w-md mx-auto font-sans" style={{ color: 'rgba(200,180,100,0.45)' }}>
              The World Wont Be F_N Without "U", How Would I LA_GH Without "U".
              Thank You For Being The Most Wonderful Person In The World, And For Being You. My Dearest Friend, My Sunshine.
            </p>

            <STDivider />

            {/* "A Very Happy Birthday, USR!" — amber shimmer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 100 }}
              className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold mt-10"
              style={{ filter: 'drop-shadow(0 2px 20px rgba(232,160,32,0.45))' }}
            >
              <span style={{
                display: 'block',
                background: 'linear-gradient(90deg, #5A3000 0%, #C87010 18%, #E8A020 35%, #FFD860 50%, #E8A020 65%, #C87010 82%, #5A3000 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'rose-shimmer 4s linear infinite',
              }}>
                A Very Happy Birthday, USR!
              </span>
            </motion.div>

            {/* Star row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.9 }}
              className="mt-14 flex items-center justify-center gap-3 relative z-30 pointer-events-none"
            >
              {[9, 12, 18, 12, 9].map((size, i) => (
                <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor"
                  className="text-primary" style={{ opacity: i === 2 ? 0.9 : 0.4 }}>
                  <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
                </svg>
              ))}
            </motion.div>

            {/* Closing AJ tag */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-8"
            >
              <span className="font-script text-3xl" style={{ color: 'rgba(232,160,32,0.55)' }}>
                with all love for AJ
              </span>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {!unlocked && <IntroLock onUnlocked={() => setUnlocked(true)} />}
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
