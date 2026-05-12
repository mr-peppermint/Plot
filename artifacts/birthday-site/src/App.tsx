import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { TimelineSector } from "./components/TimelineSector";
import { FloatingBalloons, ConfettiBurst, Sparkles } from "./components/Sparkles";

const queryClient = new QueryClient();

const CHAPTERS = [
  { label: "Chapter", title: "The Beginning", description: "Where the story started — a moment full of promise and the quiet excitement of what was yet to come." },
  { label: "Memory", title: "A Golden Moment", description: "The kind of day that feels painted in sunlight. Laughter echoing, the air carrying warmth." },
  { label: "Year", title: "First Milestones", description: "Taking those brave first steps. The world seemed impossibly big, but you were ready for it." },
  { label: "Chapter", title: "Shared Smiles", description: "Surrounded by loved ones. A simple gathering that turned into an unforgettable memory." },
  { label: "Memory", title: "Unexpected Adventures", description: "Taking a wrong turn and finding the right place. Spontaneity at its absolute finest." },
  { label: "Year", title: "Growing Wings", description: "Learning to fly — the challenges faced only made the triumphs that much sweeter." },
  { label: "Chapter", title: "Quiet Reflection", description: "A peaceful afternoon. Finding comfort in silence and clarity in the calm." },
  { label: "Memory", title: "Wild Laughter", description: "Tears streaming down from laughing too hard. Pure, unadulterated joy in every breath." },
  { label: "Year", title: "New Horizons", description: "Looking out at an unfamiliar view. Fear of the unknown replaced by undeniable excitement." },
  { label: "Chapter", title: "Warm Embraces", description: "A hug that felt like coming home — knowing exactly where you belonged in this world." },
  { label: "Memory", title: "Dancing in the Rain", description: "Refusing to wait for the storm to pass. Embracing the beautiful, glorious mess of life." },
  { label: "Year", title: "Deep Conversations", description: "Talking until dawn. Words that shifted perspectives and deepened bonds forever." },
  { label: "Chapter", title: "Brilliant Sunsets", description: "Watching the sky catch fire together. A reminder that endings can be breathtaking." },
  { label: "Memory", title: "A Spark of Genius", description: "That one 'aha' moment — when everything clicked and suddenly the path was crystal clear." },
  { label: "Year", title: "Finding Strength", description: "Realizing you were tougher than you ever imagined. A quiet resilience taking root." },
  { label: "Chapter", title: "Celebrating Wins", description: "Raising a glass to hard work paying off. Basking in the glow of hard-earned accomplishment." },
  { label: "Memory", title: "A Perfect Melody", description: "A song playing at precisely the right moment — music forever intertwined with a memory." },
  { label: "Year", title: "The Present Joy", description: "Here and now. Looking back with gratitude and forward with nothing but brilliant, shining hope." },
];

function CrownIcon() {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="text-primary">
      <path
        d="M3 24 L6 8 L12 16 L18 4 L24 16 L30 8 L33 24 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path d="M1 24 L35 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="3" cy="8" r="2" fill="currentColor" />
      <circle cx="18" cy="4" r="2" fill="currentColor" />
      <circle cx="33" cy="8" r="2" fill="currentColor" />
    </svg>
  );
}

function RoyalDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="gold-line flex-1 max-w-[80px]" />
      <svg width="10" height="10" viewBox="0 0 10 10" className="text-primary/60" fill="currentColor">
        <polygon points="5,0 6.2,3.8 10,5 6.2,6.2 5,10 3.8,6.2 0,5 3.8,3.8" />
      </svg>
      <svg width="18" height="18" viewBox="0 0 20 20" className="text-primary" fill="currentColor">
        <path d="M10 0 L11.8 8.2 L20 10 L11.8 11.8 L10 20 L8.2 11.8 L0 10 L8.2 8.2 Z" />
      </svg>
      <svg width="10" height="10" viewBox="0 0 10 10" className="text-primary/60" fill="currentColor">
        <polygon points="5,0 6.2,3.8 10,5 6.2,6.2 5,10 3.8,6.2 0,5 3.8,3.8" />
      </svg>
      <div className="gold-line flex-1 max-w-[80px]" />
    </div>
  );
}

function FloralAccent({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="100"
      height="50"
      viewBox="0 0 100 50"
      fill="none"
      className={`text-primary/35 ${flip ? 'scale-x-[-1]' : ''}`}
    >
      <path d="M5 42 Q 25 8, 50 26 Q 75 44, 95 8" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="5" cy="42" r="2.5" fill="currentColor" />
      <circle cx="50" cy="26" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="95" cy="8" r="2.5" fill="currentColor" />
      <path d="M28 20 Q 31 10 38 18" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <circle cx="33" cy="13" r="1.5" fill="currentColor" opacity="0.5" />
      <path d="M62 35 Q 68 25 72 33" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <circle cx="67" cy="28" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -50]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-dynamic overflow-hidden">
      <AnimatedBackground />

      {/* Fine noise grain */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <main className="relative z-10 flex flex-col items-center">

        {/* ── HERO ── */}
        <section className="w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 text-center relative">
          <Sparkles count={22} colors={['#D4AF37', '#F5D98A', '#A080D8', '#6482DC', '#E8D5A3']} className="z-0" />

          {/* Rotating royal rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[min(65vw,480px)] h-[min(65vw,480px)] rounded-full animate-spin-slow"
              style={{ border: '1px solid rgba(201,168,76,0.12)' }}
            />
            <div
              className="absolute w-[min(50vw,360px)] h-[min(50vw,360px)] rounded-full animate-spin-reverse-slow"
              style={{ border: '1px solid rgba(114,50,160,0.15)' }}
            />
            <div
              className="absolute w-[min(38vw,270px)] h-[min(38vw,270px)] rounded-full animate-spin-slow"
              style={{ border: '1px dashed rgba(201,168,76,0.08)', animationDuration: '50s' }}
            />
          </div>

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 max-w-4xl"
          >
            {/* Crown */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, type: 'spring', stiffness: 120 }}
              className="flex justify-center mb-6"
            >
              <CrownIcon />
            </motion.div>

            {/* Tagline with floral accents */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-5"
            >
              <FloralAccent />
              <span className="text-[10px] md:text-xs font-sans font-semibold tracking-[0.35em] uppercase" style={{ color: '#C9A84C' }}>
                A Royal Celebration
              </span>
              <FloralAccent flip />
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-serif font-bold tracking-tight leading-none mb-2">
                <span
                  className="block text-6xl md:text-8xl lg:text-9xl"
                  style={{ color: '#F5EDD8', textShadow: '0 0 80px rgba(201,168,76,0.3), 0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  Happy
                </span>
                <span
                  className="block text-7xl md:text-9xl lg:text-[10rem] italic"
                  style={{
                    background: 'linear-gradient(90deg, #8B6914 0%, #C9A84C 18%, #F5D98A 35%, #FFF3C0 50%, #F5D98A 65%, #C9A84C 82%, #8B6914 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gold-shimmer 4s linear infinite',
                    filter: 'drop-shadow(0 2px 16px rgba(201,168,76,0.5))',
                  }}
                >
                  Birthday
                </span>
              </h1>
            </motion.div>

            {/* Sub text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="font-sans text-sm md:text-base tracking-[0.18em] mt-8 max-w-sm mx-auto"
              style={{ color: 'rgba(201,168,76,0.65)' }}
            >
              Every year tells a story — yours is one worth celebrating
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 1.4, delay: 2.2 }}
              className="origin-top mx-auto mt-14"
              style={{ width: 1, height: 80, background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)' }}
            />
            <motion.div
              animate={{ opacity: [0, 0.8, 0], y: [0, 8, 0] }}
              transition={{ duration: 2, delay: 2.6, repeat: Infinity }}
              className="mx-auto mt-1 flex justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(201,168,76,0.5)' }}>
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
          <RoyalDivider />
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-sans my-4 text-gold-muted">
            Scroll through the memories
          </p>
          <RoyalDivider />
        </motion.section>

        {/* ── TIMELINE ── */}
        <section className="w-full py-10 px-4 md:px-8 relative">
          {/* Side accent lines */}
          <div
            className="hidden xl:block absolute left-6 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.12), transparent)' }}
          />
          <div
            className="hidden xl:block absolute right-6 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(114,50,160,0.12), transparent)' }}
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
        <section className="w-full min-h-[90dvh] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <FloatingBalloons count={6} />
          <ConfettiBurst />
          <Sparkles count={28} colors={['#D4AF37', '#F5D98A', '#A080D8', '#6482DC', '#C8A2C8', '#FFE9A0']} />

          {/* Royal radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[700px] h-[700px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, rgba(114,50,160,0.05) 50%, transparent 70%)',
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-3xl"
          >
            {/* Crown at top of closing */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <CrownIcon />
            </motion.div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <FloralAccent />
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" className="text-primary">
                <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
              </svg>
              <FloralAccent flip />
            </div>

            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-serif italic mb-6 leading-tight"
              style={{ color: '#F0E4C8', textShadow: '0 0 40px rgba(201,168,76,0.2)' }}
            >
              To Many More
            </h2>

            {/* Gold rule */}
            <div className="gold-line w-24 mx-auto mb-8" />

            <p className="text-base md:text-xl leading-relaxed mb-5 max-w-lg mx-auto font-sans text-gold-muted">
              May this year bring you boundless joy, unexpected adventures,
              and peace in the quiet moments in between.
            </p>
            <p className="text-sm md:text-base leading-relaxed mb-14 max-w-md mx-auto font-sans text-parchment">
              You deserve every beautiful thing coming your way.
              The world is richer — and brighter — with you in it.
            </p>

            <RoyalDivider />

            {/* Final word */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.5, type: 'spring', stiffness: 100 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mt-10"
              style={{
                background: 'linear-gradient(90deg, #8B6914 0%, #C9A84C 18%, #F5D98A 35%, #FFF3C0 50%, #F5D98A 65%, #C9A84C 82%, #8B6914 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gold-shimmer 4s linear infinite',
                filter: 'drop-shadow(0 2px 16px rgba(201,168,76,0.5))',
              }}
            >
              Happy Birthday!
            </motion.div>

            {/* Star row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 1 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              {[16, 10, 20, 10, 16].map((size, i) => (
                <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className="text-primary" style={{ opacity: i === 2 ? 1 : 0.5 }}>
                  <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
                </svg>
              ))}
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
