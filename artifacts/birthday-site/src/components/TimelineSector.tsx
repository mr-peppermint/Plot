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

function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const classes: Record<string, string> = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0 scale-x-[-1]',
    bl: 'bottom-0 left-0 scale-y-[-1]',
    br: 'bottom-0 right-0 scale-x-[-1] scale-y-[-1]',
  };
  return (
    <svg className={`absolute ${classes[position]} w-9 h-9 pointer-events-none`} viewBox="0 0 36 36" fill="none">
      <path d="M2 34 L2 7 Q2 2 7 2 L34 2" stroke="rgba(232,160,32,0.45)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2" cy="34" r="1.8" fill="rgba(232,160,32,0.5)" />
      <circle cx="34" cy="2" r="1.8" fill="rgba(232,160,32,0.5)" />
    </svg>
  );
}

export function TimelineSector({ number, label, title, description, isEven }: TimelineSectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 70, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 py-14 ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Vertical timeline line */}
      <div
        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-0"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(232,160,32,0.22), transparent)' }}
      />

      {/* Timeline node */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 240 }}
        className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full animate-ping-slow" style={{ background: 'rgba(232,160,32,0.15)' }} />
          <div
            className="w-5 h-5 rounded-full ring-1 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(232,160,32,0.7) 0%, rgba(232,160,32,0.15) 100%)',
              boxShadow: '0 0 12px rgba(232,160,32,0.5), 0 0 30px rgba(232,160,32,0.15)',
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,230,120,0.95)' }} />
          </div>
        </div>
      </motion.div>

      {/* Text side */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
        <div className={`w-full flex flex-col ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} px-4 md:px-8`}>

          {/* Label with chapter number */}
          <div className={`flex items-center gap-2 mb-3 ${isEven ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="rgba(232,160,32,0.55)">
              <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
            </svg>
            <span className="text-[10px] font-semibold tracking-[0.28em] uppercase font-sans" style={{ color: '#E8A020' }}>
              {label} {String(number).padStart(2, '0')}
            </span>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="rgba(232,160,32,0.55)">
              <path d="M10 0 L11.5 8.5 L20 10 L11.5 11.5 L10 20 L8.5 11.5 L0 10 L8.5 8.5 Z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-3xl md:text-4xl font-serif mb-4 leading-tight" style={{ color: '#F0E8D8' }}>
            {title}
          </h3>

          {/* Rule */}
          <div
            className={`w-10 h-px mb-4 ${isEven ? 'md:ml-auto' : ''}`}
            style={{ background: 'linear-gradient(90deg, rgba(232,160,32,0.9), rgba(79,200,240,0.4))' }}
          />

          {/* Description */}
          <p className="leading-relaxed max-w-xs text-sm md:text-base font-sans" style={{ color: 'rgba(240,220,160,0.65)' }}>
            {description}
          </p>
        </div>
      </div>

      {/* Photo frame side */}
      <div className="w-full md:w-1/2 px-4 md:px-8 z-10">
        <motion.div
          whileHover={{ scale: 1.02, rotate: isEven ? -0.4 : 0.4 }}
          transition={{ type: 'spring', stiffness: 280 }}
          className="relative"
        >
          {/* Outer glow */}
          <div
            className="absolute -inset-px rounded-xl transition-all duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(232,160,32,0.1), rgba(79,200,240,0.07), rgba(232,160,32,0.06))',
              boxShadow: '0 0 40px rgba(232,160,32,0.07), 0 0 80px rgba(79,200,240,0.05)',
            }}
          />

          {/* Main card */}
          <div
            className="relative aspect-[4/3] w-full max-w-md mx-auto rounded-xl overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(6,8,24,0.95), rgba(4,6,18,0.98))',
              border: '1px solid rgba(232,160,32,0.2)',
              boxShadow: '0 0 0 1px rgba(232,160,32,0.07), inset 0 0 40px rgba(232,160,32,0.02)',
            }}
          >
            <Sparkles count={6} colors={['#E8A020', '#4FC8F0', '#FFD860', '#FF8040']} />

            <CornerBracket position="tl" />
            <CornerBracket position="tr" />
            <CornerBracket position="bl" />
            <CornerBracket position="br" />

            <div className="absolute inset-4 rounded-lg z-10" style={{ border: '1px dashed rgba(232,160,32,0.12)' }} />

            {/* Subtle dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(232,160,32,0.9) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(232,160,32,0.04), transparent 60%), radial-gradient(circle at 70% 70%, rgba(79,200,240,0.06), transparent 60%)',
              }}
            />

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{ background: 'rgba(232,160,32,0.07)', border: '1px solid rgba(232,160,32,0.2)' }}
              >
                <ImageIcon className="w-6 h-6" style={{ color: 'rgba(232,160,32,0.5)' }} />
              </motion.div>
              <span className="text-xs font-sans tracking-widest uppercase" style={{ color: 'rgba(232,160,32,0.38)' }}>
                Add Angel's photo
              </span>
              <div className="flex gap-1.5 mt-0.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1 h-1 rounded-full" style={{ background: 'rgba(232,160,32,0.25)' }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
