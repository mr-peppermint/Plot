import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, X, BookOpen, Check } from "lucide-react";

const BASE = import.meta.env.BASE_URL ?? "/";

function useSavedBook() {
  const KEY = "aj-birthday-book-wish";
  const [saved, setSaved] = useState<string>(() => localStorage.getItem(KEY) ?? "");
  const save = (val: string) => {
    localStorage.setItem(KEY, val);
    setSaved(val);
  };
  return { saved, save };
}

function useAtBottom(threshold = 80) {
  const [atBottom, setAtBottom] = useState(false);
  useEffect(() => {
    const check = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      setAtBottom(total - scrolled <= threshold);
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [threshold]);
  return atBottom;
}

/* SVG filter definitions — paper grain + edge warp */
function PaperFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        {/* Paper grain texture */}
        <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75 0.65"
            numOctaves="4"
            seed="8"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          <feBlend in="SourceGraphic" in2="gray" mode="multiply" result="blended" />
          <feComponentTransfer in="blended">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>

        {/* Edge warp — makes the paper boundary slightly uneven */}
        <filter id="paper-warp" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.012 0.018"
            numOctaves="2"
            seed="42"
            result="warp"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warp"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/* Crease lines — radial folds from a crumpled ball, layered for depth */
function CreaseLines() {
  const lines = [
    /* main diagonal folds */
    { x1: "50%", y1: "48%", x2: "0%",   y2: "0%",   w: 1.2, o: 0.13 },
    { x1: "50%", y1: "48%", x2: "100%", y2: "0%",   w: 1.0, o: 0.11 },
    { x1: "50%", y1: "48%", x2: "0%",   y2: "100%", w: 1.2, o: 0.12 },
    { x1: "50%", y1: "48%", x2: "100%", y2: "100%", w: 1.0, o: 0.10 },
    /* top horizontal crease */
    { x1: "0%",  y1: "30%", x2: "100%", y2: "27%",  w: 0.8, o: 0.09 },
    /* bottom horizontal crease */
    { x1: "0%",  y1: "72%", x2: "100%", y2: "68%",  w: 0.8, o: 0.08 },
    /* left vertical crease */
    { x1: "28%", y1: "0%",  x2: "25%",  y2: "100%", w: 0.7, o: 0.08 },
    /* right vertical crease */
    { x1: "73%", y1: "0%",  x2: "76%",  y2: "100%", w: 0.7, o: 0.07 },
    /* secondary minor folds */
    { x1: "50%", y1: "48%", x2: "18%",  y2: "0%",   w: 0.6, o: 0.06 },
    { x1: "50%", y1: "48%", x2: "80%",  y2: "0%",   w: 0.6, o: 0.06 },
    { x1: "50%", y1: "48%", x2: "10%",  y2: "60%",  w: 0.6, o: 0.05 },
    { x1: "50%", y1: "48%", x2: "90%",  y2: "55%",  w: 0.5, o: 0.05 },
    { x1: "50%", y1: "48%", x2: "35%",  y2: "100%", w: 0.6, o: 0.06 },
    { x1: "50%", y1: "48%", x2: "65%",  y2: "100%", w: 0.6, o: 0.05 },
  ];

  const shadows = [
    /* shadow strips beside each main crease */
    { x1: "51%", y1: "48%", x2: "1%",   y2: "0%",   w: 3, o: 0.05 },
    { x1: "51%", y1: "48%", x2: "101%", y2: "0%",   w: 3, o: 0.04 },
    { x1: "51%", y1: "48%", x2: "1%",   y2: "100%", w: 3, o: 0.05 },
    { x1: "51%", y1: "48%", x2: "101%", y2: "100%", w: 3, o: 0.04 },
  ];

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      preserveAspectRatio="none"
    >
      {/* shadow side of folds */}
      {shadows.map((l, i) => (
        <line
          key={`s${i}`}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={`rgba(90,60,30,${l.o})`}
          strokeWidth={l.w}
        />
      ))}
      {/* crease lines */}
      {lines.map((l, i) => (
        <line
          key={`c${i}`}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={`rgba(110,75,40,${l.o})`}
          strokeWidth={l.w}
        />
      ))}
      {/* highlight side of folds (white) */}
      <line x1="50%" y1="48%" x2="0%"   y2="0%"   stroke="rgba(255,245,220,0.18)" strokeWidth="1" />
      <line x1="50%" y1="48%" x2="100%" y2="0%"   stroke="rgba(255,245,220,0.15)" strokeWidth="1" />
      <line x1="50%" y1="48%" x2="0%"   y2="100%" stroke="rgba(255,245,220,0.14)" strokeWidth="1" />
      <line x1="50%" y1="48%" x2="100%" y2="100%" stroke="rgba(255,245,220,0.14)" strokeWidth="1" />
      {/* centre crush zone — darkened radial gradient circle */}
      <radialGradient id="crush" cx="50%" cy="48%" r="18%">
        <stop offset="0%"   stopColor="rgba(120,80,30,0.14)" />
        <stop offset="100%" stopColor="rgba(120,80,30,0)" />
      </radialGradient>
      <rect width="100%" height="100%" fill="url(#crush)" />
    </svg>
  );
}

/* Paper background — aged cream with tonal variation */
function PaperBg() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 52% 46%, #E8D9B0 0%, #DFC898 35%, #D4BC88 60%, #C9AD72 100%)
        `,
        zIndex: 0,
      }}
    >
      {/* aged spots / stains */}
      <div style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(circle 60px at 15% 20%, rgba(160,120,50,0.08) 0%, transparent 70%),
          radial-gradient(circle 40px at 82% 78%, rgba(140,100,40,0.07) 0%, transparent 70%),
          radial-gradient(circle 30px at 60% 10%, rgba(150,110,45,0.06) 0%, transparent 70%),
          radial-gradient(circle 50px at 8% 85%,  rgba(130,90,30,0.06)  0%, transparent 70%)
        `,
      }} />
      {/* grain overlay via CSS noise */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        opacity: 0.55,
        mixBlendMode: "multiply",
      }} />
    </div>
  );
}

/* unfold keyframes */
const unfoldVariants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    rotate: -8,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 180,
      damping: 22,
      mass: 1.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    rotate: 5,
    filter: "blur(3px)",
    transition: { duration: 0.28 },
  },
};

export function WishNote() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { saved, save } = useSavedBook();
  const scrollRef = useRef<HTMLDivElement>(null);
  const atBottom = useAtBottom(80);

  const handleSubmit = () => {
    if (!input.trim()) return;
    save(input.trim());
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2800);
  };

  return (
    <>
      <PaperFilters />

      {/* Floating inbox button */}
      <AnimatePresence>
        {atBottom && (
          <motion.button
            key="inbox-btn"
            onClick={() => setOpen(true)}
            className="fixed bottom-7 right-7 z-40 flex items-center justify-center w-16 h-16 rounded-full"
            style={{
              background: "linear-gradient(135deg,#7B3F6E 0%,#A0547A 60%,#C4728A 100%)",
              boxShadow: "0 0 28px rgba(160,84,122,0.65), 0 4px 20px rgba(0,0,0,0.4)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Open wish note"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Inbox size={28} color="#fff" strokeWidth={1.8} />
            </motion.div>
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: "2px solid rgba(196,114,138,0.7)" }}
              animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Paper modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: "rgba(8,3,14,0.78)", backdropFilter: "blur(10px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Centred paper */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
              style={{ pointerEvents: "none" }}>
              <motion.div
                className="w-full max-w-2xl"
                style={{ pointerEvents: "auto", filter: "url(#paper-warp)" }}
                variants={unfoldVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Paper sheet */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: "3px 5px 4px 3px / 4px 3px 5px 4px",
                    boxShadow: `
                      0 2px 4px rgba(0,0,0,0.25),
                      0 8px 20px rgba(0,0,0,0.35),
                      0 24px 60px rgba(0,0,0,0.45),
                      inset 0 0 0 1px rgba(180,140,70,0.3)
                    `,
                    maxHeight: "88vh",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Paper background + grain */}
                  <PaperBg />

                  {/* Crease lines SVG overlay */}
                  <CreaseLines />

                  {/* All content sits above creases */}
                  <div className="relative z-10 flex flex-col" style={{ maxHeight: "88vh" }}>

                    {/* Header */}
                    <div
                      className="flex items-center justify-between px-8 pt-7 pb-4"
                      style={{ borderBottom: "1px solid rgba(110,75,40,0.18)" }}
                    >
                      <div>
                        <p
                          className="font-script text-4xl"
                          style={{
                            color: "#5C2D0A",
                            textShadow: "0 1px 0 rgba(255,240,200,0.6)",
                            padding: "0.04em 0.15em 0.18em 0.1em",
                            display: "inline-block",
                          }}
                        >
                          A Note for AJ ♡
                        </p>
                        <p
                          className="text-xs tracking-widest uppercase mt-0.5"
                          style={{ color: "rgba(130,85,40,0.6)", fontFamily: "Georgia, serif" }}
                        >
                          — unfolded, just for you —
                        </p>
                      </div>
                      <button
                        onClick={() => setOpen(false)}
                        className="rounded-full p-2 transition-opacity"
                        style={{ color: "rgba(100,55,20,0.55)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Scrollable body */}
                    <div
                      ref={scrollRef}
                      className="overflow-y-auto flex-1 px-8 py-6 space-y-6"
                      style={{ scrollbarWidth: "none" }}
                    >
                      {/* Lined paper wish text */}
                      <div className="relative">
                        {/* ruled lines */}
                        {Array.from({ length: 13 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-full"
                            style={{
                              top: `${i * 1.85 + 1.1}rem`,
                              height: "1px",
                              background: "rgba(110,75,40,0.12)",
                            }}
                          />
                        ))}
                        {/* margin line */}
                        <div
                          className="absolute top-0 bottom-0"
                          style={{
                            left: "2.4rem",
                            width: 1,
                            background: "rgba(190,80,80,0.18)",
                          }}
                        />

                        <div style={{ paddingLeft: "1rem" }}>
                          <p
                            className="font-script text-3xl leading-relaxed relative z-10"
                            style={{ color: "#7B3F1E" }}
                          >
                            Happy 18th, AJ! ✨
                          </p>
                          <p
                            className="text-base leading-relaxed mt-4 relative z-10"
                            style={{
                              color: "#3C2010",
                              fontFamily: "Georgia, serif",
                              lineHeight: 1.85,
                            }}
                          >
                            This little note is just for you. Eighteen years of you being
                            exactly who you are — thoughtful, bright, endlessly kind.
                            Every chapter of your story has been a gift to everyone lucky
                            enough to be in it.
                          </p>
                          <p
                            className="text-base leading-relaxed mt-3 relative z-10"
                            style={{
                              color: "#3C2010",
                              fontFamily: "Georgia, serif",
                              lineHeight: 1.85,
                            }}
                          >
                            May this next chapter be your best one yet. May you find all
                            the joy, the adventure, and the love that you so freely give
                            to others — reflected right back at you.
                          </p>
                          <p
                            className="font-script text-2xl mt-4 relative z-10"
                            style={{ color: "#9B3F6E" }}
                          >
                            With so much love, always. ♡
                          </p>
                        </div>
                      </div>

                      {/* tape strip divider */}
                      <div className="relative flex items-center justify-center py-1">
                        <div
                          style={{
                            width: "60%",
                            height: 22,
                            background: "rgba(210,190,140,0.55)",
                            borderRadius: 2,
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.08)",
                            border: "1px solid rgba(180,155,90,0.3)",
                          }}
                        />
                        <span
                          className="absolute text-xs"
                          style={{ color: "rgba(100,65,20,0.4)", fontFamily: "Georgia, serif" }}
                        >
                          ♪ a little something extra
                        </span>
                      </div>

                      {/* MP4 Video */}
                      <div
                        className="rounded overflow-hidden w-full"
                        style={{
                          border: "1px solid rgba(110,75,40,0.25)",
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.12)",
                        }}
                      >
                        <video
                          controls
                          playsInline
                          className="w-full block"
                          style={{ background: "#2A1A08", maxHeight: 280 }}
                          src={`${BASE}wish-video.mp4`}
                          onError={(e) => {
                            (e.currentTarget as HTMLVideoElement).style.display = "none";
                            const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
                            if (sib) sib.style.display = "flex";
                          }}
                        />
                        <div
                          className="items-center justify-center py-10 hidden flex-col gap-2 text-center"
                          style={{
                            color: "rgba(130,85,40,0.55)",
                            fontSize: 13,
                            fontFamily: "Georgia, serif",
                            background: "rgba(0,0,0,0.06)",
                          }}
                        >
                          <span style={{ fontSize: 32 }}>🎬</span>
                          <span>
                            Drop <code style={{ fontSize: 11 }}>wish-video.mp4</code> into{" "}
                            <code style={{ fontSize: 11 }}>public/</code> to show the video.
                          </span>
                        </div>
                      </div>

                      {/* torn-paper divider */}
                      <div
                        className="w-full"
                        style={{
                          height: 10,
                          background:
                            "repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(110,75,40,0.12) 4px, rgba(110,75,40,0.12) 5px)",
                          borderTop: "1px solid rgba(110,75,40,0.2)",
                          borderBottom: "1px solid rgba(110,75,40,0.08)",
                        }}
                      />

                      {/* Book input */}
                      <div className="pb-3" style={{ paddingLeft: "0.5rem" }}>
                        <div className="flex items-start gap-3 mb-4">
                          <BookOpen
                            size={17}
                            style={{ color: "rgba(100,55,20,0.7)", marginTop: 3, flexShrink: 0 }}
                          />
                          <p
                            className="text-base"
                            style={{
                              color: "#3C2010",
                              fontFamily: "Georgia, serif",
                              lineHeight: 1.55,
                            }}
                          >
                            Please put the name of any book you want to read:
                          </p>
                        </div>

                        {saved && !submitted && (
                          <p
                            className="text-sm mb-3 italic"
                            style={{
                              color: "rgba(100,55,20,0.6)",
                              fontFamily: "Georgia, serif",
                            }}
                          >
                            Last saved: "{saved}"
                          </p>
                        )}

                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            placeholder="Book title…"
                            className="flex-1 rounded px-4 py-3 text-base outline-none"
                            style={{
                              background: "rgba(255,250,235,0.7)",
                              border: "1px solid rgba(110,75,40,0.3)",
                              color: "#2C1008",
                              fontFamily: "Georgia, serif",
                              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.08)",
                            }}
                          />
                          <motion.button
                            onClick={handleSubmit}
                            whileTap={{ scale: 0.92 }}
                            className="rounded px-5 py-3 text-sm font-medium flex items-center gap-2 flex-shrink-0"
                            style={{
                              background: submitted
                                ? "rgba(60,140,80,0.2)"
                                : "linear-gradient(135deg,#7B3F6E,#A0547A)",
                              color: submitted ? "rgba(40,120,60,0.9)" : "#fff",
                              border: submitted
                                ? "1px solid rgba(60,140,80,0.4)"
                                : "1px solid rgba(130,60,100,0.4)",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                              transition: "background 0.3s, color 0.3s",
                              minWidth: 82,
                              fontFamily: "Georgia, serif",
                            }}
                          >
                            {submitted ? (
                              <>
                                <Check size={14} />
                                Saved!
                              </>
                            ) : (
                              "Save ♡"
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Footer — handwritten sign-off */}
                    <div
                      className="px-8 py-4 flex items-center justify-between"
                      style={{ borderTop: "1px solid rgba(110,75,40,0.15)" }}
                    >
                      <p
                        className="font-script text-lg"
                        style={{ color: "rgba(155,63,110,0.7)" }}
                      >
                        xoxo, always yours ♡
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          color: "rgba(110,75,40,0.4)",
                          fontFamily: "Georgia, serif",
                          fontStyle: "italic",
                        }}
                      >
                        tap outside to close
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
