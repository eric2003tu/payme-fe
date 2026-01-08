"use client";
import { AnimatePresence, motion } from "framer-motion";

export default function AnimatedWord({ word }: { word: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={word}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="inline-block min-w-[120px] text-center"
      >
        {word}
      </motion.span>
    </AnimatePresence>
  );
}
