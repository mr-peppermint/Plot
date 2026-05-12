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
  { label: "Year", title: "First Milestones", description: "Taking those brave first steps. The world seemed impossibly big, but you were ready." },
  { label: "Chapter", title: "Shared Smiles", description: "Surrounded by loved ones. A simple gathering that turned into an unforgettable memory." },
  { label: "Memory", title: "Unexpected Adventures", description: "Taking a wrong turn and finding the right place. Spontaneity at its absolute finest." },
  { label: "Year", title: "Growing Wings", description: "Learning to fly — the challenges faced only made the triumphs that much sweeter." },
  { label: "Chapter", title: "Quiet Reflection", description: "A peaceful afternoon. Finding comfort in silence and clarity in the calm." },
  { label: "Memory", title: "Wild Laughter", description: "Tears streaming down from laughing too hard. Pure, unadulterated joy in every breath." },
  { label: "Year", title: "New Horizons", description: "Looking out at an unfamiliar view. The fear of the unknown replaced by undeniable excitement." },
  { label: "Chapter", title: "Warm Embraces", description: "A hug that felt like coming home — knowing exactly where you belonged in this world." },
  { label: "Memory", title: "Dancing in the Rain", description: "Refusing to wait for the storm to pass. Embracing the beautiful, glorious mess of life." },
  { label: "Year", title: "Deep Conversations", description: "Talking until dawn. Words that shifted perspectives and deepened bonds forever." },
  { label: "Chapter", title: "Brilliant Sunsets", description: "Watching the sky catch fire together. A reminder that endings can be breathtaking." },
  { label: "Memory", title: "A Spark of Genius", description: "That one 'aha' moment — when everything clicked and suddenly the path was crystal clear." },
  { label: "Year", title: "Finding Strength", description: "Realizing you were tougher than you ever imagined. A quiet resilience taking root." },
  { label: "Chapter", title: "Celebrating Wins", description: "Raising a glass to hard work paying off. Basking in the glow of hard-earned accomplishment." },
  { label: "Memory", title: "A Perfect Melody", description: "A song playing at precisely the right moment — music that became forever intertwined with a memory." },
  { label: "Year", title: "The Present Joy", description: "Here and now. Looking back with gratitude and forward with nothing but brilliant, shining hope." },
];

function OrnateDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div className="h-px w-24 bg-gradient-to-r from-transparent to-primary/40" />
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-primary/60">
        <path d="M14 0 L15.8 12.2 L28 14 L15.8 15.8 L14 28 L12.2 15.8 L0 14 L12.2 12.2 Z" fill="currentColor" />
        <circle cx="14" cy="14" r="3" fill="white" fillOpacity="0.6" />
      </svg>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-secondary/60">
        <path d="M7 0 L8.2 5.8 L14 7 L8.2 8.2 L7 14 L5.8 8.2 L0 7 L5.8 5.8 Z" fill="currentColor" />
      </svg>
      <div className="h-px w-24 bg-gradient-to-l from-transparent to-primary/40" />
    </div>
  );
}

function FloralAccent({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      fill="none"
      className={`text-primary/20 ${flip ? 'scale-x-[-1]' : ''}`}
    >
      <path d="M10 50 Q 30 10, 60 30 Q 90 50, 110 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="10" cy="50" r="4" fill="currentColor" />
      <circle cx="60" cy="30" r="3" fill="currentColor" opacity="0.6" />
      <circle cx="110" cy="10" r="4" fill="currentColor" />
      <path d="M35 25 Q 38 15 45 22" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M75 40 Q 82 30 85 38" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-dynamic overflow-hidden">
      <AnimatedBackground />

      {/* Noise texture overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <main className="relative z-10 flex flex-col items-center">

        {/* ── HERO ── */}
        <section className="w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 text-center relative">
          <Sparkles count={20} colors={['#FFD700', '#FFB6C1', '#D8BFD8', '#FFA07A', '#C8A2C8']} className="z-0" />

          {/* Decorative ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[min(70vw,500px)] h-[min(70vw,500px)] rounded-full border border-primary/10 animate-spin-slow" />
            <div className="absolute w-[min(55vw,380px)] h-[min(55vw,380px)] rounded-full border border-secondary/10 animate-spin-reverse-slow" />
          </div>

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <FloralAccent />
              <span className="text-xs md:text-sm font-sans font-semibold tracking-[0.3em] text-primary uppercase">
                A Celebration of You
              </span>
              <FloralAccent flip />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-7xl md:text-9xl lg:text-[10rem] font-serif font-bold tracking-tight leading-none mb-4"
            >
              <span className="text-foreground/90">Happy</span>
              <br />
              <span className="italic text-primary">Birthday</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.4 }}
              className="text-muted-foreground font-sans text-base md:text-lg tracking-wide max-w-md mx-auto mt-6"
            >
              Every year tells a story. Yours is one worth celebrating.
            </motion.p>

            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 2 }}
              className="origin-top w-px h-20 bg-gradient-to-b from-primary/60 to-transparent mx-auto mt-12"
            />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: [0, 1, 0], y: [0, 8, 0] }}
              transition={{ duration: 2, delay: 2.5, repeat: Infinity }}
              className="mx-auto mt-1"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-primary/50 mx-auto" fill="currentColor">
                <path d="M8 12 L2 5 L3.4 3.6 L8 9.2 L12.6 3.6 L14 5 Z" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ── INTRO BANNER ── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full py-12 px-4 text-center relative"
        >
          <OrnateDivider />
          <p className="text-muted-foreground text-sm md:text-base tracking-[0.15em] uppercase font-sans max-w-xl mx-auto">
            Scroll through the memories
          </p>
          <OrnateDivider />
        </motion.section>

        {/* ── TIMELINE ── */}
        <section className="w-full py-12 px-4 md:px-8 relative">
          {/* Decorative side ribbons */}
          <div className="hidden xl:block absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
          <div className="hidden xl:block absolute right-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-secondary/15 to-transparent" />

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

        {/* ── CLOSING SECTION ── */}
        <section className="w-full min-h-[90dvh] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <FloatingBalloons count={6} />
          <ConfettiBurst />
          <Sparkles count={25} colors={['#FFD700', '#FF6B9D', '#9B59B6', '#3DBECC', '#FFA07A']} />

          {/* Big glow behind */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-3xl"
          >
            <div className="flex items-center justify-center gap-4 mb-10">
              <FloralAccent />
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-primary/60" fill="currentColor">
                <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
              </svg>
              <FloralAccent flip />
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic text-foreground mb-6 leading-tight">
              To Many More
            </h2>

            <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto mb-8" />

            <p className="text-base md:text-xl text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto font-sans">
              May this year bring you boundless joy, unexpected adventures,
              and peace in the quiet moments.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-12 max-w-md mx-auto font-sans">
              You deserve every beautiful thing coming your way.
              Keep shining — the world is brighter with you in it.
            </p>

            <OrnateDivider />

            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 120 }}
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary mt-8 drop-shadow-lg"
            >
              Happy Birthday!
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.9 }}
              className="mt-8 flex items-center justify-center gap-3"
            >
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 20 20" className="text-primary/50" fill="currentColor">
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
