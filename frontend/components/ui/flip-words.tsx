"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export function FlipWords({ words, duration = 2800, className }: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
    setIsAnimating(true);
  }, [words.length]);

  useEffect(() => {
    if (!isAnimating) {
      const timeout = setTimeout(startAnimation, duration);
      return () => clearTimeout(timeout);
    }
  }, [isAnimating, duration, startAnimation]);

  const currentWord = words[currentIndex];

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => setIsAnimating(false)}
    >
      <motion.span
        key={currentWord}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: -20,
          x: 10,
          filter: "blur(6px)",
          scale: 1.05,
          position: "absolute",
        }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className={cn(
          "inline-block relative",
          className
        )}
      >
        {currentWord.split("").map((letter, i) => (
          <motion.span
            key={currentWord + i}
            initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="inline-block"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}
