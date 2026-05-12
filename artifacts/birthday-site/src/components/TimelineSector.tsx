import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { Sparkles } from './Sparkles';

interface TimelineSectorProps {
  number: number;
  label: string;
  title: string;
  description: string;
  isEven: boolean;
}

function DecorativeCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms: Record<string, string> = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0 scale-x-[-1]',
    bl: 'bottom-0 left-0 scale-y-[-1]',
    br: 'bottom-0 right-0 scale-x-[-1] scale-y-[-1]',
  };
  return (
    <svg
      className={`absolute ${transforms[position]} w-10 h-10 text-primary/40 pointer-events-none`}
      viewBox="0 0 40 40"
      fill="none"
    >
      <path d="M2 38 L2 8 Q2 2 8 2 L38 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2" cy="38" r="2" fill="currentColor" />
      <circle cx="38" cy="2" r="2" fill="currentColor" />
      <path d="M8 2 Q2 2 2 8" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export function TimelineSector({ number, label, title, description, isEven }: TimelineSectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 py-14 ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Vertical timeline line */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2 z-0" />

      {/* Timeline node */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 260 }}
        className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="relative w-7 h-7 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping-slow" />
          <div className="absolute inset-0 rounded-full bg-primary/10 scale-150" />
          <div className="w-4 h-4 rounded-full bg-primary/60 ring-2 ring-primary/30 ring-offset-2 ring-offset-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
          </div>
        </div>
      </motion.div>

      {/* Text side */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
        <div className={`w-full flex flex-col ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} px-4 md:px-8`}>
          <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
            {isEven ? null : (
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-primary/50 flex-shrink-0" fill="currentColor">
                <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
              </svg>
            )}
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {label} {String(number).padStart(2, '0')}
            </span>
            {isEven ? (
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-primary/50 flex-shrink-0" fill="currentColor">
                <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
              </svg>
            ) : null}
          </div>
          <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-4 leading-tight">
            {title}
          </h3>
          <div className={`w-12 h-0.5 bg-gradient-to-r from-primary to-secondary mb-4 ${isEven ? 'md:ml-auto' : ''}`} />
          <p className="text-muted-foreground leading-relaxed max-w-xs text-sm md:text-base">
            {description}
          </p>
        </div>
      </div>

      {/* Photo frame side */}
      <div className="w-full md:w-1/2 px-4 md:px-8 z-10">
        <motion.div
          whileHover={{ scale: 1.025, rotate: isEven ? -0.5 : 0.5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative"
        >
          {/* Outer decorative shadow frame */}
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 blur-sm" />

          {/* Main photo card */}
          <div className="relative aspect-[4/3] w-full max-w-md mx-auto rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-br from-background/80 to-muted/60 backdrop-blur-md shadow-lg group">
            <Sparkles count={8} />

            {/* Inner photo frame lines */}
            <div className="absolute inset-3 rounded-lg border border-dashed border-primary/25 z-10" />
            <DecorativeCorner position="tl" />
            <DecorativeCorner position="tr" />
            <DecorativeCorner position="bl" />
            <DecorativeCorner position="br" />

            {/* Background texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,215,0,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(200,162,200,0.15) 0%, transparent 50%)',
              }}
            />

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
              >
                <ImageIcon className="w-7 h-7 text-primary/50 group-hover:text-primary/70 transition-colors" />
              </motion.div>
              <span className="text-xs font-medium text-muted-foreground tracking-wide">Add your photo here</span>
              <div className="flex gap-1.5 mt-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1 h-1 rounded-full bg-primary/30" />
                ))}
              </div>
            </div>

            {/* Corner glow orbs */}
            <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-secondary/20 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-28 h-28 bg-primary/15 rounded-full blur-2xl" />
          </div>

          {/* Polaroid tab at bottom */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}
