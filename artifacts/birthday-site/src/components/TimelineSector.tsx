import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

interface TimelineSectorProps {
  number: number;
  label: string;
  title: string;
  description: string;
  isEven: boolean;
}

export function TimelineSector({ number, label, title, description, isEven }: TimelineSectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16 py-16 ${
        isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Center Line for Desktop */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50 transform -translate-x-1/2 z-0" />
      
      {/* Node */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 w-4 h-4 rounded-full bg-primary/40 transform -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
        <div className={`w-full flex flex-col ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} px-4 md:px-0`}>
          <span className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">
            {label} {number}
          </span>
          <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 px-4 md:px-0 z-10">
        <div className="aspect-[4/3] w-full max-w-md mx-auto relative rounded-xl border-2 border-dashed border-primary/30 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center p-6 shadow-sm group hover:border-primary/50 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-50" />
          <ImageIcon className="w-10 h-10 text-primary/40 mb-4 group-hover:scale-110 transition-transform duration-500" />
          <span className="text-sm font-medium text-muted-foreground relative z-10">Add your photo here</span>
          <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -top-3 -left-3 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}
