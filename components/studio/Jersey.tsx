'use client';
import { motion } from 'framer-motion';
import { jerseySvg, type JerseyOptions } from '@/lib/jersey';

// Тонкая React-обёртка над SVG-генератором. Плавная смена цвета через key+fade.
export function Jersey({ className, ...opts }: JerseyOptions & { className?: string }) {
  const svg = jerseySvg(opts);
  const animKey = `${opts.base}|${opts.accent}|${opts.pattern}|${opts.side}|${opts.template}`;
  return (
    <motion.div
      key={animKey}
      className={className}
      initial={{ opacity: 0.55, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
