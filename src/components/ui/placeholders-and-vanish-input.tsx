"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setIsPlaceholderVisible(false);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsPlaceholderVisible(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    setInputValue("");
    setIsPlaceholderVisible(true);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <AnimatePresence>
          {isPlaceholderVisible && (
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {placeholders[Math.floor(Math.random() * placeholders.length)]}
            </motion.div>
          )}
        </AnimatePresence>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-siso-red",
            { "opacity-0": isPlaceholderVisible }
          )}
          placeholder=" "
        />
      </div>
    </form>
  );
}
