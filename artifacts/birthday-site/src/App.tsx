import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { TimelineSector } from "./components/TimelineSector";

const queryClient = new QueryClient();

const CHAPTERS = [
  { label: "Chapter", title: "The Beginning", description: "Where the story started. A moment full of promise and the quiet excitement of what was to come." },
  { label: "Memory", title: "A Golden Moment", description: "The kind of day that feels like it's painted in sunlight. Laughter echoing in the background." },
  { label: "Year", title: "First Milestones", description: "Taking those brave first steps. The world seemed so big, but you were ready." },
  { label: "Chapter", title: "Shared Smiles", description: "Surrounded by loved ones. A simple gathering that turned into an unforgettable night." },
  { label: "Memory", title: "Unexpected Adventures", description: "Taking a wrong turn and finding the right place. Spontaneity at its finest." },
  { label: "Year", title: "Growing Wings", description: "Learning to fly. The challenges faced only made the triumphs sweeter." },
  { label: "Chapter", title: "Quiet Reflection", description: "A peaceful afternoon. Finding comfort in the silence and clarity in the calm." },
  { label: "Memory", title: "Wild Laughter", description: "Tears streaming down from laughing too hard. Pure, unadulterated joy." },
  { label: "Year", title: "New Horizons", description: "Looking out at a new view. The fear of the unknown replaced by undeniable excitement." },
  { label: "Chapter", title: "Warm Embraces", description: "A hug that felt like coming home. Knowing exactly where you belonged." },
  { label: "Memory", title: "Dancing in the Rain", description: "Refusing to wait for the storm to pass. Embracing the beautiful mess of life." },
  { label: "Year", title: "Deep Conversations", description: "Talking late into the night. Words that shifted perspectives and deepened bonds." },
  { label: "Chapter", title: "Brilliant Sunsets", description: "Watching the sky catch fire. A reminder that endings can be incredibly beautiful." },
  { label: "Memory", title: "A Spark of Genius", description: "That 'aha' moment. When suddenly, everything just clicked into place." },
  { label: "Year", title: "Finding Strength", description: "Realizing you were tougher than you thought. A quiet resilience taking root." },
  { label: "Chapter", title: "Celebrating Wins", description: "Raising a glass to hard work paying off. Basking in the glow of accomplishment." },
  { label: "Memory", title: "A Perfect Melody", description: "A song playing at just the right time. Music intertwined perfectly with a memory." },
  { label: "Year", title: "The Present Joy", description: "Here and now. Looking back with gratitude and looking forward with brilliant hope." },
];

function Home() {
  const { scrollYProgress } = useScroll();
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.5, 0.2]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-dynamic overflow-hidden">
      <AnimatedBackground />
      
      {/* Noise Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <main className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="max-w-4xl"
          >
            <motion.h2 
              initial={{ opacity: 0, letterSpacing: "0px" }}
              animate={{ opacity: 1, letterSpacing: "8px" }}
              transition={{ duration: 2, delay: 1 }}
              className="text-primary font-sans text-sm md:text-base uppercase tracking-[8px] mb-6"
            >
              A Celebration of You
            </motion.h2>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-foreground font-bold tracking-tight mb-8 drop-shadow-sm">
              Happy <br className="md:hidden" />
              <span className="italic text-primary/90">Birthday</span>
            </h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 1.5 }}
              className="w-px h-24 bg-gradient-to-b from-primary to-transparent mx-auto mt-12"
            />
          </motion.div>
        </section>

        {/* Timeline Section */}
        <section className="w-full py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
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

        {/* Closing Section */}
        <section className="w-full min-h-[80dvh] flex flex-col items-center justify-center p-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-3xl px-6 py-12 md:py-24"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-foreground mb-8 italic">
              To Many More
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
              May this year bring you boundless joy, unexpected adventures, and peace in the quiet moments. 
              You deserve every beautiful thing that comes your way. Keep shining brightly.
            </p>
            <div className="text-5xl md:text-7xl font-serif font-bold text-primary mt-12 mb-8 drop-shadow-md">
              Happy Birthday!
            </div>
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
