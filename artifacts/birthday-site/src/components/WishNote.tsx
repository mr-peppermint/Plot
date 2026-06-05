import { useState, useRef } from "react";
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

export function WishNote() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { saved, save } = useSavedBook();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    save(input.trim());
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2800);
  };

  return (
    <>
      {/* Floating inbox button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-7 right-7 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-xl"
        style={{
          background: "linear-gradient(135deg, #7B3F6E 0%, #A0547A 60%, #C4728A 100%)",
          boxShadow: "0 0 22px rgba(160,84,122,0.55), 0 4px 16px rgba(0,0,0,0.35)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Open wish note"
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Inbox size={26} color="#fff" strokeWidth={1.8} />
        </motion.div>
        {/* pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid rgba(196,114,138,0.6)" }}
          animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.button>

      {/* Note modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: "rgba(18,8,26,0.72)", backdropFilter: "blur(6px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Note paper */}
            <motion.div
              className="fixed z-50 inset-x-4 bottom-24 top-auto sm:inset-auto sm:bottom-28 sm:right-8 sm:w-[370px]"
              style={{ maxHeight: "72vh" }}
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
            >
              {/* Paper body */}
              <div
                className="relative rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "linear-gradient(160deg, #2A1040 0%, #1E0A30 60%, #160820 100%)",
                  border: "1px solid rgba(196,114,138,0.22)",
                  boxShadow: "0 8px 48px rgba(0,0,0,0.7), 0 0 60px rgba(123,63,110,0.18)",
                  maxHeight: "72vh",
                }}
              >
                {/* Torn top edge decoration */}
                <div
                  className="w-full"
                  style={{
                    height: 6,
                    background: "repeating-linear-gradient(90deg, #9B3F6E 0px, #C4728A 18px, #7B3F6E 36px)",
                    opacity: 0.7,
                  }}
                />

                {/* Header */}
                <div
                  className="flex items-center justify-between px-5 pt-4 pb-3"
                  style={{ borderBottom: "1px solid rgba(196,114,138,0.13)" }}
                >
                  <span
                    className="font-script text-2xl"
                    style={{
                      background: "linear-gradient(90deg,#CDB8F0,#F0A8BE,#CDB8F0)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    A Note for AJ ♡
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full p-1 opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: "#F0A8BE" }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable content */}
                <div
                  ref={scrollRef}
                  className="overflow-y-auto flex-1 px-5 py-4 space-y-5"
                  style={{ scrollbarWidth: "none" }}
                >
                  {/* Lined-paper rule lines behind the wish text */}
                  <div className="relative">
                    {/* rule lines */}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-full"
                        style={{
                          top: `${i * 1.75 + 1.4}rem`,
                          height: 1,
                          background: "rgba(196,114,138,0.10)",
                        }}
                      />
                    ))}

                    {/* Wish text */}
                    <p
                      className="font-script text-xl leading-relaxed relative z-10"
                      style={{ color: "rgba(240,168,190,0.92)" }}
                    >
                      Happy 18th, AJ! ✨
                    </p>
                    <p
                      className="text-sm leading-relaxed mt-3 relative z-10"
                      style={{ color: "rgba(205,184,240,0.78)", fontFamily: "Georgia, serif" }}
                    >
                      This little note is just for you. Eighteen years of you being
                      exactly who you are — thoughtful, bright, endlessly kind.
                      Every chapter of your story has been a gift to everyone lucky
                      enough to be in it.
                    </p>
                    <p
                      className="text-sm leading-relaxed mt-3 relative z-10"
                      style={{ color: "rgba(205,184,240,0.78)", fontFamily: "Georgia, serif" }}
                    >
                      May this next chapter be your best one yet. May you find all
                      the joy, the adventure, and the love that you so freely give
                      to others — reflected right back at you.
                    </p>
                    <p
                      className="font-script text-lg mt-4 relative z-10"
                      style={{ color: "rgba(196,114,138,0.9)" }}
                    >
                      With so much love, always. ♡
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className="w-full h-px"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(196,114,138,0.35),transparent)" }}
                  />

                  {/* MP4 Video */}
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest mb-2"
                      style={{ color: "rgba(196,114,138,0.55)" }}
                    >
                      ♪ a little something extra
                    </p>
                    <div
                      className="rounded-xl overflow-hidden w-full"
                      style={{ border: "1px solid rgba(196,114,138,0.18)" }}
                    >
                      <video
                        controls
                        playsInline
                        className="w-full block"
                        style={{ background: "#120818", maxHeight: 220 }}
                        src={`${BASE}wish-video.mp4`}
                        onError={(e) => {
                          (e.currentTarget as HTMLVideoElement).style.display = "none";
                          const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
                          if (sibling) sibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="items-center justify-center py-8 hidden flex-col gap-2"
                        style={{ color: "rgba(196,114,138,0.45)", fontSize: 13 }}
                      >
                        <span style={{ fontSize: 28 }}>🎬</span>
                        <span>Add <code style={{ fontSize: 11 }}>wish-video.mp4</code> to the public folder to show the video here.</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className="w-full h-px"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(196,114,138,0.35),transparent)" }}
                  />

                  {/* Book input */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen size={15} style={{ color: "rgba(205,184,240,0.7)" }} />
                      <p
                        className="text-sm"
                        style={{ color: "rgba(205,184,240,0.82)", fontFamily: "Georgia, serif" }}
                      >
                        Please put the name of any book you want to read:
                      </p>
                    </div>

                    {saved && !submitted && (
                      <p
                        className="text-xs mb-2 italic"
                        style={{ color: "rgba(196,114,138,0.65)" }}
                      >
                        Last saved: "{saved}"
                      </p>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="Book title…"
                        className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(196,114,138,0.25)",
                          color: "rgba(240,220,232,0.92)",
                          fontFamily: "Georgia, serif",
                        }}
                      />
                      <motion.button
                        onClick={handleSubmit}
                        whileTap={{ scale: 0.9 }}
                        className="rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-1.5"
                        style={{
                          background: submitted
                            ? "rgba(80,170,120,0.25)"
                            : "linear-gradient(135deg,#7B3F6E,#A0547A)",
                          color: submitted ? "rgba(130,220,160,0.9)" : "#fff",
                          border: submitted
                            ? "1px solid rgba(80,170,120,0.4)"
                            : "1px solid rgba(196,114,138,0.3)",
                          transition: "background 0.3s, color 0.3s",
                          minWidth: 64,
                        }}
                      >
                        {submitted ? (
                          <>
                            <Check size={14} />
                            Saved
                          </>
                        ) : (
                          "Save ♡"
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* bottom spacer */}
                  <div className="h-2" />
                </div>

                {/* Torn bottom edge decoration */}
                <div
                  className="w-full"
                  style={{
                    height: 6,
                    background: "repeating-linear-gradient(90deg, #7B3F6E 0px, #9B3F6E 18px, #C4728A 36px)",
                    opacity: 0.7,
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
