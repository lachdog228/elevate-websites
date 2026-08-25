"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Only the tags this site actually reveals. Resolving `motion(as)` at module
 * scope keeps the component identity stable — building it inside render would
 * remount the subtree on every render.
 */
const tags = {
  div: motion.div,
  li: motion.li,
  figure: motion.figure,
  section: motion.section,
} as const;

type Tag = keyof typeof tags;

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before this element starts. */
  delay?: number;
  /** How far it travels, in px. Keep it small — this should be felt, not watched. */
  distance?: number;
  as?: Tag;
  className?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-triggered entrance. Fires once, moves a short distance, and is a
 * no-op under prefers-reduced-motion (the content renders in its final state).
 */
export function Reveal({
  children,
  delay = 0,
  distance = 18,
  as = "div",
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = tags[as];

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : distance },
    shown: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0 : 0.7,
        delay: reduced ? 0 : delay,
        ease,
      },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -60px 0px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Same entrance, but driven on page load rather than on scroll — used above
 * the fold, where there is no scroll event to wait for.
 */
export function RevealOnLoad({
  children,
  delay = 0,
  distance = 18,
  as = "div",
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = tags[as];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease }}
    >
      {children}
    </MotionTag>
  );
}
