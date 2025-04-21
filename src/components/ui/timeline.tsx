
// Timeline.tsx: Brand-dark, glassy, and fits your color theme

import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full font-sans md:px-10 bg-gradient-to-tr from-[#121212] via-[#18181b] to-[#232037] glass-morphism rounded-xl border border-white/10 shadow-lg"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 lg:px-10">
        <h2 className="text-2xl md:text-4xl mb-4 font-bold text-gradient-primary max-w-4xl">
          Product Changelog 📢
        </h2>
        <p className="text-neutral-300 text-sm md:text-base max-w-xl">
          Track important product updates and new features as we build our journey—here's the latest timeline.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-32 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black/80 dark:bg-black flex items-center justify-center shadow-inner border border-white/10">
                <div className="h-4 w-4 rounded-full bg-[#7E69AB] border-2 border-[#9b87f5] p-2 shadow-md" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-[#9b87f5] drop-shadow">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-[#9b87f5]">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent via-[#7E69AB] to-transparent from-[0%] via-[45%] to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#9b87f5] via-[#7E69AB] to-transparent from-[0%] via-[18%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
