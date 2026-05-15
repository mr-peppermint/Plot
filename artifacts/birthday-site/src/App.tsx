import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { TimelineSector } from "./components/TimelineSector";
import { FloatingBalloons, ConfettiBurst, Sparkles } from "./components/Sparkles";
import { IntroLock } from "./components/IntroLock";

const queryClient = new QueryClient();

const CHAPTERS = [
  { label: "Memory", title: "From the Very Start", description: "From the moment you arrived, the world became a brighter, softer place. You were magic from day one, Angel." },
  { label: "Memory", title: "First Smile", description: "That smile of yours — the one that lights up every room — made its debut and nobody has been the same since." },
  { label: "Memory", title: "Growing So Gracefully", description: "Every step you took, every word you spoke — full of the grace and light that only AJ could carry." },
  { label: "Memory", title: "Shared Giggles", description: "Laughing until it hurt. The kind of joy that stays with you long after the moment fades." },
  { label: "Memory", title: "Unexpected Sparkle", description: "You have this way of finding magic in ordinary moments. Only Angel could see the world quite like that." },
  { label: "Memory", title: "Finding Her Wings", description: "Brave, bold, and beautifully herself — AJ spreading her wings and owning every moment." },
  { label: "Memory", title: "Quiet Mornings", description: "Soft light, warm tea, and that peaceful look on your face. Cherished moments just like you." },
  { label: "Memory", title: "Dancing Through Life", description: "You move through life like a song — effortlessly, joyfully, and always in perfect rhythm." },
  { label: "Memory", title: "New Adventures", description: "Each new horizon she met with sparkling eyes and an open heart. That courage is so uniquely Angel." },
  { label: "Memory", title: "Warm Hugs", description: "A hug from you feels like coming home. Safe, warm, and full of love — just like you always are." },
  { label: "Memory", title: "Glowing in the Rain", description: "Even on cloudy days, AJ managed to shine. That light of yours cannot be dimmed by anything." },
  { label: "Memory", title: "Late Night Dreams", description: "Talking about everything and nothing. The conversations that stitched hearts closer together." },
  { label: "Memory", title: "Golden Sunsets", description: "Watching the sky blush pink and gold — the perfect backdrop for someone as beautiful as you." },
  { label: "Memory", title: "Her Spark of Brilliance", description: "That moment when Angel's eyes lit up with an idea. Pure genius wrapped in the sweetest soul." },
  { label: "Memory", title: "Quiet Strength", description: "Soft as petals, strong as roses. AJ's resilience is one of the most beautiful things about her." },
  { label: "Memory", title: "Every Win Celebrated", description: "Every achievement, big or small, celebrated with the enthusiasm only Angel deserves." },
  { label: "Memory", title: "A Song for AJ", description: "If your life were a melody, it would be the most beautiful thing anyone has ever heard." },
  { label: "Memory", title: "Right Here, Right Now", description: "Today, looking at you — full of grace and love and light — we are so grateful for every day with Angel." },
];

function HeartIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 36 32" fill="none">
      <path
        d="M18 28 C18 28 3 18 3 10 C3 5.5 6.5 2 11 2 C14 2 16.5 3.8 18 6.2 C19.5 3.8 22 2 25 2 C29.5 2 33 5.5 33 10 C33 18 18 28 18 28Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
        className="text-primary"
      />
      <circle cx="11" cy="8" r="1.5" fill="currentColor" className="text-primary" />
    </svg>
  );
}

function FeminineFloral({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="90"
      height="44"
      viewBox="0 0 90 44"
      fill="none"
      className={`${flip ? 'scale-x-[-1]' : ''}`}
      style={{ color: 'rgba(196,114,138,0.4)' }}
    >
      <path d="M4 38 Q 22 8, 45 22 Q 68 38, 86 8" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="4" cy="38" r="2.5" fill="currentColor" />
      <circle cx="45" cy="22" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="86" cy="8" r="2.5" fill="currentColor" />
      {/* Small flower at midpoint */}
      <circle cx="45" cy="22" r="4" stroke="currentColor" strokeWidth="0.7" fill="none" />
      <path d="M24 17 Q 27 9 34 15" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <circle cx="29" cy="11" r="1.5" fill="currentColor" opacity="0.6" />
      <path d="M56 28 Q 62 20 66 26" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <circle cx="62" cy="21" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function RoseDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-5">
      <div className="rose-line flex-1 max-w-[80px]" />
      <svg width="10" height="9" viewBox="0 0 20 18" style={{ color: 'rgba(196,114,138,0.55)' }} fill="currentColor">
        <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" />
      </svg>
      <svg width="18" height="16" viewBox="0 0 20 18" style={{ color: '#C4728A' }} fill="currentColor">
        <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" />
      </svg>
      <svg width="10" height="9" viewBox="0 0 20 18" style={{ color: 'rgba(196,114,138,0.55)' }} fill="currentColor">
        <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" />
      </svg>
      <div className="rose-line flex-1 max-w-[80px]" />
    </div>
  );
}

function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -50]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-dynamic overflow-hidden">
      <AnimatedBackground />

      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.018]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <main className="relative z-10 flex flex-col items-center">

        {/* ── HERO ── */}
        <section className="w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 text-center relative">
          <Sparkles count={24} colors={['#F0A8BE', '#C4728A', '#CDB8F0', '#F5D0DC', '#B89CD8', '#FFD6E4']} className="z-0" />

          {/* Soft rotating rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[min(65vw,480px)] h-[min(65vw,480px)] rounded-full animate-spin-slow"
              style={{ border: '1px solid rgba(196,114,138,0.14)' }} />
            <div className="absolute w-[min(50vw,360px)] h-[min(50vw,360px)] rounded-full animate-spin-reverse-slow"
              style={{ border: '1px solid rgba(155,127,200,0.16)' }} />
            <div className="absolute w-[min(36vw,260px)] h-[min(36vw,260px)] rounded-full animate-spin-slow"
              style={{ border: '1px dashed rgba(196,114,138,0.09)', animationDuration: '50s' }} />
          </div>

          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-4xl">

            {/* Heart icon */}
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.15, type: 'spring', stiffness: 130 }}
              className="flex justify-center mb-5"
            >
              <HeartIcon size={34} />
            </motion.div>

            {/* For Angel tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <FeminineFloral />
              <span className="text-[10px] md:text-xs font-sans font-semibold tracking-[0.38em] uppercase" style={{ color: '#C4728A' }}>
                For You, MiLady
              </span>
              <FeminineFloral flip />
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-serif font-bold tracking-tight leading-none mb-1">
                <span
                  className="block text-6xl md:text-8xl lg:text-9xl"
                  style={{ color: '#F5D0DC', textShadow: '0 0 80px rgba(196,114,138,0.35), 0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  Happy
                </span>
                <span
                  className="block text-7xl md:text-9xl lg:text-[10rem] italic"
                  style={{
                    background: 'linear-gradient(90deg, #8B3A52 0%, #C4728A 18%, #F0A8BE 35%, #FFD6E4 50%, #F0A8BE 65%, #C4728A 82%, #8B3A52 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'rose-shimmer 4s linear infinite',
                    filter: 'drop-shadow(0 2px 16px rgba(196,114,138,0.55))',
                  }}
                >
                  Birthday
                </span>
              </h1>

              {/* Script name: Angel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-2 mb-1"
              >
                <span
                  className="font-script text-5xl md:text-6xl lg:text-7xl"
                  style={{
                    background: 'linear-gradient(90deg, #6B4E8B 0%, #9B7FC8 30%, #CDB8F0 50%, #9B7FC8 70%, #6B4E8B 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'rose-shimmer 5s linear infinite',
                    filter: 'drop-shadow(0 2px 12px rgba(155,127,200,0.5))',
                  }}
                >
                  Angel
                </span>
              </motion.div>
            </motion.div>

            {/* AJ nickname badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="flex justify-center mt-4 mb-2"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans font-semibold tracking-[0.25em] uppercase"
                style={{
                  background: 'rgba(196,114,138,0.1)',
                  border: '1px solid rgba(196,114,138,0.3)',
                  color: '#F0A8BE',
                  boxShadow: '0 0 20px rgba(196,114,138,0.12)',
                }}
              >
                <svg width="10" height="9" viewBox="0 0 20 18" fill="#F0A8BE">
                  <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" />
                </svg>
                always cheering for you AJ
                <svg width="10" height="9" viewBox="0 0 20 18" fill="#F0A8BE">
                  <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" />
                </svg>
              </span>
            </motion.div>

            {/* Sub text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="font-sans text-sm md:text-base tracking-[0.15em] mt-5 max-w-sm mx-auto"
              style={{ color: 'rgba(196,114,138,0.65)' }}
            >
              Every year is a new chapter of your fascinating story
            </motion.p>

            {/* Scroll line */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 1.2, delay: 1.4 }}
              className="origin-top mx-auto mt-12"
              style={{ width: 1, height: 72, background: 'linear-gradient(to bottom, rgba(196,114,138,0.6), transparent)' }}
            />
            <motion.div
              animate={{ opacity: [0, 0.7, 0], y: [0, 7, 0] }}
              transition={{ duration: 2, delay: 1.6, repeat: Infinity }}
              className="mx-auto mt-1 flex justify-center"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: 'rgba(196,114,138,0.5)' }}>
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
          <RoseDivider />
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-sans my-4" style={{ color: 'rgba(196,114,138,0.45)' }}>
            Weaving the beautiful memories
          </p>
          <RoseDivider />
        </motion.section>

        {/* ── TIMELINE ── */}
        <section className="w-full py-10 px-4 md:px-8 relative">
          <div
            className="hidden xl:block absolute left-6 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,114,138,0.12), transparent)' }}
          />
          <div
            className="hidden xl:block absolute right-6 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(155,127,200,0.12), transparent)' }}
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
          <Sparkles count={30} colors={['#F0A8BE', '#C4728A', '#CDB8F0', '#9B7FC8', '#F5D0DC', '#B89CD8', '#FFD6E4']} />

          {/* Soft radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[700px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(196,114,138,0.08) 0%, rgba(155,127,200,0.06) 50%, transparent 70%)' }} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <HeartIcon size={40} />
            </motion.div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <FeminineFloral />
              <svg width="16" height="14" viewBox="0 0 20 18" fill="#C4728A">
                <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" />
              </svg>
              <FeminineFloral flip />
            </div>

            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-serif italic mb-2 leading-tight"
              style={{ color: '#F5D0DC', textShadow: '0 0 40px rgba(196,114,138,0.25)' }}
            >
              To Many More,
            </h2>
            <h2
              className="text-4xl md:text-6xl lg:text-7xl font-script mb-6"
              style={{
                background: 'linear-gradient(90deg, #6B4E8B, #9B7FC8, #CDB8F0, #9B7FC8, #6B4E8B)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'rose-shimmer 5s linear infinite',
              }}
            >
              Angel
            </h2>

            <div className="rose-line w-24 mx-auto mb-8" />

            <p className="text-base md:text-xl leading-relaxed mb-5 max-w-lg mx-auto font-sans" style={{ color: 'rgba(196,114,138,0.65)' }}>
              May every day bring you the joy you so effortlessly give to everyone around you.
              You are a treasure beyond measure, AJ.
            </p>
            <p className="text-sm md:text-base leading-relaxed mb-14 max-w-md mx-auto font-sans" style={{ color: 'rgba(240,168,190,0.5)' }}>
              The world wont be f_n wihtout "u", how would i la_gh without "u".
              thank you for being the most wonderful person in the world, and for being you. My dearest friend, my sunshine. 
              </p>

            <RoseDivider />

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 100 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mt-10"
              style={{
                background: 'linear-gradient(90deg, #8B3A52 0%, #C4728A 18%, #F0A8BE 35%, #FFD6E4 50%, #F0A8BE 65%, #C4728A 82%, #8B3A52 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'rose-shimmer 4s linear infinite',
                filter: 'drop-shadow(0 2px 16px rgba(196,114,138,0.5))',
              }}
            >
              Happy Birthday, Angel!
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.9 }}
              className="mt-8 flex items-center justify-center gap-3"
            >
              {[9, 12, 18, 12, 9].map((size, i) => (
                <svg key={i} width={size} height={size * 0.9} viewBox="0 0 20 18" fill="currentColor"
                  className="text-primary" style={{ opacity: i === 2 ? 0.9 : 0.45 }}>
                  <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" />
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
              <span className="font-script text-3xl" style={{ color: 'rgba(196,114,138,0.6)' }}>
                with all our love for AJ
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
