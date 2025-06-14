"use client";

import { AuthProvider } from "../app/providers/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={typeof window !== "undefined" ? window.location.pathname : ""}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </AuthProvider>
  );
}
