import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';
import { Sparkles } from './Sparkles';

interface TimelineSectorProps {
  number: number;
  label: string;
  title: string;
  description: string;
  isEven: boolean;
  image?: string;
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
      <path d="M2 34 L2 7 Q2 2 7 2 L34 2" stroke="rgba(196,114,138,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2" cy="34" r="1.8" fill="rgba(196,114,138,0.45)" />
      <circle cx="34" cy="2" r="1.8" fill="rgba(196,114,138,0.45)" />
    </svg>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="lb-backdrop"
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', background: 'rgba(6,2,12,0.88)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        {/* Close button */}
        <motion.button
          className="absolute top-5 right-5 z-10 rounded-full p-2 flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,220,230,0.85)',
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ delay: 0.15 }}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </motion.button>

        {/* Image */}
        <motion.img
          src={src}
          alt="Memory"
          className="rounded-xl"
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 60px rgba(196,114,138,0.15)',
          }}
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}

export function TimelineSector({ number, label, title, description, isEven, image }: TimelineSectorProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
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
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,114,138,0.2), transparent)' }}
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
            <div className="absolute inset-0 rounded-full animate-ping-slow" style={{ background: 'rgba(196,114,138,0.15)' }} />
            <div
              className="w-5 h-5 rounded-full ring-1 flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(196,114,138,0.65) 0%, rgba(196,114,138,0.15) 100%)',
                boxShadow: '0 0 12px rgba(196,114,138,0.4), 0 0 30px rgba(196,114,138,0.12)',
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,214,228,0.9)' }} />
            </div>
          </div>
        </motion.div>

        {/* Text side */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
          <div className={`w-full flex flex-col ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} px-4 md:px-8`}>

            {/* Label */}
            <div className={`flex items-center gap-2 mb-3 ${isEven ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
              <svg width="12" height="11" viewBox="0 0 20 18" fill="rgba(196,114,138,0.5)">
                <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" />
              </svg>
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase font-sans" style={{ color: '#C4728A' }}>
                {label} {String(number).padStart(2, '0')}
              </span>
              <svg width="12" height="11" viewBox="0 0 20 18" fill="rgba(196,114,138,0.5)">
                <path d="M10 0 C10 0 0 6 0 11 C0 15 4.5 18 10 18 C15.5 18 20 15 20 11 C20 6 10 0 10 0Z" />
              </svg>
            </div>

            <h3 className="text-3xl md:text-4xl font-serif mb-4 leading-tight" style={{ color: '#F5D0DC' }}>
              {title}
            </h3>

            <div
              className={`w-10 h-px mb-4 ${isEven ? 'md:ml-auto' : ''}`}
              style={{ background: 'linear-gradient(90deg, rgba(196,114,138,0.8), rgba(155,127,200,0.4))' }}
            />

            <p className="leading-relaxed max-w-xs text-sm md:text-base font-sans" style={{ color: 'rgba(240,168,190,0.65)' }}>
              {description}
            </p>
          </div>
        </div>

        {/* Photo frame side */}
        <div className="w-full md:w-1/2 px-4 md:px-8 z-10">
          <motion.div
            whileHover={{ scale: image ? 1.03 : 1.02, rotate: isEven ? -0.4 : 0.4 }}
            transition={{ type: 'spring', stiffness: 280 }}
            className="relative"
          >
            {/* Outer glow */}
            <div
              className="absolute -inset-px rounded-xl transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(196,114,138,0.12), rgba(155,127,200,0.09), rgba(196,114,138,0.08))',
                boxShadow: image
                  ? '0 0 50px rgba(196,114,138,0.14), 0 0 90px rgba(155,127,200,0.08)'
                  : '0 0 40px rgba(196,114,138,0.08), 0 0 80px rgba(155,127,200,0.06)',
              }}
            />

            {/* Main card */}
            <div
              className={`relative aspect-[4/3] w-full max-w-md mx-auto rounded-xl overflow-hidden group ${image ? 'cursor-zoom-in' : ''}`}
              style={{
                background: 'linear-gradient(135deg, rgba(30,8,20,0.9), rgba(20,6,16,0.95))',
                border: '1px solid rgba(196,114,138,0.22)',
                boxShadow: '0 0 0 1px rgba(196,114,138,0.08), inset 0 0 40px rgba(196,114,138,0.03)',
              }}
              onClick={() => image && setLightboxOpen(true)}
            >
              {image ? (
                <>
                  {/* Actual photo */}
                  <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ willChange: 'transform' }}
                  />
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ background: 'rgba(6,2,12,0.45)' }}
                  >
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.22)',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      <ZoomIn size={15} color="rgba(255,220,230,0.9)" />
                      <span className="text-xs font-sans" style={{ color: 'rgba(255,220,230,0.9)' }}>
                        Tap to open
                      </span>
                    </div>
                  </div>
                  {/* Corner brackets on top of image */}
                  <CornerBracket position="tl" />
                  <CornerBracket position="tr" />
                  <CornerBracket position="bl" />
                  <CornerBracket position="br" />
                </>
              ) : (
                <>
                  <Sparkles count={6} colors={['#F0A8BE', '#CDB8F0', '#C4728A']} />
                  <CornerBracket position="tl" />
                  <CornerBracket position="tr" />
                  <CornerBracket position="bl" />
                  <CornerBracket position="br" />
                  <div className="absolute inset-4 rounded-lg z-10" style={{ border: '1px dashed rgba(196,114,138,0.15)' }} />
                  <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(196,114,138,0.8) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(196,114,138,0.05), transparent 60%), radial-gradient(circle at 70% 70%, rgba(155,127,200,0.07), transparent 60%)',
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(196,114,138,0.08)', border: '1px solid rgba(196,114,138,0.2)' }}
                    >
                      <ImageIcon className="w-6 h-6" style={{ color: 'rgba(196,114,138,0.5)' }} />
                    </motion.div>
                    <span className="text-xs font-sans tracking-widest uppercase" style={{ color: 'rgba(196,114,138,0.4)' }}>
                      Add Angel's photo
                    </span>
                    <div className="flex gap-1.5 mt-0.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1 h-1 rounded-full" style={{ background: 'rgba(196,114,138,0.28)' }} />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Lightbox portal */}
      {lightboxOpen && <Lightbox src={image!} onClose={() => setLightboxOpen(false)} />}
    </>
  );
}
