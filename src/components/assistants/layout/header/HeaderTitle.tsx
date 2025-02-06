
import { motion } from 'framer-motion';

export function HeaderTitle() {
  return (
    <div className="flex-1">
      <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
        ChatGPT Assistants & Tools
      </h1>
      <p className="mt-4 text-lg text-siso-text/80 leading-relaxed max-w-3xl">
        Discover our curated collection of ChatGPT assistants and GPT builder tools 
        that help streamline your workflow and boost productivity.
      </p>
    </div>
  );
}
