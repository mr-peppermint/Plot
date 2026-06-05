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
      {/* Floating inbox button — only visible when at bottom */}
      <AnimatePresence>
        {atBottom && (
          <motion.button
            key="inbox-btn"
            onClick={() => setOpen(true)}
            className="fixed bottom-7 right-7 z-40 flex items-center justify-center w-16 h-16 rounded-full shadow-xl"
            style={{
              background: "linear-gradient(135deg, #7B3F6E 0%, #A0547A 60%, #C4728A 100%)",
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
            {/* pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ border: "2px solid rgba(196,114,138,0.7)" }}
              animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Centered full modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: "rgba(10,4,18,0.82)", backdropFilter: "blur(8px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Centered note */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
              style={{ pointerEvents: "none" }}
            >
              <motion.div
                className="w-full max-w-2xl"
                style={{ maxHeight: "88vh", pointerEvents: "auto" }}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.93 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                {/* Paper body */}
                <div
                  className="relative rounded-3xl overflow-hidden flex flex-col"
                  style={{
                    background: "linear-gradient(160deg, #2E1245 0%, #200C38 55%, #160820 100%)",
                    border: "1px solid rgba(196,114,138,0.28)",
                    boxShadow:
                      "0 24px 80px rgba(0,0,0,0.85), 0 0 80px rgba(123,63,110,0.22), inset 0 1px 0 rgba(205,184,240,0.08)",
                    maxHeight: "88vh",
                  }}
                >
                  {/* Top colour strip */}
                  <div
                    className="w-full flex-shrink-0"
                    style={{
                      height: 8,
                      background:
                        "repeating-linear-gradient(90deg, #9B3F6E 0px, #C4728A 22px, #7B3F6E 44px)",
                      opacity: 0.8,
                    }}
                  />

                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-8 pt-6 pb-4 flex-shrink-0"
                    style={{ borderBottom: "1px solid rgba(196,114,138,0.15)" }}
                  >
                    <div style={{ filter: "drop-shadow(0 2px 10px rgba(155,127,200,0.45))" }}>
                      <span
                        className="font-script text-4xl"
                        style={{
                          display: "inline-block",
                          padding: "0.04em 0.2em 0.18em 0.2em",
                          background: "linear-gradient(90deg,#CDB8F0,#F0A8BE,#CDB8F0)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        A Note for AJ ♡
                      </span>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="rounded-full p-2 opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
                      style={{ color: "#F0A8BE" }}
                    >
                      <X size={22} />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div
                    ref={scrollRef}
                    className="overflow-y-auto flex-1 px-8 py-6 space-y-6"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {/* Lined-paper wish text block */}
                    <div className="relative py-2">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-full"
                          style={{
                            top: `${i * 1.9 + 1.2}rem`,
                            height: 1,
                            background: "rgba(196,114,138,0.09)",
                          }}
                        />
                      ))}

                      <p
                        className="font-script text-3xl leading-relaxed relative z-10"
                        style={{ color: "rgba(240,168,190,0.95)" }}
                      >
                        Happy 18th, AJ! ✨
                      </p>
                      <p
                        className="text-base leading-relaxed mt-4 relative z-10"
                        style={{ color: "rgba(205,184,240,0.82)", fontFamily: "Georgia, serif" }}
                      >
                        This little note is just for you. Eighteen years of you being
                        exactly who you are — thoughtful, bright, endlessly kind.
                        Every chapter of your story has been a gift to everyone lucky
                        enough to be in it.
                      </p>
                      <p
                        className="text-base leading-relaxed mt-4 relative z-10"
                        style={{ color: "rgba(205,184,240,0.82)", fontFamily: "Georgia, serif" }}
                      >
                        May this next chapter be your best one yet. May you find all
                        the joy, the adventure, and the love that you so freely give
                        to others — reflected right back at you.
                      </p>
                      <p
                        className="font-script text-2xl mt-5 relative z-10"
                        style={{ color: "rgba(196,114,138,0.92)" }}
                      >
                        With so much love, always. ♡
                      </p>
                    </div>

                    {/* Divider */}
                    <div
                      className="w-full h-px"
                      style={{
                        background:
                          "linear-gradient(90deg,transparent,rgba(196,114,138,0.4),transparent)",
                      }}
                    />

                    {/* MP4 Video */}
                    <div>
                      <p
                        className="text-xs uppercase tracking-widest mb-3"
                        style={{ color: "rgba(196,114,138,0.55)" }}
                      >
                        ♪ a little something extra
                      </p>
                      <div
                        className="rounded-2xl overflow-hidden w-full"
                        style={{ border: "1px solid rgba(196,114,138,0.2)" }}
                      >
                        <video
                          controls
                          playsInline
                          className="w-full block"
                          style={{ background: "#120818", maxHeight: 300 }}
                          src={`${BASE}wish-video.mp4`}
                          onError={(e) => {
                            (e.currentTarget as HTMLVideoElement).style.display = "none";
                            const sib = e.currentTarget
                              .nextElementSibling as HTMLElement | null;
                            if (sib) sib.style.display = "flex";
                          }}
                        />
                        <div
                          className="items-center justify-center py-10 hidden flex-col gap-2 text-center"
                          style={{ color: "rgba(196,114,138,0.45)", fontSize: 14 }}
                        >
                          <span style={{ fontSize: 34 }}>🎬</span>
                          <span>
                            Drop{" "}
                            <code style={{ fontSize: 12 }}>wish-video.mp4</code> into the{" "}
                            <code style={{ fontSize: 12 }}>public/</code> folder to show
                            the video here.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div
                      className="w-full h-px"
                      style={{
                        background:
                          "linear-gradient(90deg,transparent,rgba(196,114,138,0.4),transparent)",
                      }}
                    />

                    {/* Book input */}
                    <div className="pb-2">
                      <div className="flex items-start gap-3 mb-4">
                        <BookOpen
                          size={18}
                          style={{ color: "rgba(205,184,240,0.7)", marginTop: 2, flexShrink: 0 }}
                        />
                        <p
                          className="text-base"
                          style={{
                            color: "rgba(205,184,240,0.88)",
                            fontFamily: "Georgia, serif",
                            lineHeight: 1.5,
                          }}
                        >
                          Please put the name of any book you want to read:
                        </p>
                      </div>

                      {saved && !submitted && (
                        <p
                          className="text-sm mb-3 italic"
                          style={{ color: "rgba(196,114,138,0.65)" }}
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
                          className="flex-1 rounded-xl px-4 py-3 text-base outline-none"
                          style={{
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(196,114,138,0.28)",
                            color: "rgba(240,220,232,0.92)",
                            fontFamily: "Georgia, serif",
                          }}
                        />
                        <motion.button
                          onClick={handleSubmit}
                          whileTap={{ scale: 0.9 }}
                          className="rounded-xl px-5 py-3 text-sm font-medium flex items-center gap-2 flex-shrink-0"
                          style={{
                            background: submitted
                              ? "rgba(80,170,120,0.22)"
                              : "linear-gradient(135deg,#7B3F6E,#A0547A)",
                            color: submitted ? "rgba(130,220,160,0.9)" : "#fff",
                            border: submitted
                              ? "1px solid rgba(80,170,120,0.4)"
                              : "1px solid rgba(196,114,138,0.3)",
                            transition: "background 0.3s, color 0.3s",
                            minWidth: 80,
                          }}
                        >
                          {submitted ? (
                            <>
                              <Check size={15} />
                              Saved!
                            </>
                          ) : (
                            "Save ♡"
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom colour strip */}
                  <div
                    className="w-full flex-shrink-0"
                    style={{
                      height: 8,
                      background:
                        "repeating-linear-gradient(90deg, #7B3F6E 0px, #9B3F6E 22px, #C4728A 44px)",
                      opacity: 0.8,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
