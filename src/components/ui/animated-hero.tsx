import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PhoneCall, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Innovate, Scale, Succeed", "Collaborate with 1M+ Agencies", "Future-Proof Your Agency"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-6xl md:text-8xl max-w-5xl tracking-tighter text-center font-regular">
              <span className="text-siso-text-bold whitespace-nowrap">Built for Agencies to</span>
              <div className="relative h-[150px] md:h-[200px] flex w-full justify-center overflow-hidden text-center">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </div>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-siso-text max-w-2xl text-center">
              Your gateway to tools, education, networking, and AI-powered innovation—crafted 
              to help your agency thrive in the digital age. Access our curated collection 
              of resources designed for modern business growth.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              Schedule a Demo <PhoneCall className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90">
              Get Started <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };